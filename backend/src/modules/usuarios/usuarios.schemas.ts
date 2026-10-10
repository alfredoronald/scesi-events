import { z } from "zod";

export const crearUsuarioSchema = z.object({
  nombreCompleto: z.string().min(3).max(160),
  username: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9_.-]+$/i, "Solo letras, números, punto, guion y guion bajo"),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  rol: z.enum(["ORGANIZADOR", "STAFF", "PARTICIPANTE"]),
  celular: z.string().min(6).max(30).optional(),
  carrera: z.string().max(120).optional(),
  universidad: z.string().max(160).optional(),
});

export const actualizarUsuarioSchema = z.object({
  nombreCompleto: z.string().min(3).max(160).optional(),
  celular: z.string().min(6).max(30).nullable().optional(),
  carrera: z.string().max(120).nullable().optional(),
  universidad: z.string().max(160).nullable().optional(),
  rol: z.enum(["ADMIN", "ORGANIZADOR", "STAFF", "PARTICIPANTE"]).optional(),
  activo: z.boolean().optional(),
});

export const actualizarPerfilSchema = z.object({
  nombreCompleto: z.string().min(3).max(160).optional(),
  celular: z.string().min(6).max(30).nullable().optional(),
  carrera: z.string().max(120).nullable().optional(),
  universidad: z.string().max(160).nullable().optional(),
});

export const cambiarPasswordSchema = z
  .object({
    actual: z.string().min(1),
    nueva: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres").max(100),
  })
  .refine((data) => data.actual !== data.nueva, { message: "La nueva contraseña debe ser distinta", path: ["nueva"] });

export const listarUsuariosQuerySchema = z.object({
  rol: z.enum(["ADMIN", "ORGANIZADOR", "STAFF", "PARTICIPANTE"]).optional(),
  estado: z.enum(["activos", "inactivos"]).optional(),
  buscar: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;
export type ActualizarUsuarioInput = z.infer<typeof actualizarUsuarioSchema>;
export type ActualizarPerfilInput = z.infer<typeof actualizarPerfilSchema>;
export type CambiarPasswordInput = z.infer<typeof cambiarPasswordSchema>;
export type ListarUsuariosQuery = z.infer<typeof listarUsuariosQuerySchema>;
