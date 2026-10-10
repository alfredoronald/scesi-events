import type { Prisma, PrismaClient } from "@prisma/client";

export type EventoConOrganizador = Prisma.EventoGetPayload<{ include: { organizador: true } }>;

export type ListarEventosFiltros = {
  periodo?: "proximos" | "pasados" | "todos";
  tipo?: "charla" | "taller" | "hackathon" | "congreso" | "ctf";
  estado?: "borrador" | "publicado" | "en_curso" | "cerrado";
  buscar?: string;
  organizadorId?: string;
  staffUsuarioId?: string;
  soloPublicados: boolean;
};

const TIPO_MAP = {
  charla: "CHARLA",
  taller: "TALLER",
  hackathon: "HACKATHON",
  congreso: "CONGRESO",
  ctf: "CTF",
} as const;

const ESTADO_MAP = {
  borrador: "BORRADOR",
  publicado: "PUBLICADO",
  en_curso: "EN_CURSO",
  cerrado: "CERRADO",
} as const;

export class EventosRepository {
  constructor(private readonly db: PrismaClient) {}

  buildWhere(filtros: ListarEventosFiltros): Prisma.EventoWhereInput {
    const now = new Date();
    return {
      deletedAt: null,
      ...(filtros.soloPublicados ? { estado: { in: ["PUBLICADO", "EN_CURSO", "CERRADO"] } } : {}),
      ...(filtros.estado ? { estado: ESTADO_MAP[filtros.estado] } : {}),
      ...(filtros.tipo ? { tipo: TIPO_MAP[filtros.tipo] } : {}),
      ...(filtros.organizadorId ? { organizadorId: filtros.organizadorId } : {}),
      ...(filtros.staffUsuarioId ? { staff: { some: { usuarioId: filtros.staffUsuarioId } } } : {}),
      ...(filtros.buscar
        ? { OR: [{ titulo: { contains: filtros.buscar, mode: "insensitive" } }, { lugar: { contains: filtros.buscar, mode: "insensitive" } }] }
        : {}),
      ...(filtros.periodo === "proximos" ? { fechaFin: { gte: now } } : {}),
      ...(filtros.periodo === "pasados" ? { fechaFin: { lt: now } } : {}),
    };
  }

  async list(filtros: ListarEventosFiltros, skip: number, take: number): Promise<EventoConOrganizador[]> {
    return this.db.evento.findMany({
      where: this.buildWhere(filtros),
      include: { organizador: true },
      orderBy: [{ fechaInicio: filtros.periodo === "pasados" ? "desc" : "asc" }],
      skip,
      take,
    });
  }

  count(filtros: ListarEventosFiltros): Promise<number> {
    return this.db.evento.count({ where: this.buildWhere(filtros) });
  }

  findById(id: string): Promise<EventoConOrganizador | null> {
    return this.db.evento.findFirst({
      where: { id, deletedAt: null },
      include: { organizador: true, staff: { include: { usuario: true } } },
    });
  }

  findBySlug(slug: string): Promise<EventoConOrganizador | null> {
    return this.db.evento.findFirst({
      where: { slug, deletedAt: null },
      include: { organizador: true, staff: { include: { usuario: true } } },
    });
  }

  countInscritosConfirmados(eventoId: string): Promise<number> {
    return this.db.inscripcion.count({
      where: { eventoId, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
    });
  }

  inscritosConfirmadosPorEvento(eventoIds: string[]): Promise<Map<string, number>> {
    return this.db.inscripcion
      .groupBy({ by: ["eventoId"], where: { eventoId: { in: eventoIds }, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } }, _count: { _all: true } })
      .then((rows) => new Map(rows.map((row) => [row.eventoId, row._count._all])));
  }

  async slugExists(slug: string): Promise<boolean> {
    const found = await this.db.evento.findFirst({ where: { slug }, select: { id: true } });
    return found !== null;
  }

  create(data: Prisma.EventoCreateInput): Promise<EventoConOrganizador> {
    return this.db.evento.create({ data, include: { organizador: true } });
  }

  update(id: string, data: Prisma.EventoUpdateInput): Promise<EventoConOrganizador> {
    return this.db.evento.update({ where: { id }, data, include: { organizador: true } });
  }

  /** Borrado lógico (solo admin). */
  softDelete(id: string): Promise<void> {
    return this.db.evento
      .update({ where: { id }, data: { deletedAt: new Date() } })
      .then(() => undefined);
  }

  replaceStaff(eventoId: string, staffIds: string[]): Promise<void> {
    return this.db.$transaction([
      this.db.eventoStaff.deleteMany({ where: { eventoId } }),
      this.db.eventoStaff.createMany({ data: staffIds.map((usuarioId) => ({ eventoId, usuarioId })) }),
    ]).then(() => undefined);
  }

  idsInscritosConfirmados(eventoId: string): Promise<string[]> {
    return this.db.inscripcion
      .findMany({
        where: { eventoId, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
        select: { id: true },
      })
      .then((rows) => rows.map((row) => row.id));
  }
}
