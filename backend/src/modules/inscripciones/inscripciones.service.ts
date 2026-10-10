import type { Prisma, PrismaClient } from "@prisma/client";
import { ConflictError, NotFoundError, ForbiddenError, BusinessRuleError, ValidationError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import { generateInscriptionCode, generateQrToken } from "../../shared/utils/crypto.js";
import { eventBus } from "../../shared/events/event-bus.js";
import { toCsv } from "../../shared/utils/csv.js";
import type { EventosService } from "../eventos/index.js";
import type { EventosPolicies } from "../eventos/index.js";
import type { StorageProvider } from "../../infrastructure/storage/types.js";
import { ALLOWED_MIME_TYPES, MAX_FILE_BYTES } from "../../infrastructure/storage/types.js";
import type { InscripcionesRepository, InscripcionConRelaciones } from "./inscripciones.repository.js";
import type { CrearInscripcionInput, ListarInscripcionesQuery } from "./inscripciones.schemas.js";
import type { InscripcionDetalleDto } from "./inscripciones.types.js";

const PAGO_DTO = {
  NO_APLICA: "no_aplica",
  PENDIENTE: "pendiente",
  CONFIRMADO: "confirmado",
  RECHAZADO: "rechazado",
} as const;

export class InscripcionesService {
  constructor(
    private readonly db: PrismaClient,
    private readonly repository: InscripcionesRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
    private readonly storage: StorageProvider,
  ) {}

  /**
   * Inscripción pública (RF §4.5). Cupo validado dentro de una transacción con
   * bloqueo del evento (SELECT … FOR UPDATE) para evitar sobreventa.
   */
  async inscribir(eventoIdOrSlug: string, input: CrearInscripcionInput, user: AuthUser | undefined) {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    if (evento.estado !== "PUBLICADO") {
      throw new BusinessRuleError("EVENTO_NO_DISPONIBLE", "El evento no está abierto a inscripciones.");
    }

    const duplicada = await this.repository.findByEventoYEmail(evento.id, input.email);
    if (duplicada) {
      throw new ConflictError("INSCRIPCION_DUPLICADA", "Ya existe una inscripción con ese correo para este evento.");
    }

    const esPago = evento.esPago;
    const codigo = await this.codigoUnico();

    const inscripcion = await this.db.$transaction(
      async (tx) => {
        // Reserva de cupo con bloqueo pesimista (regla 1 del PRD §12).
        const rows = await tx.$queryRawUnsafe<Array<{ cupo_maximo: number | null }>>(
          "SELECT cupo_maximo FROM eventos WHERE id = $1::uuid FOR UPDATE",
          evento.id,
        );
        const cupo = rows[0]?.cupo_maximo ?? null;
        if (cupo !== null) {
          const confirmados = await tx.inscripcion.count({
            where: { eventoId: evento.id, estadoPago: { in: ["NO_APLICA", "CONFIRMADO"] } },
          });
          if (confirmados >= cupo) {
            throw new ConflictError("CUPO_AGOTADO", "El evento llegó a su cupo máximo.");
          }
        }
        return tx.inscripcion.create({
          data: {
            eventoId: evento.id,
            ...(user ? { usuarioId: user.id } : {}),
            nombreCompleto: input.nombreCompleto,
            email: input.email.toLowerCase(),
            celular: input.celular,
            ...(input.carrera !== undefined ? { carrera: input.carrera } : {}),
            ...(input.universidad !== undefined ? { universidad: input.universidad } : {}),
            consentimientoDatos: input.consentimientoDatos,
            aceptaComunicaciones: input.aceptaComunicaciones,
            estadoPago: esPago ? "PENDIENTE" : "NO_APLICA",
            codigo,
            // QR solo con pago confirmado (eventos pagos); gratuitos al inscribirse.
            ...(esPago ? {} : { qrToken: generateQrToken() }),
          },
          include: { evento: true, asistencia: true, certificado: true },
        });
      },
      { isolationLevel: "Serializable" },
    );

    if (!esPago) {
      // El correo es un efecto secundario: si falla, no rompe la inscripción.
      eventBus.emit("InscripcionConfirmada", {
        inscripcionId: inscripcion.id,
        email: inscripcion.email,
        codigo: inscripcion.codigo,
        eventoTitulo: evento.titulo,
        qrToken: inscripcion.qrToken,
      });
    }
    return this.toDetalleDto(inscripcion);
  }

  /** Listado de inscritos para organizador/admin (staff: solo lectura). */
  async listarPorEvento(eventoIdOrSlug: string, query: ListarInscripcionesQuery, user: AuthUser) {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    this.eventosPolicies.puedeVerInscritos(user, evento);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const filtros = { estado: query.estado, buscar: query.buscar };
    const [inscripciones, total] = await Promise.all([
      this.repository.listPorEvento(evento.id, filtros, (page - 1) * pageSize, pageSize),
      this.repository.countPorEvento(evento.id, filtros),
    ]);
    return { data: inscripciones.map((i) => this.toDetalleDto(i, true)), total, page, pageSize };
  }

  /** Exportación CSV para organizador/admin. */
  async exportarCsv(eventoIdOrSlug: string, user: AuthUser): Promise<{ csv: string; filename: string }> {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    this.eventosPolicies.puedeVerInscritos(user, evento);
    const inscripciones = await this.repository.listPorEvento(
      evento.id,
      { estado: "todos" },
      0,
      100000,
    );
    const csv = toCsv(
      ["Codigo", "Nombre", "Email", "Celular", "Carrera", "Universidad", "Estado pago", "Check-in", "Registrado"],
      inscripciones.map((i) => [
        i.codigo,
        i.nombreCompleto,
        i.email,
        i.celular,
        i.carrera,
        i.universidad,
        PAGO_DTO[i.estadoPago],
        i.asistencia?.horaCheckin.toISOString() ?? "",
        i.createdAt.toISOString(),
      ]),
    );
    return { csv, filename: `inscritos-${evento.slug}.csv` };
  }

  /** Mis entradas: inscripciones vinculadas a la cuenta. */
  async misInscripciones(user: AuthUser): Promise<InscripcionDetalleDto[]> {
    const inscripciones = await this.repository.listByUsuario(user.id);
    return inscripciones.map((i) => this.toDetalleDto(i));
  }

  async detalle(id: string, acceso: { token?: string; user?: AuthUser }): Promise<InscripcionDetalleDto> {
    const inscripcion = await this.repository.findById(id);
    if (!inscripcion) throw new NotFoundError("Inscripción");
    await this.assertAcceso(inscripcion, acceso);
    return this.toDetalleDto(inscripcion, Boolean(acceso.user && acceso.user.rol !== "PARTICIPANTE"));
  }

  /** Subida de comprobante de pago (dueño por token/código o autenticado). */
  async subirComprobante(id: string, file: { buffer: Buffer; mimeType: string; size: number }, acceso: { token?: string; user?: AuthUser }) {
    const inscripcion = await this.repository.findById(id);
    if (!inscripcion) throw new NotFoundError("Inscripción");
    await this.assertAcceso(inscripcion, acceso);
    if (!inscripcion.evento.esPago) {
      throw new BusinessRuleError("EVENTO_GRATUITO", "Este evento no requiere comprobante de pago.");
    }
    if (inscripcion.estadoPago === "CONFIRMADO") {
      throw new BusinessRuleError("PAGO_YA_CONFIRMADO", "El pago ya fue confirmado.");
    }
    const extension = ALLOWED_MIME_TYPES[file.mimeType];
    if (!extension || extension !== "pdf") {
      throw new ValidationError("El comprobante debe ser un archivo PDF.");
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new ValidationError("El archivo supera el máximo de 5 MB.");
    }
    const stored = await this.storage.save("comprobantes", file.buffer, extension);
    const actualizada = await this.repository.update(id, { comprobanteUrl: stored.url, estadoPago: "PENDIENTE" });
    return this.toDetalleDto(actualizada);
  }

  /** El organizador dueño (o admin) confirma o rechaza el pago. */
  async decidirPago(id: string, estado: "confirmado" | "rechazado", user: AuthUser) {
    const inscripcion = await this.repository.findById(id);
    if (!inscripcion) throw new NotFoundError("Inscripción");
    const evento = await this.eventosService.find(inscripcion.eventoId);
    this.eventosPolicies.puedeGestionarPagos(user, evento);
    if (!evento.esPago) {
      throw new BusinessRuleError("EVENTO_GRATUITO", "Este evento no maneja pagos.");
    }
    if (estado === "confirmado" && inscripcion.estadoPago === "CONFIRMADO") {
      throw new BusinessRuleError("PAGO_YA_CONFIRMADO", "El pago ya estaba confirmado.");
    }

    const qrToken = estado === "confirmado" ? (inscripcion.qrToken ?? generateQrToken()) : inscripcion.qrToken;
    const actualizada = await this.repository.update(id, {
      estadoPago: estado === "confirmado" ? "CONFIRMADO" : "RECHAZADO",
      ...(qrToken ? { qrToken } : {}),
    });

    if (estado === "confirmado") {
      eventBus.emit("PagoConfirmado", {
        inscripcionId: id,
        email: actualizada.email,
        codigo: actualizada.codigo,
        eventoTitulo: evento.titulo,
      });
    }
    return this.toDetalleDto(actualizada, true);
  }

  /** QR de la inscripción (data URL para <img>). */
  async qr(id: string, acceso: { token?: string; user?: AuthUser }) {
    const inscripcion = await this.repository.findById(id);
    if (!inscripcion) throw new NotFoundError("Inscripción");
    await this.assertAcceso(inscripcion, acceso);
    if (!inscripcion.qrToken) {
      throw new BusinessRuleError(
        "QR_NO_DISPONIBLE",
        inscripcion.estadoPago === "PENDIENTE"
          ? "El QR se habilita cuando el organizador confirme tu pago."
          : "El QR no está disponible para esta inscripción.",
      );
    }
    const { generateQrDataUrl } = await import("../../infrastructure/qr/qr-generator.js");
    return {
      codigo: inscripcion.codigo,
      qrToken: inscripcion.qrToken,
      qrDataUrl: await generateQrDataUrl(inscripcion.qrToken),
    };
  }

  private async assertAcceso(inscripcion: InscripcionConRelaciones, acceso: { token?: string; user?: AuthUser }): Promise<void> {
    if (acceso.user && (acceso.user.id === inscripcion.usuarioId || acceso.user.rol === "ADMIN")) return;
    // Token de inscripción = su código legible (SC-XXXX).
    if (acceso.token && acceso.token.trim().toUpperCase() === inscripcion.codigo) return;
    if (acceso.user && (acceso.user.rol === "ORGANIZADOR" || acceso.user.rol === "STAFF")) {
      const evento = await this.eventosService.find(inscripcion.eventoId);
      if (this.eventosPolicies.esOrganizadorOLectura(acceso.user, evento)) return;
    }
    throw new ForbiddenError("No tienes acceso a esta inscripción.");
  }

  private async codigoUnico(): Promise<string> {
    for (let intento = 0; intento < 20; intento += 1) {
      const codigo = generateInscriptionCode();
      if (!(await this.repository.codigoExists(codigo))) return codigo;
    }
    throw new ConflictError("CODIGO_AGOTADO", "No se pudo generar un código de inscripción. Intenta de nuevo.");
  }

  toDetalleDto(i: InscripcionConRelaciones, incluirDatosPersonales = false): InscripcionDetalleDto {
    const estadoPago = PAGO_DTO[i.estadoPago];
    const ahora = Date.now();
    const futuro = i.evento.fechaFin.getTime() > ahora;
    const estadoFront = estadoPago === "rechazado" ? "cancelled" : estadoPago === "pendiente" ? "pending" : futuro ? "confirmed" : "confirmed";
    return {
      id: i.id,
      eventoId: i.eventoId,
      evento: {
        id: i.evento.id,
        titulo: i.evento.titulo,
        fechaInicio: i.evento.fechaInicio.toISOString(),
        fechaFin: i.evento.fechaFin.toISOString(),
        lugar: i.evento.lugar,
        modalidad: i.evento.modalidad.toLowerCase(),
      },
      nombreCompleto: i.nombreCompleto,
      email: i.email,
      estadoPago,
      codigo: i.codigo,
      tieneQr: i.qrToken !== null,
      comprobanteUrl: i.comprobanteUrl,
      asistencia: i.asistencia ? { horaCheckin: i.asistencia.horaCheckin.toISOString() } : null,
      certificadoId: i.certificado?.id ?? null,
      createdAt: i.createdAt.toISOString(),
      ...(incluirDatosPersonales
        ? {
            celular: i.celular,
            carrera: i.carrera,
            universidad: i.universidad,
            consentimientoDatos: i.consentimientoDatos,
            aceptaComunicaciones: i.aceptaComunicaciones,
            estadoFront,
          }
        : {
            celular: "",
            carrera: null,
            universidad: null,
            consentimientoDatos: i.consentimientoDatos,
            aceptaComunicaciones: i.aceptaComunicaciones,
            estadoFront,
          }),
    };
  }
}

export type { Prisma };
