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
    filtros: { estado: "todos" | "dentro" | "salieron" | "sin_ingreso"; buscar?: string },
    skip: number,
    take: number,
  ): Promise<{ rows: AsistenciaRow[]; total: number }> {
    const where: Prisma.InscripcionWhereInput = {
      eventoId,
      ...(filtros.estado === "dentro" ? { asistencia: { is: { horaCheckout: null } } } : {}),
      ...(filtros.estado === "salieron" ? { asistencia: { is: { horaCheckout: { not: null } } } } : {}),
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
  async registrarSiNoExiste(inscripcionId: string, registradoPorId: string, puntoControl = "Ingreso principal"): Promise<{ creado: boolean; horaCheckin: Date }> {
    const existente = await this.db.asistencia.findUnique({ where: { inscripcionId } });
    if (existente && !existente.horaCheckout) return { creado: false, horaCheckin: existente.horaCheckin };
    if (existente) {
      const now = new Date();
      const changed = await this.db.$transaction(async (tx) => {
        const update = await tx.asistencia.updateMany({ where: { id: existente.id, horaCheckout: { not: null } }, data: { horaCheckin: now, horaCheckout: null, puntoControl, registradoPorId } });
        if (update.count) await tx.movimientoAsistencia.create({ data: { asistenciaId: existente.id, tipo: "ingreso", fecha: now, puntoControl, registradoPorId } });
        return update.count;
      });
      return { creado: Boolean(changed), horaCheckin: now };
    }
    try {
      const creado = await this.db.asistencia.create({ data: { inscripcionId, registradoPorId, puntoControl, movimientos: { create: { tipo: "ingreso", puntoControl, registradoPorId } } } });
      return { creado: true, horaCheckin: creado.horaCheckin };
    } catch {
      // Carrera concurrente: otro escaneo ganó.
      const existente = await this.db.asistencia.findUnique({ where: { inscripcionId } });
      if (!existente) throw new Error("No se pudo registrar la asistencia.");
      return { creado: false, horaCheckin: existente.horaCheckin };
    }
  }

  async registrarSalida(inscripcionId: string, registradoPorId: string, puntoControl: string) {
    return this.db.$transaction(async (tx) => {
      const record = await tx.asistencia.findUnique({ where: { inscripcionId } });
      if (!record) return null;
      if (record.horaCheckout) return record;
      const fecha = new Date();
      const result = await tx.asistencia.updateMany({ where: { id: record.id, horaCheckout: null }, data: { horaCheckout: fecha, puntoControl } });
      if (result.count) await tx.movimientoAsistencia.create({ data: { asistenciaId: record.id, tipo: "salida", fecha, puntoControl, registradoPorId } });
      return tx.asistencia.findUnique({ where: { id: record.id } });
    });
  }
}
