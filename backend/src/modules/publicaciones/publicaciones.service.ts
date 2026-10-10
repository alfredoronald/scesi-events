import { NotFoundError, BusinessRuleError, ForbiddenError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import { slugify } from "../../shared/utils/slug.js";
import type { PublicacionesRepository, PublicacionRow } from "./publicaciones.repository.js";
import type {
  ActualizarPublicacionInput,
  CrearPublicacionInput,
  ListarPublicacionesQuery,
  PublicacionDto,
} from "./publicaciones.schemas.js";

const VENTANA_MS = 10 * 60 * 1000;

export class PublicacionesService {
  private readonly vistasRecientes = new Map<string, number>();
  private readonly descargasRecientes = new Map<string, number>();

  constructor(private readonly repository: PublicacionesRepository) {}

  async listar(query: ListarPublicacionesQuery, user: AuthUser | undefined) {
    const esAdmin = user?.rol === "ADMIN";
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const filtros = { tipo: query.tipo, categoria: query.categoria, buscar: query.buscar, soloPublicados: !esAdmin };
    const [publicaciones, total] = await Promise.all([
      this.repository.list(filtros, (page - 1) * pageSize, pageSize),
      this.repository.count(filtros),
    ]);
    const likes = user ? await this.repository.likeIdsDeUsuario(user.id, publicaciones.map((p) => p.id)) : new Set<string>();
    return { data: publicaciones.map((p) => this.toDto(p, user, likes)), total, page, pageSize };
  }

  async detallePorSlug(slug: string, user: AuthUser | undefined, cliente: string): Promise<PublicacionDto> {
    const publicacion = await this.repository.findBySlug(slug);
    if (!publicacion) throw new NotFoundError("Publicación");
    if (publicacion.estado !== "PUBLICADO" && user?.rol !== "ADMIN") throw new NotFoundError("Publicación");
    if (publicacion.estado === "PUBLICADO" && this.puedeContar(this.vistasRecientes, `${publicacion.id}:${cliente}`)) {
      await this.repository.incrementarVistas(publicacion.id);
      publicacion.vistas += 1;
    }
    const likes = user ? await this.repository.likeIdsDeUsuario(user.id, [publicacion.id]) : new Set<string>();
    return this.toDto(publicacion, user, likes);
  }

  async crear(input: CrearPublicacionInput, user: AuthUser): Promise<PublicacionDto> {
    this.assertAdmin(user);
    if (input.tipo === "paper" && !input.pdfUrl) {
      throw new BusinessRuleError("PAPER_REQUIERE_PDF", "Un paper necesita la URL de su PDF.");
    }
    const slug = await this.slugUnico(input.titulo);
    const publicacion = await this.repository.create(
      {
        tipo: input.tipo === "blog" ? "BLOG" : "PAPER",
        titulo: input.titulo,
        slug,
        resumen: input.resumen,
        ...(input.contenido !== undefined ? { contenido: input.contenido } : {}),
        ...(input.pdfUrl !== undefined ? { pdfUrl: input.pdfUrl } : {}),
        autorId: user.id,
        ...(input.autoresTexto !== undefined ? { autoresTexto: input.autoresTexto } : {}),
        ...(input.doi !== undefined ? { doi: input.doi } : {}),
        estado: input.estado === "publicado" ? "PUBLICADO" : "BORRADOR",
        ...(input.estado === "publicado" ? { publicadoEn: new Date() } : {}),
      },
      input.categorias,
    );
    return this.toDto(publicacion, user, new Set());
  }

  async actualizar(idOrSlug: string, input: ActualizarPublicacionInput, user: AuthUser): Promise<PublicacionDto> {
    this.assertAdmin(user);
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    const actualizarEstado = input.estado !== undefined ? input.estado : undefined;
    const publicarAhora = actualizarEstado === "publicado" && publicacion.estado !== "PUBLICADO";
    const actualizada = await this.repository.update(
      publicacion.id,
      {
        ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
        ...(input.resumen !== undefined ? { resumen: input.resumen } : {}),
        ...(input.contenido !== undefined ? { contenido: input.contenido } : {}),
        ...(input.pdfUrl !== undefined ? { pdfUrl: input.pdfUrl } : {}),
        ...(input.autoresTexto !== undefined ? { autoresTexto: input.autoresTexto } : {}),
        ...(input.doi !== undefined ? { doi: input.doi } : {}),
        ...(input.estado !== undefined ? { estado: input.estado === "publicado" ? "PUBLICADO" : "BORRADOR" } : {}),
        ...(publicarAhora ? { publicadoEn: new Date() } : {}),
      },
      input.categorias,
    );
    return this.toDto(actualizada, user, new Set());
  }

  async eliminar(idOrSlug: string, user: AuthUser): Promise<void> {
    this.assertAdmin(user);
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    await this.repository.delete(publicacion.id);
  }

  /** Descarga del paper: suma contador con control por IP/ventana. */
  async descargar(idOrSlug: string, cliente: string): Promise<{ pdfUrl: string }> {
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    if (publicacion.tipo !== "PAPER" || !publicacion.pdfUrl) {
      throw new BusinessRuleError("SIN_PDF", "Esta publicación no tiene PDF.");
    }
    if (publicacion.estado !== "PUBLICADO") throw new NotFoundError("Publicación");
    if (this.puedeContar(this.descargasRecientes, `${publicacion.id}:${cliente}`)) {
      await this.repository.incrementarDescargas(publicacion.id);
    }
    return { pdfUrl: publicacion.pdfUrl };
  }

  /** Like con alternancia; requiere cuenta. */
  async toggleLike(idOrSlug: string, user: AuthUser): Promise<{ likes: number; liked: boolean }> {
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    if (publicacion.estado !== "PUBLICADO") throw new NotFoundError("Publicación");
    const existente = await this.repository.findLike(publicacion.id, user.id);
    if (existente) {
      await this.repository.deleteLike(publicacion.id, user.id);
    } else {
      await this.repository.createLike(publicacion.id, user.id);
    }
    const likes = await this.repository.countLikes(publicacion.id);
    return { likes, liked: existente === null };
  }

  async comentarios(idOrSlug: string) {
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    if (publicacion.estado !== "PUBLICADO") throw new NotFoundError("Publicación");
    return (await this.repository.comentarios(publicacion.id)).map((c) => ({
      id: c.id,
      autor: c.usuario.nombreCompleto,
      texto: c.texto,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  async comentar(idOrSlug: string, texto: string, user: AuthUser) {
    const publicacion = await this.findByIdOrSlug(idOrSlug);
    if (publicacion.estado !== "PUBLICADO") throw new NotFoundError("Publicación");
    const comentario = await this.repository.createComentario({
      publicacionId: publicacion.id,
      usuarioId: user.id,
      texto,
    });
    return { id: comentario.id, autor: comentario.usuario.nombreCompleto, texto: comentario.texto, createdAt: comentario.createdAt.toISOString() };
  }

  async eliminarComentario(comentarioId: string, user: AuthUser): Promise<void> {
    const comentario = await this.repository.findComentario(comentarioId);
    if (!comentario) throw new NotFoundError("Comentario");
    // El autor puede borrar el suyo; el admin cualquiera (PRD §4.10).
    if (user.id !== comentario.usuarioId && user.rol !== "ADMIN") {
      throw new ForbiddenError("Solo el autor o un administrador pueden eliminar el comentario.");
    }
    await this.repository.deleteComentario(comentarioId);
  }

  private assertAdmin(user: AuthUser): void {
    if (user.rol !== "ADMIN") {
      throw new ForbiddenError("En esta entrega solo el administrador gestiona publicaciones.");
    }
  }

  private async findByIdOrSlug(idOrSlug: string): Promise<PublicacionRow> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const publicacion = isUuid ? await this.repository.findById(idOrSlug) : await this.repository.findBySlug(idOrSlug);
    if (!publicacion) throw new NotFoundError("Publicación");
    return publicacion;
  }

  private puedeContar(registro: Map<string, number>, clave: string): boolean {
    const ahora = Date.now();
    const anterior = registro.get(clave);
    if (anterior !== undefined && ahora - anterior < VENTANA_MS) return false;
    registro.set(clave, ahora);
    if (registro.size > 5000) this.limpiar(registro, ahora);
    return true;
  }

  private limpiar(registro: Map<string, number>, ahora: number): void {
    for (const [clave, ts] of registro) {
      if (ahora - ts >= VENTANA_MS) registro.delete(clave);
    }
  }

  private async slugUnico(titulo: string): Promise<string> {
    const base = slugify(titulo) || "publicacion";
    let slug = base;
    let i = 2;
    while (await this.repository.slugExists(slug)) {
      slug = `${base}-${i}`;
      i += 1;
    }
    return slug;
  }

  private toDto(p: PublicacionRow, user: AuthUser | undefined, likesDelUsuario: Set<string>): PublicacionDto {
    return {
      id: p.id,
      tipo: p.tipo === "BLOG" ? "blog" : "paper",
      titulo: p.titulo,
      slug: p.slug,
      resumen: p.resumen,
      contenido: p.contenido,
      pdfUrl: p.pdfUrl,
      autor: { id: p.autor.id, nombre: p.autor.nombreCompleto },
      autoresTexto: p.autoresTexto,
      doi: p.doi,
      estado: p.estado === "PUBLICADO" ? "publicado" : "borrador",
      publicadoEn: p.publicadoEn?.toISOString() ?? null,
      vistas: p.vistas,
      descargas: p.descargas,
      likes: p._count.likes,
      likedByMe: user !== undefined && likesDelUsuario.has(p.id),
      categorias: p.categorias.map((c) => c.categoria.nombre),
      comentarios: p._count.comentarios,
      createdAt: p.createdAt.toISOString(),
    };
  }
}
