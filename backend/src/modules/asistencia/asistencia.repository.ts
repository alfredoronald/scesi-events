import type { Prisma, PrismaClient } from "@prisma/client";

export type AsistenciaRow = Prisma.InscripcionGetPayload<{
  include: { asistencia: true; certificado: true };
}>;

export class AsistenciaRepository {
  constructor(private readonly db: PrismaClient) {}

  findInscripcionPorToken(qrToken: string): Promise<AsistenciaRow | null> {
    const code = qrToken.trim().toUpperCase();
    return this.db.inscripcion.findFirst({
      where: { OR: [{ qrToken: qrToken.trim() }, { codigo: code }] },
      include: { asistencia: true, certificado: true },
    });
  }

  findInscripcionPorId(id: string): Promise<AsistenciaRow | null> {
    return this.db.inscripcion.findFirst({ where: { id }, include: { asistencia: true, certificado: true } });
  }

  buscarInscripciones(eventoId: string, buscar: string): Promise<AsistenciaRow[]> {
    return this.db.inscripcion.findMany({
      where: {
        eventoId,
        estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] },
        OR: [
          { email: { contains: buscar, mode: "insensitive" } },
          { nombreCompleto: { contains: buscar, mode: "insensitive" } },
          { codigo: { contains: buscar.toUpperCase() } },
        ],
      },
      include: { asistencia: true, certificado: true },
      take: 10,
      orderBy: { nombreCompleto: "asc" },
    });
  }

  listPorEvento(
    eventoId: string,
    filtros: { estado: "todos" | "dentro" | "sin_ingreso"; buscar?: string },
    skip: number,
    take: number,
  ): Promise<{ rows: AsistenciaRow[]; total: number }> {
    const where: Prisma.InscripcionWhereInput = {
      eventoId,
      ...(filtros.estado === "dentro" ? { asistencia: { isNot: null } } : {}),
      ...(filtros.estado === "sin_ingreso" ? { asistencia: null } : {}),
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
    return this.db.$transaction([
      this.db.inscripcion.findMany({ where, include: { asistencia: true, certificado: true }, orderBy: { nombreCompleto: "asc" }, skip, take }),
      this.db.inscripcion.count({ where }),
    ]).then(([rows, total]) => ({ rows, total }));
  }

  /** Registra el check-in; idempotente por unique(inscripcion_id). */
  async registrarSiNoExiste(inscripcionId: string, registradoPorId: string): Promise<{ creado: boolean; horaCheckin: Date }> {
    const existente = await this.db.asistencia.findUnique({ where: { inscripcionId } });
    if (existente) return { creado: false, horaCheckin: existente.horaCheckin };
    try {
      const creado = await this.db.asistencia.create({ data: { inscripcionId, registradoPorId } });
      return { creado: true, horaCheckin: creado.horaCheckin };
    } catch {
      // Carrera concurrente: otro escaneo ganó.
      const existente = await this.db.asistencia.findUnique({ where: { inscripcionId } });
      if (!existente) throw new Error("No se pudo registrar la asistencia.");
      return { creado: false, horaCheckin: existente.horaCheckin };
    }
  }
}
