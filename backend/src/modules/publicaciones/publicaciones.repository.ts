import type { Prisma, PrismaClient } from "@prisma/client";

export type PublicacionRow = Prisma.PublicacionGetPayload<{
  include: { autor: true; categorias: { include: { categoria: true } }; _count: { select: { likes: true; comentarios: true } } };
}>;

export class PublicacionesRepository {
  constructor(private readonly db: PrismaClient) {}

  list(
    filtros: { tipo?: "blog" | "paper"; categoria?: string; buscar?: string; soloPublicados: boolean },
    skip: number,
    take: number,
  ) {
    return this.db.publicacion.findMany({
      where: this.where(filtros),
      include: {
        autor: true,
        categorias: { include: { categoria: true } },
        _count: { select: { likes: true, comentarios: true } },
      },
      orderBy: [{ publicadoEn: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    });
  }

  count(filtros: { tipo?: "blog" | "paper"; categoria?: string; buscar?: string; soloPublicados: boolean }): Promise<number> {
    return this.db.publicacion.count({ where: this.where(filtros) });
  }

  private where(filtros: {
    tipo?: "blog" | "paper";
    categoria?: string;
    buscar?: string;
    soloPublicados: boolean;
  }): Prisma.PublicacionWhereInput {
    return {
      ...(filtros.soloPublicados ? { estado: "PUBLICADO" } : {}),
      ...(filtros.tipo ? { tipo: filtros.tipo === "blog" ? "BLOG" : "PAPER" } : {}),
      ...(filtros.categoria ? { categorias: { some: { categoria: { nombre: filtros.categoria } } } } : {}),
      ...(filtros.buscar
        ? {
            OR: [
              { titulo: { contains: filtros.buscar, mode: "insensitive" } },
              { resumen: { contains: filtros.buscar, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  findBySlug(slug: string) {
    return this.db.publicacion.findFirst({
      where: { slug },
      include: {
        autor: true,
        categorias: { include: { categoria: true } },
        _count: { select: { likes: true, comentarios: true } },
      },
    });
  }

  findById(id: string) {
    return this.db.publicacion.findFirst({
      where: { id },
      include: {
        autor: true,
        categorias: { include: { categoria: true } },
        _count: { select: { likes: true, comentarios: true } },
      },
    });
  }

  slugExists(slug: string): Promise<boolean> {
    return this.db.publicacion.findFirst({ where: { slug }, select: { id: true } }).then((f) => f !== null);
  }

  create(data: Prisma.PublicacionUncheckedCreateInput, categorias: string[]) {
    return this.db.publicacion.create({
      data: {
        ...data,
        ...(categorias.length > 0
          ? { categorias: { create: categorias.map((nombre) => ({ categoria: { connectOrCreate: { where: { nombre }, create: { nombre } } } })) } }
          : {}),
      },
      include: {
        autor: true,
        categorias: { include: { categoria: true } },
        _count: { select: { likes: true, comentarios: true } },
      },
    });
  }

  update(id: string, data: Prisma.PublicacionUpdateInput, categorias?: string[]) {
    return this.db.$transaction(async (tx) => {
      if (categorias !== undefined) {
        await tx.publicacionCategoria.deleteMany({ where: { publicacionId: id } });
        if (categorias.length > 0) {
          for (const nombre of categorias) {
            const categoria = await tx.categoria.upsert({ where: { nombre }, create: { nombre }, update: {} });
            await tx.publicacionCategoria.create({ data: { publicacionId: id, categoriaId: categoria.id } });
          }
        }
      }
      return tx.publicacion.update({
        where: { id },
        data,
        include: {
          autor: true,
          categorias: { include: { categoria: true } },
          _count: { select: { likes: true, comentarios: true } },
        },
      });
    });
  }

  delete(id: string): Promise<void> {
    return this.db.publicacion.delete({ where: { id } }).then(() => undefined);
  }

  incrementarVistas(id: string): Promise<void> {
    return this.db.publicacion.update({ where: { id }, data: { vistas: { increment: 1 } } }).then(() => undefined);
  }

  incrementarDescargas(id: string): Promise<void> {
    return this.db.publicacion.update({ where: { id }, data: { descargas: { increment: 1 } } }).then(() => undefined);
  }

  findLike(publicacionId: string, usuarioId: string) {
    return this.db.publicacionLike.findUnique({
      where: { publicacionId_usuarioId: { publicacionId, usuarioId } },
    });
  }

  createLike(publicacionId: string, usuarioId: string): Promise<void> {
    return this.db.publicacionLike.create({ data: { publicacionId, usuarioId } }).then(() => undefined);
  }

  deleteLike(publicacionId: string, usuarioId: string): Promise<void> {
    return this.db.publicacionLike
      .delete({ where: { publicacionId_usuarioId: { publicacionId, usuarioId } } })
      .then(() => undefined);
  }

  countLikes(publicacionId: string): Promise<number> {
    return this.db.publicacionLike.count({ where: { publicacionId } });
  }

  /** Likes del usuario sobre un conjunto de publicaciones (para `likedByMe`). */
  async likeIdsDeUsuario(usuarioId: string, publicacionIds: string[]): Promise<Set<string>> {
    if (publicacionIds.length === 0) return new Set();
    const rows = await this.db.publicacionLike.findMany({
      where: { usuarioId, publicacionId: { in: publicacionIds } },
      select: { publicacionId: true },
    });
    return new Set(rows.map((r) => r.publicacionId));
  }

  comentarios(publicacionId: string) {
    return this.db.publicacionComentario.findMany({
      where: { publicacionId },
      include: { usuario: true },
      orderBy: { createdAt: "desc" },
    });
  }

  createComentario(data: Prisma.PublicacionComentarioUncheckedCreateInput) {
    return this.db.publicacionComentario.create({ data, include: { usuario: true } });
  }

  findComentario(id: string) {
    return this.db.publicacionComentario.findFirst({ where: { id }, include: { usuario: true, publicacion: true } });
  }

  deleteComentario(id: string): Promise<void> {
    return this.db.publicacionComentario.delete({ where: { id } }).then(() => undefined);
  }
}
