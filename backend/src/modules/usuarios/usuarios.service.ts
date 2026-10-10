import bcrypt from "bcryptjs";
import type { Usuario } from "@prisma/client";
import { NotFoundError, ConflictError, ValidationError } from "../../shared/errors/index.js";
import { toUsuarioDto } from "../auth/index.js";
import type { UsuariosRepository } from "./usuarios.repository.js";
import type {
  ActualizarPerfilInput,
  ActualizarUsuarioInput,
  CambiarPasswordInput,
  CrearUsuarioInput,
} from "./usuarios.schemas.js";

const BCRYPT_ROUNDS = 10;

export class UsuariosService {
  constructor(private readonly repository: UsuariosRepository) {}

  async listar(
    filtros: { rol?: "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE"; estado?: "activos" | "inactivos"; buscar?: string },
    page: number,
    pageSize: number,
  ) {
    const [usuarios, total] = await Promise.all([
      this.repository.list(filtros, (page - 1) * pageSize, pageSize),
      this.repository.count(filtros),
    ]);
    return { data: usuarios.map(toUsuarioDto), total };
  }

  /** Conteos por rol para las tarjetas del admin. */
  async conteosPorRol(): Promise<Record<string, { total: number }>> {
    const rows = await this.repository.countByRol();
    return Object.fromEntries(rows.map((row) => [row.rol, { total: row.total }]));
  }

  /** RF-AUTH-04: el admin crea cuentas de staff/organizador (y participante). */
  async crear(input: CrearUsuarioInput): Promise<Usuario> {
    const [porEmail, porUsername] = await Promise.all([
      this.repository.findByEmail(input.email),
      this.repository.findByUsername(input.username),
    ]);
    if (porEmail) throw new ConflictError("EMAIL_EN_USO", "Ese correo ya tiene una cuenta.");
    if (porUsername) throw new ConflictError("USERNAME_EN_USO", "Ese nombre de usuario está en uso.");
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    return this.repository.create({
      nombreCompleto: input.nombreCompleto,
      username: input.username,
      email: input.email.toLowerCase(),
      passwordHash,
      rol: input.rol,
      ...(input.celular !== undefined ? { celular: input.celular } : {}),
      ...(input.carrera !== undefined ? { carrera: input.carrera } : {}),
      ...(input.universidad !== undefined ? { universidad: input.universidad } : {}),
    });
  }

  async actualizar(id: string, input: ActualizarUsuarioInput): Promise<Usuario> {
    const usuario = await this.repository.findById(id);
    if (!usuario) throw new NotFoundError("Usuario");
    return this.repository.update(id, {
      ...(input.nombreCompleto !== undefined ? { nombreCompleto: input.nombreCompleto } : {}),
      ...(input.celular !== undefined ? { celular: input.celular } : {}),
      ...(input.carrera !== undefined ? { carrera: input.carrera } : {}),
      ...(input.universidad !== undefined ? { universidad: input.universidad } : {}),
      ...(input.rol !== undefined ? { rol: input.rol } : {}),
      ...(input.activo !== undefined ? { activo: input.activo } : {}),
    });
  }

  async perfil(usuarioId: string) {
    const usuario = await this.repository.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuario");
    return toUsuarioDto(usuario);
  }

  async actualizarPerfil(usuarioId: string, input: ActualizarPerfilInput): Promise<Usuario> {
    const usuario = await this.repository.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuario");
    return this.repository.update(usuarioId, {
      ...(input.nombreCompleto !== undefined ? { nombreCompleto: input.nombreCompleto } : {}),
      ...(input.celular !== undefined ? { celular: input.celular } : {}),
      ...(input.carrera !== undefined ? { carrera: input.carrera } : {}),
      ...(input.universidad !== undefined ? { universidad: input.universidad } : {}),
    });
  }

  async cambiarPassword(usuarioId: string, input: CambiarPasswordInput): Promise<void> {
    const usuario = await this.repository.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuario");
    if (!(await bcrypt.compare(input.actual, usuario.passwordHash))) {
      throw new ValidationError("La contraseña actual no coincide.", [
        { field: "actual", message: "La contraseña actual no coincide" },
      ]);
    }
    const passwordHash = await bcrypt.hash(input.nueva, BCRYPT_ROUNDS);
    await this.repository.update(usuarioId, { passwordHash });
  }
}
