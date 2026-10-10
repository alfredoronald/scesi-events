import type { PrismaClient } from "@prisma/client";
import type { AuthUser } from "../../shared/middlewares/auth.js";

export type FiltroEventos = { organizadorId?: string };


export class MetricasRepository {
  constructor(private readonly db: PrismaClient) {}

  private organizadorFiltro(filtro: FiltroEventos): string {
    return filtro.organizadorId ? `AND e.organizador_id = $1` : "";
  }

  resumenEventos(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{
        evento_id: string;
        titulo: string;
        tipo: string;
        estado: string;
        fecha_inicio: Date;
        inscritos: bigint;
        asistentes: bigint;
        participantes: bigint;
        cupo_maximo: number | null;
        ocupacion: number | null;
        asistencia_efectiva: number | null;
        participacion_pct: number | null;
        promedio_general: number | null;
        nps: number | null;
        certificados: bigint;
      }>
    >(`
      SELECT e.id AS evento_id, e.titulo, e.tipo::text AS tipo, e.estado::text AS estado, e.fecha_inicio,
        COALESCE(ins.total, 0) AS inscritos,
        COALESCE(asis.total, 0) AS asistentes,
        COALESCE(part.total, 0) AS participantes,
        e.cupo_maximo,
        CASE WHEN e.cupo_maximo IS NOT NULL AND e.cupo_maximo > 0
          THEN ROUND((COALESCE(ins.total, 0)::numeric / e.cupo_maximo) * 100, 1) END AS ocupacion,
        CASE WHEN COALESCE(ins.total, 0) > 0
          THEN ROUND((COALESCE(asis.total, 0)::numeric / ins.total) * 100, 1) END AS asistencia_efectiva,
        CASE WHEN COALESCE(asis.total, 0) > 0
          THEN ROUND((COALESCE(part.total, 0)::numeric / asis.total) * 100, 1) END AS participacion_pct,
        cal.promedio_general, cal.nps,
        COALESCE(cert.total, 0) AS certificados
      FROM eventos e
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM inscripciones i
        WHERE i.estado_pago IN ('NO_APLICA','CONFIRMADO') GROUP BY i.evento_id) ins ON ins.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM inscripciones i
        JOIN asistencias a ON a.inscripcion_id = i.id
        WHERE i.estado_pago IN ('NO_APLICA','CONFIRMADO') GROUP BY i.evento_id) asis ON asis.evento_id = e.id
      LEFT JOIN (SELECT a2.evento_id, COUNT(DISTINCT p.inscripcion_id) AS total FROM participaciones p
        JOIN actividades a2 ON a2.id = p.actividad_id GROUP BY a2.evento_id) part ON part.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, ROUND(AVG(c.general), 2) AS promedio_general,
        ROUND((COUNT(*) FILTER (WHERE c.nps >= 9)::numeric - COUNT(*) FILTER (WHERE c.nps <= 6)::numeric)
          / NULLIF(COUNT(c.nps), 0) * 100, 1) AS nps
        FROM calificaciones_evento c JOIN inscripciones i ON i.id = c.inscripcion_id
        GROUP BY i.evento_id) cal ON cal.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM certificados ce
        JOIN inscripciones i ON i.id = ce.inscripcion_id GROUP BY i.evento_id) cert ON cert.evento_id = e.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      ORDER BY e.fecha_inicio DESC
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Afluencia: check-ins por franja horaria. */
  afluencia(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{ evento_id: string; titulo: string; franja: string; checkins: bigint }>
    >(`
      SELECT e.id AS evento_id, e.titulo,
        TO_CHAR(a.hora_checkin, 'HH24') || ':00' AS franja,
        COUNT(*) AS checkins
      FROM asistencias a
      JOIN inscripciones i ON i.id = a.inscripcion_id
      JOIN eventos e ON e.id = i.evento_id
      WHERE e.deleted_at IS NULL ${filtroSql}
      GROUP BY e.id, e.titulo, franja
      ORDER BY e.id, franja
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Ranking de actividades por participación y calificación. */
  rankingActividades(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{ actividad_id: string; titulo: string; evento: string; participantes: bigint; promedio: number | null }>
    >(`
      SELECT a.id AS actividad_id, a.titulo, e.titulo AS evento,
        COUNT(DISTINCT p.inscripcion_id) AS participantes,
        (SELECT ROUND(AVG(ca.puntaje), 2) FROM calificaciones_actividad ca WHERE ca.actividad_id = a.id) AS promedio
      FROM actividades a
      JOIN eventos e ON e.id = a.evento_id
      LEFT JOIN participaciones p ON p.actividad_id = a.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      GROUP BY a.id, a.titulo, e.titulo
      ORDER BY participantes DESC, promedio DESC NULLS LAST
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Satisfacción global: promedios por dimensión y NPS. */
  satisfaccion(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{
        total: bigint;
        promedio_general: number | null;
        promedio_organizacion: number | null;
        promedio_contenido: number | null;
        promotores: bigint;
        detractores: bigint;
        respuestas_nps: bigint;
      }>
    >(`
      SELECT COUNT(*) AS total,
        ROUND(AVG(c.general), 2) AS promedio_general,
        ROUND(AVG(c.organizacion), 2) AS promedio_organizacion,
        ROUND(AVG(c.contenido), 2) AS promedio_contenido,
        COUNT(*) FILTER (WHERE c.nps >= 9) AS promotores,
        COUNT(*) FILTER (WHERE c.nps <= 6) AS detractores,
        COUNT(c.nps) AS respuestas_nps
      FROM calificaciones_evento c
      JOIN inscripciones i ON i.id = c.inscripcion_id
      JOIN eventos e ON e.id = i.evento_id
      WHERE e.deleted_at IS NULL ${filtroSql}
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Recurrencia: asistentes con eventos previos vs. nuevos (por correo). */
  recurrencia(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{ recurrentes: bigint; nuevos: bigint; recurrentes_pct: number | null }>
    >(`
      WITH asistencias_por_email AS (
        SELECT i.email, COUNT(DISTINCT i.evento_id) AS eventos
        FROM inscripciones i
        JOIN asistencias a ON a.inscripcion_id = i.id
        JOIN eventos e ON e.id = i.evento_id
        WHERE e.deleted_at IS NULL ${filtroSql}
        GROUP BY i.email
      )
      SELECT
        COUNT(*) FILTER (WHERE eventos > 1) AS recurrentes,
        COUNT(*) FILTER (WHERE eventos = 1) AS nuevos,
        CASE WHEN COUNT(*) > 0 THEN ROUND(COUNT(*) FILTER (WHERE eventos > 1)::numeric / COUNT(*) * 100, 1) END AS recurrentes_pct
      FROM asistencias_por_email
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Perfil de asistentes: distribución por carrera y universidad. */
  perfil(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{ dimension: "carrera" | "universidad"; valor: string; total: bigint }>
    >(`
      SELECT 'carrera' AS dimension, COALESCE(i.carrera, 'Sin especificar') AS valor, COUNT(DISTINCT i.id) AS total
      FROM inscripciones i
      JOIN eventos e ON e.id = i.evento_id
      JOIN asistencias a ON a.inscripcion_id = i.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      GROUP BY valor
      UNION ALL
      SELECT 'universidad' AS dimension, COALESCE(i.universidad, 'Sin especificar') AS valor, COUNT(DISTINCT i.id) AS total
      FROM inscripciones i
      JOIN eventos e ON e.id = i.evento_id
      JOIN asistencias a ON a.inscripcion_id = i.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      GROUP BY valor
      ORDER BY dimension, total DESC
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Embudo por evento: inscrito → asistió → participó → calificó → certificado → reinscripción. */
  embudo(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{
        evento_id: string;
        titulo: string;
        inscritos: bigint;
        asistieron: bigint;
        participaron: bigint;
        calificaron: bigint;
        certificados: bigint;
        reinscritos: bigint;
      }>
    >(`
      SELECT e.id AS evento_id, e.titulo,
        COALESCE(ins.total, 0) AS inscritos,
        COALESCE(asis.total, 0) AS asistieron,
        COALESCE(part.total, 0) AS participaron,
        COALESCE(cal.total, 0) AS calificaron,
        COALESCE(cert.total, 0) AS certificados,
        COALESCE(re.total, 0) AS reinscritos
      FROM eventos e
      LEFT JOIN (SELECT evento_id, COUNT(*) AS total FROM inscripciones WHERE estado_pago IN ('NO_APLICA','CONFIRMADO') GROUP BY evento_id) ins ON ins.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM inscripciones i JOIN asistencias a ON a.inscripcion_id = i.id GROUP BY i.evento_id) asis ON asis.evento_id = e.id
      LEFT JOIN (SELECT a2.evento_id, COUNT(DISTINCT p.inscripcion_id) AS total FROM participaciones p JOIN actividades a2 ON a2.id = p.actividad_id GROUP BY a2.evento_id) part ON part.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM calificaciones_evento c JOIN inscripciones i ON i.id = c.inscripcion_id GROUP BY i.evento_id) cal ON cal.evento_id = e.id
      LEFT JOIN (SELECT i.evento_id, COUNT(*) AS total FROM certificados ce JOIN inscripciones i ON i.id = ce.inscripcion_id GROUP BY i.evento_id) cert ON cert.evento_id = e.id
      LEFT JOIN (
        SELECT i.evento_id, COUNT(*) AS total FROM inscripciones i
        WHERE EXISTS (
          SELECT 1 FROM inscripciones previa
          JOIN eventos ev2 ON ev2.id = previa.evento_id AND ev2.fecha_inicio < (SELECT fecha_inicio FROM eventos WHERE id = i.evento_id)
          WHERE previa.email = i.email
        ) GROUP BY i.evento_id
      ) re ON re.evento_id = e.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      ORDER BY e.fecha_inicio DESC
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Comparación entre eventos y agregado por tipo. */
  comparacion(ids: string[]) {
    return this.db.$queryRawUnsafe<
      Array<{
        evento_id: string;
        titulo: string;
        inscritos: bigint;
        asistentes: bigint;
        participantes: bigint;
        promedio_general: number | null;
        nps: number | null;
      }>
    >(`
      SELECT e.id AS evento_id, e.titulo,
        (SELECT COUNT(*) FROM inscripciones i WHERE i.evento_id = e.id AND i.estado_pago IN ('NO_APLICA','CONFIRMADO')) AS inscritos,
        (SELECT COUNT(*) FROM inscripciones i JOIN asistencias a ON a.inscripcion_id = i.id WHERE i.evento_id = e.id) AS asistentes,
        (SELECT COUNT(DISTINCT p.inscripcion_id) FROM participaciones p JOIN actividades ac ON ac.id = p.actividad_id WHERE ac.evento_id = e.id) AS participantes,
        (SELECT ROUND(AVG(c.general), 2) FROM calificaciones_evento c JOIN inscripciones i2 ON i2.id = c.inscripcion_id WHERE i2.evento_id = e.id) AS promedio_general,
        (
          SELECT ROUND(
            (COUNT(*) FILTER (WHERE c.nps >= 9)::numeric - COUNT(*) FILTER (WHERE c.nps <= 6)::numeric)
            / NULLIF(COUNT(c.nps), 0) * 100, 1)
          FROM calificaciones_evento c JOIN inscripciones i3 ON i3.id = c.inscripcion_id WHERE i3.evento_id = e.id
        ) AS nps
      FROM eventos e
      WHERE e.deleted_at IS NULL AND e.id = ANY($1::uuid[])
      ORDER BY e.fecha_inicio DESC
    `, ids);
  }

  porTipo(filtro: FiltroEventos) {
    const filtroSql = this.organizadorFiltro(filtro);
    return this.db.$queryRawUnsafe<
      Array<{ tipo: string; eventos: bigint; inscritos: bigint; asistentes: bigint; promedio_general: number | null }>
    >(`
      SELECT e.tipo::text AS tipo, COUNT(DISTINCT e.id) AS eventos,
        COUNT(i.id) AS inscritos,
        COUNT(a.id) AS asistentes,
        (SELECT ROUND(AVG(c.general), 2) FROM calificaciones_evento c JOIN inscripciones i4 ON i4.id = c.inscripcion_id JOIN eventos e2 ON e2.id = i4.evento_id WHERE e2.tipo = e.tipo) AS promedio_general
      FROM eventos e
      LEFT JOIN inscripciones i ON i.evento_id = e.id AND i.estado_pago IN ('NO_APLICA','CONFIRMADO')
      LEFT JOIN asistencias a ON a.inscripcion_id = i.id
      WHERE e.deleted_at IS NULL ${filtroSql}
      GROUP BY e.tipo
      ORDER BY inscritos DESC
    `, ...(filtro.organizadorId ? [filtro.organizadorId] : []));
  }

  /** Contenido: top publicaciones por vistas/descargas/likes + proyectos publicados. */
  contenido() {
    return this.db.$queryRawUnsafe<
      Array<{ tipo: string; titulo: string; slug: string; vistas: bigint; descargas: bigint; likes: bigint }>
    >(`
      SELECT p.tipo::text AS tipo, p.titulo, p.slug, p.vistas, p.descargas,
        (SELECT COUNT(*) FROM publicacion_likes l WHERE l.publicacion_id = p.id) AS likes
      FROM publicaciones p
      WHERE p.estado = 'PUBLICADO'
      ORDER BY p.vistas DESC
      LIMIT 10
    `);
  }

  proyectosPublicados() {
    return this.db.$queryRawUnsafe<Array<{ total: bigint; colaboradores: bigint }>>(`
      SELECT
        (SELECT COUNT(*) FROM proyectos WHERE publicado = true) AS total,
        (SELECT COUNT(*) FROM proyecto_colaboradores pc JOIN proyectos pr ON pr.id = pc.proyecto_id WHERE pr.publicado = true) AS colaboradores
    `);
  }

  /** Asistencias por mes (para el gráfico del admin). */
  asistenciasPorMes() {
    return this.db.$queryRawUnsafe<Array<{ mes: string; checkins: bigint }>>(`
      SELECT TO_CHAR(DATE_TRUNC('month', a.hora_checkin), 'YYYY-MM') AS mes, COUNT(*) AS checkins
      FROM asistencias a
      GROUP BY mes
      ORDER BY mes
    `);
  }
}

export type MetricasUser = Pick<AuthUser, "id" | "rol">;
