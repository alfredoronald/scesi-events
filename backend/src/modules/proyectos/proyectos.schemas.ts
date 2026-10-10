import { z } from "zod";

export const crearProyectoSchema = z.object({
  titulo: z.string().min(3).max(160),
  descripcion: z.string().min(10).max(3000),
  imagenUrl: z.string().max(500).nullable().optional(),
  githubUrl: z.string().url().max(500).nullable().optional(),
  categoria: z.string().max(80).optional(),
  publicado: z.boolean().default(true),
  colaboradores: z
    .array(z.object({ nombre: z.string().min(3).max(160), usuarioId: z.string().uuid().optional() }))
    .max(50)
    .default([]),
});

export const actualizarProyectoSchema = z.object({
  titulo: z.string().min(3).max(160).optional(),
  descripcion: z.string().min(10).max(3000).optional(),
  imagenUrl: z.string().max(500).nullable().optional(),
  githubUrl: z.string().url().max(500).nullable().optional(),
  categoria: z.string().max(80).nullable().optional(),
  publicado: z.boolean().optional(),
  colaboradores: z
    .array(z.object({ nombre: z.string().min(3).max(160), usuarioId: z.string().uuid().optional() }))
    .max(50)
    .optional(),
});

export const listarProyectosQuerySchema = z.object({
  buscar: z.string().max(160).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type CrearProyectoInput = z.infer<typeof crearProyectoSchema>;
export type ActualizarProyectoInput = z.infer<typeof actualizarProyectoSchema>;
export type ListarProyectosQuery = z.infer<typeof listarProyectosQuerySchema>;

export type ProyectoDto = {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  githubUrl: string | null;
  categoria: string | null;
  publicado: boolean;
  colaboradores: Array<{ id: string; nombre: string }>;
  createdAt: string;
};
