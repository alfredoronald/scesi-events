import type { PrismaClient, Prisma } from "@prisma/client";

export type ListarUsuariosFiltros = {
  rol?: "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE";
  estado?: "activos" | "inactivos";
  buscar?: string;
};

export class UsuariosRepository {
  constructor(private readonly db: PrismaClient) {}

  list(filtros: ListarUsuariosFiltros, skip: number, take: number) {
    const where: Prisma.UsuarioWhereInput = {
      deletedAt: null,
      ...(filtros.rol ? { rol: filtros.rol } : {}),
      ...(filtros.estado ? { activo: filtros.estado === "activos" } : {}),
      ...(filtros.buscar
        ? {
            OR: [
              { nombreCompleto: { contains: filtros.buscar, mode: "insensitive" } },
              { email: { contains: filtros.buscar, mode: "insensitive" } },
              { username: { contains: filtros.buscar, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    return this.db.usuario.findMany({ where, orderBy: { createdAt: "desc" }, skip, take });
  }

  count(filtros: ListarUsuariosFiltros): Promise<number> {
    const where: Prisma.UsuarioWhereInput = {
      deletedAt: null,
      ...(filtros.rol ? { rol: filtros.rol } : {}),
      ...(filtros.estado ? { activo: filtros.estado === "activos" } : {}),
      ...(filtros.buscar
        ? {
            OR: [
              { nombreCompleto: { contains: filtros.buscar, mode: "insensitive" } },
              { email: { contains: filtros.buscar, mode: "insensitive" } },
              { username: { contains: filtros.buscar, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    return this.db.usuario.count({ where });
  }

  async countByRol(): Promise<Array<{ rol: string; total: number; activos: number }>> {
    const [todos, activos] = await Promise.all([
      this.db.usuario.groupBy({ by: ["rol"], where: { deletedAt: null }, _count: { _all: true } }),
      this.db.usuario.groupBy({ by: ["rol"], where: { deletedAt: null, activo: true }, _count: { _all: true } }),
    ]);
    const activosPorRol = new Map(activos.map((row) => [row.rol, row._count._all]));
    return todos.map((row) => ({
      rol: row.rol,
      total: row._count._all,
      activos: activosPorRol.get(row.rol) ?? 0,
    }));
  }

  findById(id: string) {
    return this.db.usuario.findFirst({ where: { id, deletedAt: null } });
  }

  findByEmail(email: string) {
    return this.db.usuario.findFirst({ where: { email: email.toLowerCase(), deletedAt: null } });
  }

  findByUsername(username: string) {
    return this.db.usuario.findFirst({ where: { username, deletedAt: null } });
  }

  create(data: Prisma.UsuarioCreateInput) {
    return this.db.usuario.create({ data });
  }

  update(id: string, data: Prisma.UsuarioUpdateInput) {
    return this.db.usuario.update({ where: { id }, data });
  }
}
