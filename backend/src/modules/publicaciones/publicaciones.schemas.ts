import { z } from "zod";

export const crearPublicacionSchema = z.object({
  tipo: z.enum(["blog", "paper"]),
  titulo: z.string().min(3).max(200),
  resumen: z.string().min(10).max(500),
  contenido: z.string().max(50000).optional(),
  pdfUrl: z.string().max(500).optional(),
  autoresTexto: z.string().max(500).optional(),
  doi: z.string().max(120).optional(),
  estado: z.enum(["borrador", "publicado"]).default("borrador"),
  categorias: z.array(z.string().min(2).max(80)).max(10).default([]),
});

export const actualizarPublicacionSchema = z.object({
  titulo: z.string().min(3).max(200).optional(),
  resumen: z.string().min(10).max(500).optional(),
  contenido: z.string().max(50000).nullable().optional(),
  pdfUrl: z.string().max(500).nullable().optional(),
  autoresTexto: z.string().max(500).nullable().optional(),
  doi: z.string().max(120).nullable().optional(),
  estado: z.enum(["borrador", "publicado"]).optional(),
  categorias: z.array(z.string().min(2).max(80)).max(10).optional(),
});

export const listarPublicacionesQuerySchema = z.object({
  tipo: z.enum(["blog", "paper"]).optional(),
  categoria: z.string().max(80).optional(),
  buscar: z.string().max(160).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const comentarSchema = z.object({
  texto: z.string().min(2, "Escribe tu comentario").max(2000),
});

export type CrearPublicacionInput = z.infer<typeof crearPublicacionSchema>;
export type ActualizarPublicacionInput = z.infer<typeof actualizarPublicacionSchema>;
export type ListarPublicacionesQuery = z.infer<typeof listarPublicacionesQuerySchema>;

export type PublicacionDto = {
  id: string;
  tipo: "blog" | "paper";
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string | null;
  pdfUrl: string | null;
  autor: { id: string; nombre: string };
  autoresTexto: string | null;
  doi: string | null;
  estado: "borrador" | "publicado";
  publicadoEn: string | null;
  vistas: number;
  descargas: number;
  likes: number;
  likedByMe: boolean;
  categorias: string[];
  comentarios: number;
  createdAt: string;
};
