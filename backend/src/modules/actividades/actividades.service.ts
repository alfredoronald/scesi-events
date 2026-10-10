import { BusinessRuleError, NotFoundError, ConflictError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";
import type { ActividadesRepository } from "./actividades.repository.js";
import type { ActividadDto, ActualizarActividadInput, CrearActividadInput, CrearParticipacionInput } from "./actividades.schemas.js";
import type { Actividad } from "@prisma/client";

export class ActividadesService {
  constructor(
    private readonly repository: ActividadesRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
  ) {}

  async listarPorEvento(eventoIdOrSlug: string): Promise<ActividadDto[]> {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    if (evento.estado === "BORRADOR") throw new NotFoundError("Evento");
    const actividades = await this.repository.listPorEvento(evento.id);
    return actividades.map(this.toDto);
  }

  async crear(eventoIdOrSlug: string, input: CrearActividadInput, user: AuthUser): Promise<ActividadDto> {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    this.eventosPolicies.puedeModificar(user, evento);
    const actividad = await this.repository.create({
      eventoId: evento.id,
      titulo: input.titulo,
      descripcion: input.descripcion,
      ponente: input.ponente,
      ...(input.lugar !== undefined ? { lugar: input.lugar } : {}),
      horaInicio: input.horaInicio,
      horaFin: input.horaFin,
      tipo: input.tipo,
    });
    return this.toDto(actividad);
  }

  async actualizar(id: string, input: ActualizarActividadInput, user: AuthUser): Promise<ActividadDto> {
    const actividad = await this.repository.findById(id);
    if (!actividad) throw new NotFoundError("Actividad");
    this.eventosPolicies.puedeModificar(user, actividad.evento);
    const actualizada = await this.repository.update(id, {
      ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
      ...(input.descripcion !== undefined ? { descripcion: input.descripcion } : {}),
      ...(input.ponente !== undefined ? { ponente: input.ponente } : {}),
      ...(input.lugar !== undefined ? { lugar: input.lugar } : {}),
      ...(input.horaInicio !== undefined ? { horaInicio: input.horaInicio } : {}),
      ...(input.horaFin !== undefined ? { horaFin: input.horaFin } : {}),
      ...(input.tipo !== undefined ? { tipo: input.tipo } : {}),
    });
    return this.toDto(actualizada);
  }

  async eliminar(id: string, user: AuthUser): Promise<void> {
    const actividad = await this.repository.findById(id);
    if (!actividad) throw new NotFoundError("Actividad");
    this.eventosPolicies.puedeModificar(user, actividad.evento);
    await this.repository.delete(id);
  }


  async registrarParticipacion(actividadId: string, input: CrearParticipacionInput, user: AuthUser) {
    const actividad = await this.repository.findById(actividadId);
    if (!actividad) throw new NotFoundError("Actividad");
    this.eventosPolicies.puedeModificar(user, actividad.evento);

    const inscripcion = await this.repository.findInscripcion(input.inscripcionId);
    if (!inscripcion || inscripcion.eventoId !== actividad.eventoId) {
      throw new NotFoundError("Inscripción en este evento");
    }

    const existente = await this.repository.participacionExiste(actividadId, inscripcion.id);
    if (existente) throw new ConflictError("PARTICIPACION_DUPLICADA", "Esa inscripción ya participa en la actividad.");

    const esPonente = input.rol === "ponente";
    if (!esPonente) {
      const asistencia = await this.repository.tieneAsistencia(inscripcion.id);
      if (!asistencia) {
        throw new BusinessRuleError("CHECKIN_REQUERIDO", "El participante necesita check-in antes de registrar su asistencia a la actividad.");
      }
    }

    const participacion = await this.repository.createParticipacion({
      actividadId,
      inscripcionId: inscripcion.id,
      rol: input.rol.toUpperCase() as "ASISTENTE" | "PONENTE" | "COMPETIDOR",
    });
    return { id: participacion.id, actividadId, inscripcionId: inscripcion.id, rol: input.rol };
  }

  private toDto(a: Actividad): ActividadDto {
    return {
      id: a.id,
      eventoId: a.eventoId,
      titulo: a.titulo,
      descripcion: a.descripcion,
      ponente: a.ponente,
      lugar: a.lugar,
      horaInicio: a.horaInicio.toISOString(),
      horaFin: a.horaFin.toISOString(),
      tipo: a.tipo,
    };
  }
}
