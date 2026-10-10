import { z } from "zod";

export const crearInscripcionSchema = z.object({
  nombreCompleto: z.string().min(3, "Ingresa tu nombre completo").max(160),
  email: z.string().email("Correo inválido"),
  celular: z.string().min(6, "Ingresa un celular válido").max(30),
  carrera: z.string().max(120).optional(),
  universidad: z.string().max(160).optional(),
  consentimientoDatos: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el tratamiento de tus datos para inscribirte" }),
  }),
  aceptaComunicaciones: z.boolean().default(false),
});

export const listarInscripcionesQuerySchema = z.object({
  estado: z.enum(["confirmados", "pendientes", "rechazados", "todos"]).default("todos"),
  buscar: z.string().max(160).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export const confirmarPagoSchema = z.object({
  estado: z.enum(["confirmado", "rechazado"]),
});

export const accesoSchema = z.object({
  token: z.string().min(4).max(20).optional(),
});

export type CrearInscripcionInput = z.infer<typeof crearInscripcionSchema>;
export type ListarInscripcionesQuery = z.infer<typeof listarInscripcionesQuerySchema>;
export type ConfirmarPagoInput = z.infer<typeof confirmarPagoSchema>;
