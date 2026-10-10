import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { Usuario } from "@prisma/client";
import { env } from "../../config/env.js";
import { sha256 } from "../../shared/utils/crypto.js";
import { UnauthorizedError, ForbiddenError } from "../../shared/errors/index.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";
import type { AuthPayload, UsuarioDto } from "./auth.types.js";

const BCRYPT_ROUNDS = 10;

function ttlSegundos(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) return 7 * 24 * 3600;
  const cantidad = Number(match[1] ?? 1);
  const unidad = match[2] ?? "d";
  const ms: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return cantidad * (ms[unidad] ?? 86400);
}

export function toUsuarioDto(usuario: Usuario): UsuarioDto {
  return {
    id: usuario.id,
    nombreCompleto: usuario.nombreCompleto,
    username: usuario.username,
    email: usuario.email,
    celular: usuario.celular,
    carrera: usuario.carrera,
    universidad: usuario.universidad,
    rol: usuario.rol,
    activo: usuario.activo,
    ultimoAcceso: usuario.ultimoAcceso?.toISOString() ?? null,
    createdAt: usuario.createdAt.toISOString(),
  };
}

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  /** RF-AUTH-01/02: login con correo o usuario + contraseña → tokens. */
  async login(input: LoginInput): Promise<{ payload: AuthPayload; refreshToken: string }> {
    const usuario = await this.repository.findByEmailOrUsername(input.identifier);
    if (!usuario || !(await bcrypt.compare(input.password, usuario.passwordHash))) {
      throw new UnauthorizedError("Credenciales incorrectas.");
    }
    this.assertPuedeIngresar(usuario);
    await this.repository.updateUltimoAcceso(usuario.id, new Date());
    return this.emitirTokens(usuario);
  }

  /** RF-AUTH-03: registro público solo para participantes. */
  async register(input: RegisterInput): Promise<{ payload: AuthPayload; refreshToken: string }> {
    const [porEmail, porUsername] = await Promise.all([
      this.repository.findByEmail(input.email),
      this.repository.findByUsername(input.username),
    ]);
    if (porEmail) throw new UnauthorizedError("Ese correo ya tiene una cuenta.");
    if (porUsername) throw new UnauthorizedError("Ese nombre de usuario está en uso.");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const usuario = await this.repository.createUsuario({
      nombreCompleto: input.nombreCompleto,
      username: input.username,
      email: input.email.toLowerCase(),
      passwordHash,
      ...(input.celular !== undefined ? { celular: input.celular } : {}),
      ...(input.carrera !== undefined ? { carrera: input.carrera } : {}),
      ...(input.universidad !== undefined ? { universidad: input.universidad } : {}),
      rol: "PARTICIPANTE",
    });
    return this.emitirTokens(usuario);
  }

  /** RF-AUTH-02: renovación con rotación y revocación del token anterior. */
  async refresh(refreshToken: string): Promise<{ payload: AuthPayload; refreshToken: string }> {
    const tokenHash = sha256(refreshToken);
    const registro = await this.repository.findRefreshToken(tokenHash);
    if (!registro || registro.revocado || registro.expiraEn < new Date()) {
      throw new UnauthorizedError("Sesión expirada. Inicia sesión de nuevo.");
    }
    this.assertPuedeIngresar(registro.usuario);
    await this.repository.revokeRefreshToken(tokenHash);
    return this.emitirTokens(registro.usuario);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await this.repository.revokeRefreshToken(sha256(refreshToken));
    }
  }

  async me(usuarioId: string): Promise<UsuarioDto> {
    const usuario = await this.repository.findById(usuarioId);
    if (!usuario) throw new UnauthorizedError("Sesión inválida.");
    return toUsuarioDto(usuario);
  }

  private assertPuedeIngresar(usuario: Usuario): void {
    if (!usuario.activo || usuario.deletedAt !== null) {
      throw new ForbiddenError("La cuenta está desactivada. Contacta al administrador.");
    }
  }

  private async emitirTokens(usuario: Usuario): Promise<{ payload: AuthPayload; refreshToken: string }> {
    const accessToken = jwt.sign({ sub: usuario.id, rol: usuario.rol }, env.jwt.accessSecret, {
      expiresIn: ttlSegundos(env.jwt.accessTtl),
    });
    const refreshToken = jwt.sign({ sub: usuario.id, typ: "refresh" }, env.jwt.refreshSecret, {
      jwtid: randomUUID(),
      expiresIn: ttlSegundos(env.jwt.refreshTtl),
    });
    // Solo se persiste el hash del refresh token (PRD §10).
    await this.repository.saveRefreshToken({
      usuarioId: usuario.id,
      tokenHash: sha256(refreshToken),
      expiraEn: new Date(Date.now() + ttlSegundos(env.jwt.refreshTtl) * 1000),
    });
    return {
      payload: { accessToken, expiresIn: env.jwt.accessTtl, usuario: toUsuarioDto(usuario) },
      refreshToken,
    };
  }
}
