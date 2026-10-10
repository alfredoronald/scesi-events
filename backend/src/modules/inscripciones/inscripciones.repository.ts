import type { Prisma, PrismaClient } from "@prisma/client";

export type InscripcionConRelaciones = Prisma.InscripcionGetPayload<{
  include: {
    evento: true;
    asistencia: true;
    certificado: true;
  };
}>;

const PAGO_PRISMA = {
  no_aplica: "NO_APLICA",
  pendiente: "PENDIENTE",
  confirmado: "CONFIRMADO",
  rechazado: "RECHAZADO",
} as const;

export class InscripcionesRepository {
  constructor(private readonly db: PrismaClient) {}

  findByEventoYEmail(eventoId: string, email: string) {
    return this.db.inscripcion.findUnique({
      where: { eventoId_email: { eventoId, email: email.toLowerCase() } },
    });
  }

  findById(id: string): Promise<InscripcionConRelaciones | null> {
    return this.db.inscripcion.findFirst({
      where: { id },
      include: { evento: true, asistencia: true, certificado: true },
    });
  }

  findByCodigo(codigo: string): Promise<InscripcionConRelaciones | null> {
    return this.db.inscripcion.findFirst({
      where: { codigo: codigo.trim().toUpperCase() },
      include: { evento: true, asistencia: true, certificado: true },
    });
  }

  findByQrToken(qrToken: string): Promise<InscripcionConRelaciones | null> {
    return this.db.inscripcion.findFirst({
      where: { qrToken },
      include: { evento: true, asistencia: true, certificado: true },
    });
  }

  /** Inscripciones del usuario autenticado (mis entradas). */
  listByUsuario(usuarioId: string): Promise<InscripcionConRelaciones[]> {
    return this.db.inscripcion.findMany({
      where: { usuarioId },
      include: { evento: true, asistencia: true, certificado: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Inscripciones por email (para participantes sin cuenta). */
  listByEmail(email: string): Promise<InscripcionConRelaciones[]> {
    return this.db.inscripcion.findMany({
      where: { email: email.toLowerCase() },
      include: { evento: true, asistencia: true, certificado: true },
      orderBy: { createdAt: "desc" },
    });
  }

  listPorEvento(
    eventoId: string,
    filtros: { estado: "confirmados" | "pendientes" | "rechazados" | "todos"; buscar?: string },
    skip: number,
    take: number,
  ): Promise<InscripcionConRelaciones[]> {
    return this.db.inscripcion.findMany({
      where: this.wherePorEvento(eventoId, filtros),
      include: { evento: true, asistencia: true, certificado: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  countPorEvento(
    eventoId: string,
    filtros: { estado: "confirmados" | "pendientes" | "rechazados" | "todos"; buscar?: string },
  ): Promise<number> {
    return this.db.inscripcion.count({ where: this.wherePorEvento(eventoId, filtros) });
  }

  private wherePorEvento(
    eventoId: string,
    filtros: { estado: "confirmados" | "pendientes" | "rechazados" | "todos"; buscar?: string },
  ): Prisma.InscripcionWhereInput {
    return {
      eventoId,
      estadoPago: { in: this.estadosPagoDe(filtros.estado) },
      ...(filtros.buscar
        ? {
            OR: [
              { nombreCompleto: { contains: filtros.buscar, mode: "insensitive" } },
              { email: { contains: filtros.buscar, mode: "insensitive" } },
              { codigo: { contains: filtros.buscar.toUpperCase() } },
            ],
          }
        : {}),
    };
  }

  private estadosPagoDe(estado: "confirmados" | "pendientes" | "rechazados" | "todos"): Array<"NO_APLICA" | "PENDIENTE" | "CONFIRMADO" | "RECHAZADO"> {
    switch (estado) {
      case "confirmados":
        return ["NO_APLICA", "CONFIRMADO"];
      case "pendientes":
        return ["PENDIENTE"];
      case "rechazados":
        return ["RECHAZADO"];
      default:
        return ["NO_APLICA", "PENDIENTE", "CONFIRMADO", "RECHAZADO"];
    }
  }

  countConfirmados(eventoId: string): Promise<number> {
    return this.db.inscripcion.count({
      where: { eventoId, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
    });
  }

  codigoExists(codigo: string): Promise<boolean> {
    return this.db.inscripcion
      .findFirst({ where: { codigo }, select: { id: true } })
      .then((found) => found !== null);
  }

  async createInscribiendo(
    datos: Prisma.InscripcionUncheckedCreateInput,
    tx: Prisma.TransactionClient,
  ): Promise<InscripcionConRelaciones> {
    return tx.inscripcion.create({
      data: datos,
      include: { evento: true, asistencia: true, certificado: true },
    });
  }

  update(id: string, data: Prisma.InscripcionUpdateInput): Promise<InscripcionConRelaciones> {
    return this.db.inscripcion.update({ where: { id }, data, include: { evento: true, asistencia: true, certificado: true } });
  }

  /** Bloquea la fila del evento para la reserva de cupo (SELECT … FOR UPDATE). */
  static async bloquearEvento(tx: Prisma.TransactionClient, eventoId: string): Promise<number | null> {
    const rows = await tx.$queryRawUnsafe<Array<{ cupo_maximo: number | null }>>(
      "SELECT cupo_maximo FROM eventos WHERE id = $1 FOR UPDATE",
      eventoId,
    );
    return rows[0]?.cupo_maximo ?? null;
  }
}

export { PAGO_PRISMA };
