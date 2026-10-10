import type { Prisma, PrismaClient } from "@prisma/client";

export class ProyectosRepository {
  constructor(private readonly db: PrismaClient) {}

  list(filtros: { buscar?: string; soloPublicados: boolean }, skip: number, take: number) {
    return this.db.proyecto.findMany({
      where: this.where(filtros),
      include: { colaboradores: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  count(filtros: { buscar?: string; soloPublicados: boolean }): Promise<number> {
    return this.db.proyecto.count({ where: this.where(filtros) });
  }

  private where(filtros: { buscar?: string; soloPublicados: boolean }): Prisma.ProyectoWhereInput {
    return {
      ...(filtros.soloPublicados ? { publicado: true } : {}),
      ...(filtros.buscar
        ? {
            OR: [
              { titulo: { contains: filtros.buscar, mode: "insensitive" } },
              { descripcion: { contains: filtros.buscar, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  findById(id: string) {
    return this.db.proyecto.findFirst({ where: { id }, include: { colaboradores: true } });
  }

  create(data: Prisma.ProyectoUncheckedCreateInput, colaboradores: Array<{ nombre: string; usuarioId?: string }>) {
    return this.db.proyecto.create({
      data: { ...data, colaboradores: { create: colaboradores } },
      include: { colaboradores: true },
    });
  }

  update(id: string, data: Prisma.ProyectoUpdateInput, colaboradores?: Array<{ nombre: string; usuarioId?: string }>) {
    return this.db.$transaction(async (tx) => {
      if (colaboradores !== undefined) {
        await tx.proyectoColaborador.deleteMany({ where: { proyectoId: id } });
        if (colaboradores.length > 0) {
          await tx.proyectoColaborador.createMany({
            data: colaboradores.map((c) => ({ proyectoId: id, nombre: c.nombre, ...(c.usuarioId ? { usuarioId: c.usuarioId } : {}) })),
          });
        }
      }
      return tx.proyecto.update({ where: { id }, data, include: { colaboradores: true } });
    });
  }

  delete(id: string): Promise<void> {
    return this.db.proyecto.delete({ where: { id } }).then(() => undefined);
  }
}
