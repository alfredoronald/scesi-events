import { ForbiddenError, NotFoundError } from "../../shared/errors/index.js";
import type { AuthUser } from "../../shared/middlewares/auth.js";
import type { ProyectosRepository } from "./proyectos.repository.js";
import type { ActualizarProyectoInput, CrearProyectoInput, ListarProyectosQuery, ProyectoDto } from "./proyectos.schemas.js";
import type { Prisma, Proyecto, ProyectoColaborador } from "@prisma/client";

type ProyectoConColaboradores = Prisma.ProyectoGetPayload<{ include: { colaboradores: true } }>;

export class ProyectosService {
  constructor(private readonly repository: ProyectosRepository) {}

  async listar(query: ListarProyectosQuery, user: AuthUser | undefined) {
    const esAdmin = user?.rol === "ADMIN";
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [proyectos, total] = await Promise.all([
      this.repository.list({ buscar: query.buscar, soloPublicados: !esAdmin }, (page - 1) * pageSize, pageSize),
      this.repository.count({ buscar: query.buscar, soloPublicados: !esAdmin }),
    ]);
    return { data: proyectos.map(this.toDto), total, page, pageSize };
  }

  async detalle(id: string, user: AuthUser | undefined): Promise<ProyectoDto> {
    const proyecto = await this.repository.findById(id);
    if (!proyecto) throw new NotFoundError("Proyecto");
    if (!proyecto.publicado && user?.rol !== "ADMIN") throw new NotFoundError("Proyecto");
    return this.toDto(proyecto);
  }

  async crear(input: CrearProyectoInput, user: AuthUser): Promise<ProyectoDto> {
    this.assertPuedePublicar(user);
    const proyecto = await this.repository.create(
      {
        titulo: input.titulo,
        descripcion: input.descripcion,
        ...(input.imagenUrl !== undefined ? { imagenUrl: input.imagenUrl } : {}),
        ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl } : {}),
        ...(input.categoria !== undefined ? { categoria: input.categoria } : {}),
        publicado: input.publicado,
        creadoPorId: user.id,
      },
      input.colaboradores,
    );
    return this.toDto(proyecto);
  }

  async actualizar(id: string, input: ActualizarProyectoInput, user: AuthUser): Promise<ProyectoDto> {
    this.assertPuedePublicar(user);
    const proyecto = await this.repository.findById(id);
    if (!proyecto) throw new NotFoundError("Proyecto");
    const actualizado = await this.repository.update(
      id,
      {
        ...(input.titulo !== undefined ? { titulo: input.titulo } : {}),
        ...(input.descripcion !== undefined ? { descripcion: input.descripcion } : {}),
        ...(input.imagenUrl !== undefined ? { imagenUrl: input.imagenUrl } : {}),
        ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl } : {}),
        ...(input.categoria !== undefined ? { categoria: input.categoria } : {}),
        ...(input.publicado !== undefined ? { publicado: input.publicado } : {}),
      },
      input.colaboradores,
    );
    return this.toDto(actualizado);
  }

  async eliminar(id: string, user: AuthUser): Promise<void> {
    this.assertPuedePublicar(user);
    const proyecto = await this.repository.findById(id);
    if (!proyecto) throw new NotFoundError("Proyecto");
    await this.repository.delete(id);
  }

  /** Política de publicación: fase 1 solo admin; fase 2 = admin | member. */
  private assertPuedePublicar(user: AuthUser): void {
    if (user.rol !== "ADMIN") {
      throw new ForbiddenError("En esta entrega solo el administrador gestiona proyectos.");
    }
  }

  private toDto: (p: ProyectoConColaboradores) => ProyectoDto = (p) => ({
    id: p.id,
    titulo: p.titulo,
    descripcion: p.descripcion,
    imagenUrl: p.imagenUrl,
    githubUrl: p.githubUrl,
    categoria: p.categoria,
    publicado: p.publicado,
    colaboradores: p.colaboradores.map((c) => ({ id: c.id, nombre: c.nombre })),
    createdAt: p.createdAt.toISOString(),
  });
}

export type { Proyecto, ProyectoColaborador };
