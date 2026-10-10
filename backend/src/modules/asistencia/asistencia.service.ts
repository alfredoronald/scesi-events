import { BusinessRuleError, NotFoundError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";
import type { Evento } from "@prisma/client";
import type { AsistenciaRepository, AsistenciaRow } from "./asistencia.repository.js";
import type { CheckinManualInput, CheckinQrInput, CheckinResultado, ListarAsistenciaQuery } from "./asistencia.schemas.js";


export interface CheckinStrategy<TInput> {
  resolver(input: TInput, user: AuthUser): Promise<{ inscripcion: AsistenciaRow; evento: Evento }>;
}

export class QrCheckinStrategy implements CheckinStrategy<CheckinQrInput> {
  constructor(
    private readonly repository: AsistenciaRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
  ) {}

  async resolver(input: CheckinQrInput, user: AuthUser) {
    const inscripcion = await this.repository.findInscripcionPorToken(input.qrToken);
    if (!inscripcion) throw new NotFoundError("Entrada");
    const evento = await this.eventosService.find(inscripcion.eventoId);
    this.eventosPolicies.puedeHacerCheckin(user, evento);
    if (input.eventoId && input.eventoId !== inscripcion.eventoId) {
      throw new BusinessRuleError("QR_OTRO_EVENTO", "La entrada corresponde a otro evento. Revisa el evento seleccionado.");
    }
    return { inscripcion, evento };
  }
}

export class ManualCheckinStrategy implements CheckinStrategy<CheckinManualInput> {
  constructor(
    private readonly repository: AsistenciaRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
  ) {}

  async resolver(input: CheckinManualInput, user: AuthUser) {
    const inscripcion = await this.repository.findInscripcionPorId(input.inscripcionId);
    if (!inscripcion || inscripcion.eventoId !== input.eventoId) {
      throw new NotFoundError("Inscripción");
    }
    const evento = await this.eventosService.find(input.eventoId);
    this.eventosPolicies.puedeHacerCheckin(user, evento);
    return { inscripcion, evento };
  }
}

export class AsistenciaService {
  constructor(
    private readonly repository: AsistenciaRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
    private readonly estrategias: {
      qr: QrCheckinStrategy;
      manual: ManualCheckinStrategy;
    },
  ) {}

  checkinPorQr(input: CheckinQrInput, user: AuthUser): Promise<CheckinResultado> {
    return this.registrar(this.estrategias.qr, input, user);
  }

  checkinManual(input: CheckinManualInput, user: AuthUser): Promise<CheckinResultado> {
    return this.registrar(this.estrategias.manual, input, user, input.puntoControl);
  }

  async buscar(eventoId: string, buscar: string, user: AuthUser) {
    const evento = await this.eventosService.find(eventoId);
    this.eventosPolicies.puedeHacerCheckin(user, evento);
    const filas = await this.repository.buscarInscripciones(eventoId, buscar);
    return filas.map((f) => ({
      id: f.id,
      nombreCompleto: f.nombreCompleto,
      email: f.email,
      codigo: f.codigo,
      yaIngreso: f.asistencia !== null && !f.asistencia.horaCheckout,
      checkedInAt: f.asistencia?.horaCheckin.toISOString() ?? null,
      checkedOutAt: f.asistencia?.horaCheckout?.toISOString() ?? null,
    }));
  }

  async listarPorEvento(eventoId: string, query: ListarAsistenciaQuery, user: AuthUser) {
    const evento = await this.eventosService.find(eventoId);
    this.eventosPolicies.puedeHacerCheckin(user, evento);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const { rows, total } = await this.repository.listPorEvento(
      eventoId,
      { estado: query.estado, buscar: query.buscar },
      (page - 1) * pageSize,
      pageSize,
    );
    const data = rows.map((r) => ({
      id: r.id,
      nombreCompleto: r.nombreCompleto,
      email: r.email,
      codigo: r.codigo,
      eventId: r.eventoId,
      estadoPago: r.estadoPago.toLowerCase(),
      comprobanteUrl: r.comprobanteUrl,
      createdAt: r.createdAt.toISOString(),
      checkedInAt: r.asistencia?.horaCheckin.toISOString() ?? null,
      checkedOutAt: r.asistencia?.horaCheckout?.toISOString() ?? null,
      lastRecord: r.asistencia?.puntoControl ?? null,
      certificadoId: r.certificado?.id ?? null,
    }));
    return { data, total, page, pageSize };
  }

  async checkout(input: CheckinManualInput, user: AuthUser) {
    const { inscripcion, evento } = await this.estrategias.manual.resolver(input, user);
    this.validarEventoEnCurso(evento);
    const record = await this.repository.registrarSalida(inscripcion.id, user.id, input.puntoControl);
    if (!record) throw new BusinessRuleError("SIN_INGRESO", "No puedes registrar una salida sin ingreso previo.");
    return { id: inscripcion.id, horaCheckout: record.horaCheckout?.toISOString() };
  }

  private async registrar<TInput>(
    estrategia: CheckinStrategy<TInput>,
    input: TInput,
    user: AuthUser,
    puntoControl = "Ingreso principal",
  ): Promise<CheckinResultado> {
    const { inscripcion, evento } = await estrategia.resolver(input, user);
    this.validarEventoEnCurso(evento);
    this.validarPagoConfirmado(inscripcion.estadoPago);

    const { creado, horaCheckin } = await this.repository.registrarSiNoExiste(inscripcion.id, user.id, puntoControl);
    const base = {
      ok: true as const,
      inscripcion: { id: inscripcion.id, nombreCompleto: inscripcion.nombreCompleto, codigo: inscripcion.codigo },
      horaCheckin: horaCheckin.toISOString(),
    };
    if (!creado) {
      return {
        ...base,
        yaRegistrado: true,
        mensaje: `${inscripcion.nombreCompleto} ya ingresó a las ${horaCheckin.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}.`,
      };
    }
    return { ...base, yaRegistrado: false };
  }

  private validarEventoEnCurso(evento: Pick<Evento, "estado" | "fechaInicio" | "fechaFin">): void {
    const ahora = new Date();
    const dentroDeVentana =
      ahora >= new Date(evento.fechaInicio.getTime() - 60 * 60 * 1000) &&
      ahora <= new Date(evento.fechaFin.getTime() + 24 * 3600 * 1000);
    const valido = evento.estado === "EN_CURSO" || (evento.estado === "PUBLICADO" && dentroDeVentana);
    if (!valido) {
      throw new BusinessRuleError("EVENTO_NO_EN_CURSO", "El evento no está en curso ni dentro de su ventana horaria.");
    }
  }

  private validarPagoConfirmado(estadoPago: string): void {
    if (estadoPago === "PENDIENTE") {
      throw new BusinessRuleError("PAGO_PENDIENTE", "Esta inscripción está pendiente de confirmación de pago.");
    }
    if (estadoPago === "RECHAZADO") {
      throw new BusinessRuleError("PAGO_RECHAZADO", "Esta inscripción fue rechazada.");
    }
  }
}
