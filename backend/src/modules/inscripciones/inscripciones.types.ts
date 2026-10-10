export type InscripcionDto = {
  id: string;
  eventoId: string;
  evento: { id: string; titulo: string; fechaInicio: string; fechaFin: string; lugar: string; modalidad: string };
  nombreCompleto: string;
  email: string;
  estadoPago: "no_aplica" | "pendiente" | "confirmado" | "rechazado";
  codigo: string;
  tieneQr: boolean;
  comprobanteUrl: string | null;
  asistencia: { horaCheckin: string } | null;
  certificadoId: string | null;
  createdAt: string;
};

export type InscripcionDetalleDto = InscripcionDto & {
  celular: string;
  carrera: string | null;
  universidad: string | null;
  consentimientoDatos: boolean;
  aceptaComunicaciones: boolean;
  estadoFront: "confirmed" | "pending" | "cancelled";
};
