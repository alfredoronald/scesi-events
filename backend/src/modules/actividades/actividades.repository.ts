import type { Prisma, PrismaClient } from "@prisma/client";

export class ActividadesRepository {
  constructor(private readonly db: PrismaClient) {}

  listPorEvento(eventoId: string) {
    return this.db.actividad.findMany({ where: { eventoId }, orderBy: { horaInicio: "asc" } });
  }

  findById(id: string) {
    return this.db.actividad.findFirst({ where: { id }, include: { evento: true } });
  }

  create(data: Prisma.ActividadUncheckedCreateInput) {
    return this.db.actividad.create({ data });
  }

  update(id: string, data: Prisma.ActividadUpdateInput) {
    return this.db.actividad.update({ where: { id }, data });
  }

  delete(id: string): Promise<void> {
    return this.db.actividad.delete({ where: { id } }).then(() => undefined);
  }

  participacionExiste(actividadId: string, inscripcionId: string) {
    return this.db.participacion.findUnique({
      where: { actividadId_inscripcionId: { actividadId, inscripcionId } },
    });
  }

  createParticipacion(data: Prisma.ParticipacionUncheckedCreateInput) {
    return this.db.participacion.create({ data });
  }

  tieneAsistencia(inscripcionId: string) {
    return this.db.asistencia.findUnique({ where: { inscripcionId } });
  }

  findInscripcion(id: string) {
    return this.db.inscripcion.findFirst({ where: { id }, include: { evento: true } });
  }
}
