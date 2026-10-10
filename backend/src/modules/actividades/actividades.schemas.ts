import { z } from "zod";

const actividadBase = {
  titulo: z.string().min(3).max(160),
  descripcion: z.string().max(2000).default(""),
  ponente: z.string().min(3).max(160),
  lugar: z.string().max(200).nullable().optional(),
  horaInicio: z.coerce.date(),
  horaFin: z.coerce.date(),
  tipo: z.string().min(3).max(60).default("actividad"),
};

export const crearActividadSchema = z
  .object(actividadBase)
  .refine((data) => data.horaFin >= data.horaInicio, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["horaFin"],
  });

export const actualizarActividadSchema = z
  .object({
    titulo: actividadBase.titulo.optional(),
    descripcion: z.string().max(2000).optional(),
    ponente: actividadBase.ponente.optional(),
    lugar: z.string().max(200).nullable().optional(),
    horaInicio: z.coerce.date().optional(),
    horaFin: z.coerce.date().optional(),
    tipo: z.string().min(3).max(60).optional(),
  })
  .refine((data) => data.horaFin === undefined || data.horaInicio === undefined || data.horaFin >= data.horaInicio, {
    message: "La hora de fin debe ser posterior a la de inicio",
    path: ["horaFin"],
  });

export const crearParticipacionSchema = z.object({
  inscripcionId: z.string().uuid(),
  rol: z.enum(["asistente", "ponente", "competidor"]).default("asistente"),
});

export type CrearActividadInput = z.infer<typeof crearActividadSchema>;
export type ActualizarActividadInput = z.infer<typeof actualizarActividadSchema>;
export type CrearParticipacionInput = z.infer<typeof crearParticipacionSchema>;

export type ActividadDto = {
  id: string;
  eventoId: string;
  titulo: string;
  descripcion: string;
  ponente: string;
  lugar: string | null;
  horaInicio: string;
  horaFin: string;
  tipo: string;
};
