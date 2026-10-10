export type ApiEvent = {
  id: string; slug: string; titulo: string; descripcion: string;
  fechaInicio: string; fechaFin: string; lugar: string; imagenUrl: string | null;
  tipo: "charla" | "taller" | "hackathon" | "congreso" | "ctf";
  modalidad: "presencial" | "virtual" | "mixto";
  estado: "borrador" | "publicado" | "en_curso" | "cerrado";
  participacionScesi: "organized" | "invited" | "staff";
  organizador: { id: string; nombreCompleto: string };
  inscritosConfirmados: number; cupoMaximo: number | null; esPago: boolean; precio: string | null;
};
export type ApiInscription = {
  id: string; eventoId: string; codigo: string; nombreCompleto: string; email: string;
  evento: { id: string; titulo: string; fechaInicio: string; fechaFin: string; lugar: string; modalidad: string };
  estadoPago: "no_aplica" | "pendiente" | "confirmado" | "rechazado";
  asistencia: { horaCheckin: string; horaCheckout?: string | null; puntoControl?: string | null } | null;
  tieneQr: boolean; createdAt: string; certificadoId: string | null;
};
export type ApiActivity = { id: string; eventoId: string; titulo: string; descripcion: string; ponente: string; lugar: string | null; horaInicio: string; horaFin: string; tipo: string };
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/La_Paz" });
}
