import type { Prisma, PrismaClient } from "@prisma/client";

export class FeedbackRepository {
  constructor(private readonly db: PrismaClient) {}

  findInscripcion(id: string) {
    return this.db.inscripcion.findFirst({ where: { id }, include: { evento: true, asistencia: true } });
  }

  findInscripcionPorUsuario(eventoId: string, usuarioId: string) {
    return this.db.inscripcion.findFirst({ where: { eventoId, usuarioId }, include: { evento: true, asistencia: true } });
  }

  calificacionEventoPorInscripcion(inscripcionId: string) {
    return this.db.calificacionEvento.findUnique({ where: { inscripcionId } });
  }

  createCalificacionEvento(data: Prisma.CalificacionEventoUncheckedCreateInput) {
    return this.db.calificacionEvento.create({ data });
  }

  findActividad(id: string) {
    return this.db.actividad.findFirst({ where: { id }, include: { evento: true } });
  }

  calificacionActividadExiste(actividadId: string, inscripcionId: string) {
    return this.db.calificacionActividad.findUnique({
      where: { actividadId_inscripcionId: { actividadId, inscripcionId } },
    });
  }

  createCalificacionActividad(data: Prisma.CalificacionActividadUncheckedCreateInput) {
    return this.db.calificacionActividad.create({ data });
  }

  /** Resumen de calificaciones de un evento con nombres para la vista organizador. */
  resumenEvento(eventoId: string) {
    return this.db.calificacionEvento.findMany({
      where: { inscripcion: { eventoId } },
      include: { inscripcion: { select: { nombreCompleto: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  resumenActividad(actividadId: string) {
    return this.db.calificacionActividad.findMany({
      where: { actividadId },
      orderBy: { createdAt: "desc" },
    });
  }
}

/** NPS = % promotores (9–10) − % detractores (0–6), sobre quienes respondieron. */
export function calcularNps(npsValues: number[]): number | null {
  if (npsValues.length === 0) return null;
  const promotores = npsValues.filter((n) => n >= 9).length;
  const detractores = npsValues.filter((n) => n <= 6).length;
  return Math.round(((promotores - detractores) / npsValues.length) * 100);
}
