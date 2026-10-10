import { BusinessRuleError, ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import { generateVerificationCode } from "../../shared/utils/crypto.js";
import type { CertificatePdfGenerator } from "../../infrastructure/pdf/certificate-pdf.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";
import type { CertificadosRepository, InscripcionParaCertificado } from "./certificados.repository.js";
import { politicasPara } from "./certificado-eligibility.js";
import type { CertificadoDto, ElegibilidadDto, VerificacionDto } from "./certificados.types.js";

export class CertificadosService {
  constructor(
    private readonly repository: CertificadosRepository,
    private readonly eventosService: EventosService,
    private readonly eventosPolicies: EventosPolicies,
    private readonly pdfGenerator: CertificatePdfGenerator,
  ) {}

  async elegibilidadUsuario(user: AuthUser): Promise<ElegibilidadDto[]> {
    const inscripciones = await this.repository.findInscripcionesDeUsuario(user.id);
    return inscripciones.map((i) => this.evaluar(i));
  }

  async emitirPorInscripcion(inscripcionId: string, user: AuthUser): Promise<CertificadoDto> {
    const inscripcion = await this.repository.findInscripcion(inscripcionId);
    if (!inscripcion) throw new NotFoundError("Inscripción");
    if (inscripcion.usuarioId !== user.id && user.rol !== "ADMIN") {
      throw new ForbiddenError("Solo puedes emitir tus propios certificados.");
    }
    return this.emitir(inscripcion);
  }

  /** Emisión masiva al cerrar el evento (organizador dueño/admin). Idempotente. */
  async emitirMasivo(eventoIdOrSlug: string, user: AuthUser) {
    const evento = await this.eventosService.find(eventoIdOrSlug);
    this.eventosPolicies.puedeModificar(user, evento);
    if (!evento.entregaCertificado) {
      throw new BusinessRuleError("SIN_CERTIFICADOS", "El evento no entrega certificados.");
    }
    const inscripciones = await this.repository.inscripcionesConfirmadas(evento.id);
    let emitidos = 0;
    let omitidos = 0;
    for (const inscripcion of inscripciones) {
      try {
        await this.emitir(inscripcion);
        emitidos += 1;
      } catch (error) {
        if (error instanceof ConflictError || error instanceof BusinessRuleError) {
          omitidos += 1;
          continue;
        }
        throw error;
      }
    }
    return { emitidos, omitidos, total: inscripciones.length };
  }

  /** PDF del certificado (dueño, admin u organizador del evento). */
  async pdf(certificadoId: string, user: AuthUser | undefined): Promise<Buffer> {
    const certificado = await this.repository.findCertificado(certificadoId);
    if (!certificado) throw new NotFoundError("Certificado");
    const inscripcion = certificado.inscripcion;
    const esDueno = user && inscripcion.usuarioId === user.id;
    const esAdmin = user?.rol === "ADMIN";
    let esOrganizador = false;
    if (user && (user.rol === "ORGANIZADOR" || user.rol === "STAFF")) {
      const evento = await this.eventosService.find(inscripcion.eventoId);
      esOrganizador = this.eventosPolicies.esOrganizadorOLectura(user, evento);
    }
    if (!esDueno && !esAdmin && !esOrganizador) {
      throw new ForbiddenError("No tienes acceso a este certificado.");
    }
    return this.pdfGenerator.generate({
      nombreParticipante: inscripcion.nombreCompleto,
      eventoTitulo: inscripcion.evento.titulo,
      eventoTipo: inscripcion.evento.tipo.toLowerCase(),
      fecha: inscripcion.evento.fechaInicio.toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" }),
      codigoVerificacion: certificado.codigoVerificacion,
      organizacion: "Sociedad Científica de Estudiantes de Sistemas e Informática",
    });
  }

  /** Verificación pública por código: mínimo dato necesario (PRD §4.7/§10). */
  async verificar(codigo: string): Promise<VerificacionDto> {
    const certificado = await this.repository.findByCodigoVerificacion(codigo);
    if (!certificado) return { valido: false };
    return {
      valido: true,
      certificado: {
        participante: certificado.inscripcion.nombreCompleto,
        evento: certificado.inscripcion.evento.titulo,
        fecha: certificado.inscripcion.evento.fechaInicio.toISOString(),
        emitidoEn: certificado.emitidoEn.toISOString(),
      },
    };
  }

  private evaluar(inscripcion: InscripcionParaCertificado): ElegibilidadDto {
    const base = {
      inscripcionId: inscripcion.id,
      eventoId: inscripcion.eventoId,
      eventoTitulo: inscripcion.evento.titulo,
      participante: inscripcion.nombreCompleto,
      yaEmitido: inscripcion.certificado !== null,
    };
    if (inscripcion.certificado) {
      return { ...base, elegible: true, yaEmitido: true };
    }
    if (!inscripcion.evento.entregaCertificado) {
      return { ...base, elegible: false, motivo: "Este evento no entrega certificados." };
    }
    const policy = politicasPara(inscripcion.evento.certificadoA);
    const resultado = policy.evaluar(inscripcion);
    return { ...base, elegible: resultado.elegible, ...(resultado.motivo ? { motivo: resultado.motivo } : {}) };
  }

  /** Emisión idempotente: un certificado por inscripción. */
  private async emitir(inscripcion: InscripcionParaCertificado): Promise<CertificadoDto> {
    const existente = await this.repository.certificadoPorInscripcion(inscripcion.id);
    if (existente) {
      throw new ConflictError("CERTIFICADO_EXISTENTE", "El certificado ya fue emitido.");
    }
    if (!inscripcion.evento.entregaCertificado) {
      throw new BusinessRuleError("SIN_CERTIFICADOS", "El evento no entrega certificados.");
    }
    const policy = politicasPara(inscripcion.evento.certificadoA);
    const resultado = policy.evaluar(inscripcion);
    if (!resultado.elegible) {
      throw new BusinessRuleError("NO_ELEGIBLE", resultado.motivo ?? "No cumples los requisitos del certificado.");
    }
    const certificado = await this.repository.createCertificado({
      inscripcionId: inscripcion.id,
      codigoVerificacion: generateVerificationCode(),
    });
    return this.toDto(certificado.id, inscripcion, certificado.codigoVerificacion, certificado.emitidoEn.toISOString());
  }

  private toDto(
    id: string,
    inscripcion: InscripcionParaCertificado,
    codigoVerificacion: string,
    emitidoEn: string,
  ): CertificadoDto {
    return {
      id,
      inscripcionId: inscripcion.id,
      evento: {
        id: inscripcion.evento.id,
        titulo: inscripcion.evento.titulo,
        fechaInicio: inscripcion.evento.fechaInicio.toISOString(),
        tipo: inscripcion.evento.tipo.toLowerCase(),
      },
      participante: inscripcion.nombreCompleto,
      codigoVerificacion,
      emitidoEn,
      descargarUrl: `/api/v1/certificados/${id}/pdf`,
    };
  }
}
