import { BusinessRuleError, ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";
import { calcularNps, type FeedbackRepository } from "./feedback.repository.js";
import type { CalificarActividadInput, CalificarEventoInput } from "./feedback.schemas.js";

export class FeedbackService {
  constructor(
    private readonly repository: FeedbackRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
  ) {}

  async calificarEvento(eventoIdOrSlug: string, input: CalificarEventoInput, user: AuthUser) {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    const inscripcion = await this.repository.findInscripcionPorUsuario(evento.id, user.id);
    if (!inscripcion) {
      throw new ForbiddenError("No estás inscrito a este evento.");
    }
    if (!inscripcion.asistencia) {
      throw new BusinessRuleError("ASISTENCIA_REQUERIDA", "Solo puedes calificar eventos a los que asististe.");
    }
    const existente = await this.repository.calificacionEventoPorInscripcion(inscripcion.id);
    if (existente) {
      throw new ConflictError("YA_CALIFICADO", "Ya enviaste tu valoración de este evento.");
    }
    const creada = await this.repository.createCalificacionEvento({
      inscripcionId: inscripcion.id,
      organizacion: input.organizacion ?? input.score,
      contenido: input.contenido ?? input.score,
      general: input.score,
      ...(input.nps !== undefined ? { nps: input.nps } : {}),
      ...(input.comentario !== undefined ? { comentario: input.comentario } : {}),
    });
    return { id: creada.id, eventoId: evento.id, score: creada.general, comentario: creada.comentario };
  }

  /** Calificar actividad (1–5), una por inscripción y actividad. */
  async calificarActividad(actividadId: string, input: CalificarActividadInput, user: AuthUser) {
    const actividad = await this.repository.findActividad(actividadId);
    if (!actividad) throw new NotFoundError("Actividad");
    const inscripcion = await this.repository.findInscripcionPorUsuario(actividad.eventoId, user.id);
    if (!inscripcion) throw new ForbiddenError("No estás inscrito a este evento.");
    if (!inscripcion.asistencia) {
      throw new BusinessRuleError("ASISTENCIA_REQUERIDA", "Solo puedes calificar actividades de eventos a los que asististe.");
    }
    const existente = await this.repository.calificacionActividadExiste(actividadId, inscripcion.id);
    if (existente) {
      throw new ConflictError("YA_CALIFICADO", "Ya calificaste esta actividad.");
    }
    const creada = await this.repository.createCalificacionActividad({
      actividadId,
      inscripcionId: inscripcion.id,
      puntaje: input.score,
      ...(input.comentario !== undefined ? { comentario: input.comentario } : {}),
    });
    return { id: creada.id, actividadId, score: creada.puntaje };
  }

  /** Resumen por evento: promedios, distribución 1–5, NPS y comentarios. */
  async resumenEvento(eventoIdOrSlug: string, user: AuthUser) {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    this.eventosPolicies.puedeVerInscritos(user, evento);
    const calificaciones = await this.repository.resumenEvento(evento.id);
    const total = calificaciones.length;
    const promedio = (valores: number[]) => (valores.length === 0 ? 0 : valores.reduce((a, b) => a + b, 0) / valores.length);

    const distribucion = [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: calificaciones.filter((c) => c.general === score).length,
    }));
    const npsValores = calificaciones.map((c) => c.nps).filter((n): n is number => n !== null);

    return {
      eventoId: evento.id,
      total,
      promedioGeneral: Number(promedio(calificaciones.map((c) => c.general)).toFixed(2)),
      promedioOrganizacion: Number(promedio(calificaciones.map((c) => c.organizacion)).toFixed(2)),
      promedioContenido: Number(promedio(calificaciones.map((c) => c.contenido)).toFixed(2)),
      nps: calcularNps(npsValores),
      distribucion,
      comentarios: calificaciones
        .filter((c) => c.comentario && c.comentario.trim().length > 0)
        .map((c) => ({
          id: c.id,
          autor: c.inscripcion.nombreCompleto,
          score: c.general,
          comentario: c.comentario ?? "",
          fecha: c.createdAt.toISOString(),
          respuesta: c.respuesta,
        })),
    };
  }

  /** Resumen por actividad (promedios para ranking de métricas). */
  async resumenActividad(actividadId: string) {
    const calificaciones = await this.repository.resumenActividad(actividadId);
    const promedio =
      calificaciones.length === 0
        ? 0
        : calificaciones.reduce((suma, c) => suma + c.puntaje, 0) / calificaciones.length;
    return { actividadId, total: calificaciones.length, promedio: Number(promedio.toFixed(2)) };
  }
}
