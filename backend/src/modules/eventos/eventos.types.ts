export type EventoTipoDto = "charla" | "taller" | "hackathon" | "congreso" | "ctf";
export type EventoModalidadDto = "presencial" | "virtual" | "mixto";
export type EventoEstadoDto = "borrador" | "publicado" | "en_curso" | "cerrado";
export type ParticipacionScesiDto = "organized" | "invited" | "staff";

export type EventoDto = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  tipo: EventoTipoDto;
  modalidad: EventoModalidadDto;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  enlaceVirtual: string | null;
  imagenUrl: string | null;
  esPago: boolean;
  precio: string | null;
  cupoMaximo: number | null;
  estado: EventoEstadoDto;
  participacionScesi: ParticipacionScesiDto;
  entregaCertificado: boolean;
  certificadoA: "todos" | "solo_ponentes";
  organizador: { id: string; nombreCompleto: string };
  inscritosConfirmados: number;
  createdAt: string;
  updatedAt: string;
};

/** Evento público (landing/explorar): solo campos visibles sin sesión. */
export type EventoPublicoDto = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  tipo: EventoTipoDto;
  modalidad: EventoModalidadDto;
  estado: EventoEstadoDto;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  enlaceVirtual: string | null;
  imagenUrl: string | null;
  esPago: boolean;
  precio: string | null;
  cupoMaximo: number | null;
  cuposDisponibles: number | null;
  participacionScesi: ParticipacionScesiDto;
  organizadorNombre: string;
  requiereConsentimiento: true;
};
