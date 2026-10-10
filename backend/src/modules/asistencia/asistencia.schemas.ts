import { z } from "zod";

export const checkinQrSchema = z.object({
  qrToken: z.string().min(4).max(200),
  eventoId: z.string().uuid().optional(),
});

export const checkinManualSchema = z.object({
  eventoId: z.string().uuid(),
  inscripcionId: z.string().uuid(),
  puntoControl: z.string().trim().min(1).max(120).default("Ingreso principal"),
});

export const buscarParaManualSchema = z.object({
  eventoId: z.string().uuid(),
  buscar: z.string().min(2).max(160),
});

export const listarAsistenciaQuerySchema = z.object({
  estado: z.enum(["todos", "dentro", "salieron", "sin_ingreso"]).default("todos"),
  buscar: z.string().max(160).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(200).optional(),
});

export type CheckinQrInput = z.infer<typeof checkinQrSchema>;
export type CheckinManualInput = z.infer<typeof checkinManualSchema>;
export type ListarAsistenciaQuery = z.infer<typeof listarAsistenciaQuerySchema>;

export type CheckinResultado =
  | { ok: true; yaRegistrado: false; inscripcion: { id: string; nombreCompleto: string; codigo: string }; horaCheckin: string }
  | { ok: true; yaRegistrado: true; inscripcion: { id: string; nombreCompleto: string; codigo: string }; horaCheckin: string; mensaje: string };
