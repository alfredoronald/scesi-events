import { z } from "zod";

const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(100);

export const loginSchema = z.object({
  identifier: z.string().min(3, "Ingresa tu correo o usuario").max(255),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z.object({
  nombreCompleto: z.string().min(3).max(160),
  username: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9_.-]+$/i, "Solo letras, números, punto, guion y guion bajo"),
  email: z.string().email().max(255),
  password: passwordSchema,
  celular: z.string().min(6).max(30).optional(),
  carrera: z.string().max(120).optional(),
  universidad: z.string().max(160).optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
