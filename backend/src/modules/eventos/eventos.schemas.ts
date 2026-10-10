import { z } from "zod";

const tipoSchema = z.enum(["charla", "taller", "hackathon", "congreso", "ctf"]);
const modalidadSchema = z.enum(["presencial", "virtual", "mixto"]);
const estadoSchema = z.enum(["borrador", "publicado", "en_curso", "cerrado"]);
const participacionSchema = z.enum(["organized", "invited", "staff"]);

const baseFields = {
  titulo: z.string().min(3).max(160),
  descripcion: z.string().min(10).max(5000),
  tipo: tipoSchema,
  modalidad: modalidadSchema,
  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date(),
  lugar: z.string().min(3).max(200),
  enlaceVirtual: z.string().url().max(500).nullable().optional(),
  imagenUrl: z.string().max(500).nullable().optional(),
  esPago: z.boolean().default(false),
  precio: z.coerce.number().min(0).max(99999).nullable().optional(),
  cupoMaximo: z.coerce.number().int().min(1).max(100000).nullable().optional(),
  participacionScesi: participacionSchema.default("organized"),
  entregaCertificado: z.boolean().default(false),
  certificadoA: z.enum(["todos", "solo_ponentes"]).default("todos"),
};

export const crearEventoSchema = z
  .object(baseFields)
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fechaFin"],
  })
  .refine((data) => !data.esPago || (data.precio !== null && data.precio !== undefined && data.precio > 0), {
    message: "Un evento pago necesita un precio mayor a 0",
    path: ["precio"],
  });

export const actualizarEventoSchema = z
  .object({
    titulo: baseFields.titulo.optional(),
    descripcion: baseFields.descripcion.optional(),
    tipo: tipoSchema.optional(),
    modalidad: modalidadSchema.optional(),
    fechaInicio: z.coerce.date().optional(),
    fechaFin: z.coerce.date().optional(),
    lugar: baseFields.lugar.optional(),
    enlaceVirtual: z.string().url().max(500).nullable().optional(),
    imagenUrl: z.string().max(500).nullable().optional(),
    esPago: z.boolean().optional(),
    precio: z.coerce.number().min(0).max(99999).nullable().optional(),
    cupoMaximo: z.coerce.number().int().min(1).max(100000).nullable().optional(),
    participacionScesi: participacionSchema.optional(),
    entregaCertificado: z.boolean().optional(),
    certificadoA: z.enum(["todos", "solo_ponentes"]).optional(),
  })
  .refine((data) => data.fechaFin === undefined || data.fechaInicio === undefined || data.fechaFin >= data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fechaFin"],
  });

export const cambiarEstadoSchema = z.object({ estado: estadoSchema });

export const asignarStaffSchema = z.object({ staffIds: z.array(z.string().uuid()).max(50) });

export const listarEventosQuerySchema = z.object({
  /** proximos | pasados | todos (default proximos en público). */
  periodo: z.enum(["proximos", "pasados", "todos"]).optional(),
  tipo: tipoSchema.optional(),
  estado: estadoSchema.optional(),
  buscar: z.string().max(160).optional(),
  /** true → eventos del organizador autenticado (cualquier estado). */
  mios: z.coerce.boolean().optional(),
  /** true → eventos donde el staff autenticado está asignado. */
  staff: z.coerce.boolean().optional(),
  organizadorId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export type CrearEventoInput = z.infer<typeof crearEventoSchema>;
export type ActualizarEventoInput = z.infer<typeof actualizarEventoSchema>;
export type ListarEventosQuery = z.infer<typeof listarEventosQuerySchema>;
