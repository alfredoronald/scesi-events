import { z } from "zod";

export const calificarEventoSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
  organizacion: z.coerce.number().int().min(1).max(5).optional(),
  contenido: z.coerce.number().int().min(1).max(5).optional(),
  nps: z.coerce.number().int().min(0).max(10).optional(),
});

export const calificarActividadSchema = z.object({
  score: z.coerce.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
});

export type CalificarEventoInput = z.infer<typeof calificarEventoSchema>;
export type CalificarActividadInput = z.infer<typeof calificarActividadSchema>;
