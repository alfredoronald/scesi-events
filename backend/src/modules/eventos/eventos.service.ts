import type { Evento } from "@prisma/client";
import { slugify } from "../../shared/utils/slug.js";
import { BusinessRuleError, ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { EventosRepository, EventoConOrganizador } from "./eventos.repository.js";
import type { EventosPolicies } from "./eventos.policies.js";
import type { ActualizarEventoInput, CrearEventoInput, ListarEventosQuery } from "./eventos.schemas.js";
import type { EventoDto, EventoEstadoDto, EventoTipoDto } from "./eventos.types.js";

const TIPO_DTO: Record<string, EventoTipoDto> = {
  CHARLA: "charla",
  TALLER: "taller",
  HACKATHON: "hackathon",
  CONGRESO: "congreso",
  CTF: "ctf",
};
const TIPO_PRISMA = { charla: "CHARLA", taller: "TALLER", hackathon: "HACKATHON", congreso: "CONGRESO", ctf: "CTF" } as const;
const MODALIDAD_PRISMA = { presencial: "PRESENCIAL", virtual: "VIRTUAL", mixto: "MIXTO" } as const;
const ESTADO_PRISMA = { borrador: "BORRADOR", publicado: "PUBLICADO", en_curso: "EN_CURSO", cerrado: "CERRADO" } as const;
const ESTADO_DTO: Record<string, EventoEstadoDto> = {
  BORRADOR: "borrador",
  PUBLICADO: "publicado",
  EN_CURSO: "en_curso",
  CERRADO: "cerrado",
};
const PARTICIPACION_DTO = { ORGANIZED: "organized", INVITED: "invited", STAFF: "staff" } as const;
const PARTICIPACION_PRISMA = { organized: "ORGANIZED", invited: "INVITED", staff: "STAFF" } as const;

export class EventosService {
  constructor(
    private readonly repository: EventosRepository,
    private readonly policies: EventosPolicies,
  ) {}

  /**
   * Listado con visibilidad por rol (PRD §4.3):
   * - `mios`/`staff`: eventos propios/asignados del autenticado (cualquier estado).
   * - admin: todo (respetando filtros).
   * - resto (incl. público): solo eventos visibles (publicado/en curso/cerrado).
   */
  async listar(query: ListarEventosQuery, user: AuthUser | undefined) {
    const soloPropios = query.mios === true;
    const soloAsignados = query.staff === true;
    if ((soloPropios || soloAsignados) && !user) {
      throw new ForbiddenError("Necesitas sesión para ver tus eventos.");
    }
    if (soloPropios && user?.rol !== "ADMIN" && user?.rol !== "ORGANIZADOR") throw new ForbiddenError("Solo organizadores y administradores pueden consultar eventos propios.");

    const veTodo = user?.rol === "ADMIN";
    const filtros = {
      periodo: query.periodo,
      tipo: query.tipo,
      estado: query.estado,
      buscar: query.buscar,
      soloPublicados: !veTodo && !(soloPropios || soloAsignados),
      ...(soloPropios && user?.rol === "ORGANIZADOR" ? { organizadorId: user.id } : {}),
      ...(soloAsignados && user ? { staffUsuarioId: user.id } : {}),
    };

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [eventos, total] = await Promise.all([
      this.repository.list(filtros, (page - 1) * pageSize, pageSize),
      this.repository.count(filtros),
    ]);
    const inscritos = await this.repository.inscritosConfirmadosPorEvento(eventos.map((e) => e.id));
    return { data: eventos.map((e) => this.toDto(e, inscritos.get(e.id) ?? 0)), total, page, pageSize };
  }

  async detalle(idOrSlug: string, user: AuthUser | undefined): Promise<EventoDto> {
    const evento = await this.find(idOrSlug);
    if (evento.estado === "BORRADOR" && !this.policies.esOrganizadorOLectura(user, evento)) {
      throw new NotFoundError("Evento");
    }
    return this.toDto(evento, await this.repository.countInscritosConfirmados(evento.id));
  }

  async crear(input: CrearEventoInput, user: AuthUser): Promise<EventoDto> {
    if (user.rol !== "ADMIN" && user.rol !== "ORGANIZADOR") {
      throw new ForbiddenError("Solo organizadores y administradores crean eventos.");
    }
    const slug = await this.slugUnico(input.titulo);
    const evento = await this.repository.create({
      titulo: input.titulo,
      descripcion: input.descripcion,
      tipo: TIPO_PRISMA[input.tipo],
      modalidad: MODALIDAD_PRISMA[input.modalidad],
      fechaInicio: input.fechaInicio,
      fechaFin: input.fechaFin,
      lugar: input.lugar,
      ...(input.enlaceVirtual !== undefined ? { enlaceVirtual: input.enlaceVirtual } : {}),
      ...(input.imagenUrl !== undefined ? { imagenUrl: input.imagenUrl } : {}),
      esPago: input.esPago,
      ...(input.precio !== undefined && input.precio !== null ? { precio: input.precio } : {}),
      ...(input.cupoMaximo !== undefined && input.cupoMaximo !== null ? { cupoMaximo: input.cupoMaximo } : {}),
      estado: "BORRADOR",
      participacionScesi: PARTICIPACION_PRISMA[input.participacionScesi],
      entregaCertificado: input.entregaCertificado,
      certificadoA: input.certificadoA === "solo_ponentes" ? "SOLO_PONENTES" : "TODOS",
      organizador: { connect: { id: user.id } },
      slug,
    });
    return this.toDto(evento, 0);
  }

  async actualizar(idOrSlug: string, input: ActualizarEventoInput, user: AuthUser): Promise<EventoDto> {
    const evento = await this.find(idOrSlug);
    this.policies.puedeModificar(user, evento);

    // Regla: no reducir el cupo por debajo de los inscritos confirmados.
    if (input.cupoMaximo !== undefined) {
      const confirmados = await this.repository.countInscritosConfirmados(evento.id);
      if (input.cupoMaximo !== null && input.cupoMaximo < confirmados) {
        throw new BusinessRuleError(
          "CUPO_INVALIDO",
          `No puedes reducir el cupo por debajo de los ${confirmados} inscritos confirmados.`,
        );
      }
    }

    const actualizado = await this.repository.update(evento.id, {
      ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
      ...(input.descripcion !== undefined ? { descripcion: input.descripcion } : {}),
      ...(input.tipo !== undefined ? { tipo: TIPO_PRISMA[input.tipo] } : {}),
      ...(input.modalidad !== undefined ? { modalidad: MODALIDAD_PRISMA[input.modalidad] } : {}),
      ...(input.fechaInicio !== undefined ? { fechaInicio: input.fechaInicio } : {}),
      ...(input.fechaFin !== undefined ? { fechaFin: input.fechaFin } : {}),
      ...(input.lugar !== undefined ? { lugar: input.lugar } : {}),
      ...(input.enlaceVirtual !== undefined ? { enlaceVirtual: input.enlaceVirtual } : {}),
      ...(input.imagenUrl !== undefined ? { imagenUrl: input.imagenUrl } : {}),
      ...(input.esPago !== undefined ? { esPago: input.esPago } : {}),
      ...(input.precio !== undefined ? { precio: input.precio } : {}),
      ...(input.cupoMaximo !== undefined ? { cupoMaximo: input.cupoMaximo } : {}),
      ...(input.participacionScesi !== undefined ? { participacionScesi: PARTICIPACION_PRISMA[input.participacionScesi] } : {}),
      ...(input.entregaCertificado !== undefined ? { entregaCertificado: input.entregaCertificado } : {}),
      ...(input.certificadoA !== undefined
        ? { certificadoA: input.certificadoA === "solo_ponentes" ? "SOLO_PONENTES" : "TODOS" }
        : {}),
    });
    return this.toDto(actualizado, await this.repository.countInscritosConfirmados(evento.id));
  }

  /** Transiciones válidas: borrador → publicado → en_curso → cerrado (PRD §4.3). */
  async cambiarEstado(idOrSlug: string, nuevo: EventoEstadoDto, user: AuthUser): Promise<EventoDto> {
    const evento = await this.find(idOrSlug);
    this.policies.puedeModificar(user, evento);
    const orden: Record<EventoEstadoDto, number> = { borrador: 0, publicado: 1, en_curso: 2, cerrado: 3 };
    const actual = ESTADO_DTO[evento.estado] ?? "borrador";
    if (orden[nuevo] !== orden[actual] + 1) {
      throw new BusinessRuleError(
        "TRANSICION_INVALIDA",
        `No se puede pasar de "${actual}" a "${nuevo}". Secuencia válida: borrador → publicado → en_curso → cerrado.`,
      );
    }
    const actualizado = await this.repository.update(evento.id, { estado: ESTADO_PRISMA[nuevo] });
    return this.toDto(actualizado, await this.repository.countInscritosConfirmados(evento.id));
  }

  async eliminar(idOrSlug: string, user: AuthUser): Promise<void> {
    if (user.rol !== "ADMIN") {
      throw new ForbiddenError("Solo un administrador puede eliminar eventos.");
    }
    const evento = await this.find(idOrSlug);
    await this.repository.softDelete(evento.id);
  }

  /** Asignación de staff a un evento (admin u organizador dueño). */
  async asignarStaff(idOrSlug: string, staffIds: string[], user: AuthUser): Promise<{ staffIds: string[] }> {
    const evento = await this.find(idOrSlug);
    this.policies.puedeModificar(user, evento);
    await this.repository.replaceStaff(evento.id, staffIds);
    return { staffIds };
  }

  async find(idOrSlug: string): Promise<EventoConOrganizador> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const evento = isUuid ? await this.repository.findById(idOrSlug) : await this.repository.findBySlug(idOrSlug);
    if (!evento) throw new NotFoundError("Evento");
    return evento;
  }

  async inscritosIdsConfirmados(eventoId: string): Promise<string[]> {
    return this.repository.idsInscritosConfirmados(eventoId);
  }

  private async slugUnico(titulo: string): Promise<string> {
    const base = slugify(titulo) || "evento";
    let slug = base;
    let i = 2;
    while (await this.repository.slugExists(slug)) {
      slug = `${base}-${i}`;
      i += 1;
    }
    return slug;
  }

  toDto(evento: EventoConOrganizador, inscritosConfirmados: number): EventoDto {
    return {
      id: evento.id,
      slug: evento.slug,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      tipo: TIPO_DTO[evento.tipo] ?? "charla",
      modalidad: evento.modalidad.toLowerCase() as "presencial" | "virtual" | "mixto",
      fechaInicio: evento.fechaInicio.toISOString(),
      fechaFin: evento.fechaFin.toISOString(),
      lugar: evento.lugar,
      enlaceVirtual: evento.enlaceVirtual,
      imagenUrl: evento.imagenUrl,
      esPago: evento.esPago,
      precio: evento.precio === null ? null : evento.precio.toString(),
      cupoMaximo: evento.cupoMaximo,
      estado: ESTADO_DTO[evento.estado] ?? "borrador",
      participacionScesi: PARTICIPACION_DTO[evento.participacionScesi],
      entregaCertificado: evento.entregaCertificado,
      certificadoA: evento.certificadoA === "SOLO_PONENTES" ? "solo_ponentes" : "todos",
      organizador: { id: evento.organizador.id, nombreCompleto: evento.organizador.nombreCompleto },
      inscritosConfirmados,
      createdAt: evento.createdAt.toISOString(),
      updatedAt: evento.updatedAt.toISOString(),
    };
  }
}

export type { Evento };
