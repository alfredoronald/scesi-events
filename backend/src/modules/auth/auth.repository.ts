import type { PrismaClient } from "@prisma/client";
import type { Usuario } from "@prisma/client";

export class AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  findByEmailOrUsername(identifier: string): Promise<Usuario | null> {
    const email = identifier.toLowerCase();
    return this.db.usuario.findFirst({
      where: { OR: [{ email }, { username: identifier }], deletedAt: null },
    });
  }

  findByEmail(email: string): Promise<Usuario | null> {
    return this.db.usuario.findFirst({ where: { email: email.toLowerCase(), deletedAt: null } });
  }

  findByUsername(username: string): Promise<Usuario | null> {
    return this.db.usuario.findFirst({ where: { username, deletedAt: null } });
  }

  findById(id: string): Promise<Usuario | null> {
    return this.db.usuario.findFirst({ where: { id, deletedAt: null } });
  }

  async updateUltimoAcceso(id: string, fecha: Date): Promise<void> {
    await this.db.usuario.update({ where: { id }, data: { ultimoAcceso: fecha } });
  }

  createUsuario(data: {
    nombreCompleto: string;
    username: string;
    email: string;
    passwordHash: string;
    celular?: string;
    carrera?: string;
    universidad?: string;
    rol?: "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE";
  }): Promise<Usuario> {
    return this.db.usuario.create({ data });
  }

  async saveRefreshToken(data: { usuarioId: string; tokenHash: string; expiraEn: Date }): Promise<void> {
    await this.db.refreshToken.create({ data });
  }

  findRefreshToken(tokenHash: string) {
    return this.db.refreshToken.findUnique({ where: { tokenHash }, include: { usuario: true } });
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await this.db.refreshToken.updateMany({ where: { tokenHash }, data: { revocado: true } });
  }

  async revokeAllUserTokens(usuarioId: string): Promise<void> {
    await this.db.refreshToken.updateMany({ where: { usuarioId }, data: { revocado: true } });
  }
}
