import { ForbiddenError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { MetricasRepository } from "./metricas.repository.js";

function numero(value: bigint | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}


export class MetricasService {
  constructor(private readonly repository: MetricasRepository) {}

  private filtro(user: AuthUser): { organizadorId?: string } {
    if (user.rol === "ADMIN") return {};
    if (user.rol === "ORGANIZADOR") return { organizadorId: user.id };
    throw new ForbiddenError("Solo administradores y organizadores acceden a métricas.");
  }

  async resumenEventos(user: AuthUser) {
    const rows = await this.repository.resumenEventos(this.filtro(user));
    return rows.map((r) => ({
      eventoId: r.evento_id,
      titulo: r.titulo,
      tipo: r.tipo.toLowerCase(),
      estado: r.estado.toLowerCase(),
      fechaInicio: r.fecha_inicio.toISOString(),
      inscritos: numero(r.inscritos) ?? 0,
      asistentes: numero(r.asistentes) ?? 0,
      participantes: numero(r.participantes) ?? 0,
      cupoMaximo: r.cupo_maximo,
      ocupacion: r.ocupacion === null ? null : Number(r.ocupacion),
      asistenciaEfectiva: r.asistencia_efectiva === null ? null : Number(r.asistencia_efectiva),
      participacion: r.participacion_pct === null ? null : Number(r.participacion_pct),
      promedioGeneral: r.promedio_general === null ? null : Number(r.promedio_general),
      nps: r.nps === null ? null : Number(r.nps),
      certificados: numero(r.certificados) ?? 0,
    }));
  }

  async embudo(user: AuthUser) {
    const rows = await this.repository.embudo(this.filtro(user));
    return rows.map((r) => ({
      eventoId: r.evento_id,
      titulo: r.titulo,
      inscritos: numero(r.inscritos) ?? 0,
      asistieron: numero(r.asistieron) ?? 0,
      participaron: numero(r.participaron) ?? 0,
      calificaron: numero(r.calificaron) ?? 0,
      certificados: numero(r.certificados) ?? 0,
      reinscritos: numero(r.reinscritos) ?? 0,
    }));
  }

  async afluencia(user: AuthUser) {
    const rows = await this.repository.afluencia(this.filtro(user));
    return rows.map((r) => ({
      eventoId: r.evento_id,
      titulo: r.titulo,
      franja: r.franja,
      checkins: numero(r.checkins) ?? 0,
    }));
  }

  async actividades(user: AuthUser) {
    const rows = await this.repository.rankingActividades(this.filtro(user));
    return rows.map((r) => ({
      actividadId: r.actividad_id,
      titulo: r.titulo,
      evento: r.evento,
      participantes: numero(r.participantes) ?? 0,
      promedio: r.promedio === null ? null : Number(r.promedio),
    }));
  }

  async satisfaccion(user: AuthUser) {
    const [row] = await this.repository.satisfaccion(this.filtro(user));
    if (!row) return { total: 0, promedioGeneral: 0, promedioOrganizacion: 0, promedioContenido: 0, nps: null };
    const respuestasNps = numero(row.respuestas_nps) ?? 0;
    const promotores = numero(row.promotores) ?? 0;
    const detractores = numero(row.detractores) ?? 0;
    const nps = respuestasNps > 0 ? Math.round(((promotores - detractores) / respuestasNps) * 100) : null;
    return {
      total: numero(row.total) ?? 0,
      promedioGeneral: row.promedio_general === null ? 0 : Number(row.promedio_general),
      promedioOrganizacion: row.promedio_organizacion === null ? 0 : Number(row.promedio_organizacion),
      promedioContenido: row.promedio_contenido === null ? 0 : Number(row.promedio_contenido),
      nps,
    };
  }

  async recurrencia(user: AuthUser) {
    const [row] = await this.repository.recurrencia(this.filtro(user));
    return {
      recurrentes: numero(row?.recurrentes) ?? 0,
      nuevos: numero(row?.nuevos) ?? 0,
      recurrentesPct: row?.recurrentes_pct === null || row?.recurrentes_pct === undefined ? null : Number(row.recurrentes_pct),
    };
  }

  async perfil(user: AuthUser) {
    const rows = await this.repository.perfil(this.filtro(user));
    return rows.map((r) => ({ dimension: r.dimension, valor: r.valor, total: numero(r.total) ?? 0 }));
  }

  async comparacion(user: AuthUser, ids: string[]) {
    this.filtro(user); // valida rol
    const rows = await this.repository.comparacion(ids);
    return rows.map((r) => ({
      eventoId: r.evento_id,
      titulo: r.titulo,
      inscritos: numero(r.inscritos) ?? 0,
      asistentes: numero(r.asistentes) ?? 0,
      participantes: numero(r.participantes) ?? 0,
      promedioGeneral: r.promedio_general === null ? null : Number(r.promedio_general),
      nps: r.nps === null ? null : Number(r.nps),
    }));
  }

  async porTipo(user: AuthUser) {
    const rows = await this.repository.porTipo(this.filtro(user));
    return rows.map((r) => ({
      tipo: r.tipo.toLowerCase(),
      eventos: numero(r.eventos) ?? 0,
      inscritos: numero(r.inscritos) ?? 0,
      asistentes: numero(r.asistentes) ?? 0,
      promedioGeneral: r.promedio_general === null ? null : Number(r.promedio_general),
    }));
  }

  async contenido(user: AuthUser) {
    this.filtro(user);
    const [publicaciones, proyectos] = await Promise.all([
      this.repository.contenido(),
      this.repository.proyectosPublicados(),
    ]);
    return {
      topPublicaciones: publicaciones.map((p) => ({
        tipo: p.tipo.toLowerCase(),
        titulo: p.titulo,
        slug: p.slug,
        vistas: numero(p.vistas) ?? 0,
        descargas: numero(p.descargas) ?? 0,
        likes: numero(p.likes) ?? 0,
      })),
      proyectosPublicados: numero(proyectos[0]?.total) ?? 0,
      colaboradoresEnProyectos: numero(proyectos[0]?.colaboradores) ?? 0,
    };
  }

  /** Serie mensual para el gráfico del panel admin. */
  async asistenciasPorMes(user: AuthUser) {
    this.filtro(user);
    const rows = await this.repository.asistenciasPorMes();
    return rows.map((r) => ({ mes: r.mes, checkins: numero(r.checkins) ?? 0 }));
  }
}
