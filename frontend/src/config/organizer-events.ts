import { events } from "./events";
import { tickets } from "./tickets";

export type EventModality = "Presencial" | "Híbrido" | "Virtual";

export type OrganizerEventStatus = "published" | "draft" | "finished";

export type OrganizerEvent = {
  id: string;
  title: string;
  /** Formato con año, p. ej. "28 SEP 2025". */
  date: string;
  enrolled: number;
  capacity: number;
  modality: EventModality;
  status: OrganizerEventStatus;
};

export const statusLabels: Record<OrganizerEventStatus, string> = {
  published: "Publicado",
  draft: "Borrador",
  finished: "Finalizado",
};

/** Títulos desde las fuentes existentes (catálogo de eventos + entradas). */
const titlesById = new Map<string, string>([
  ...events.map((event) => [event.id, event.title] as const),
  ...tickets
    .filter((ticket) => ticket.status === "past")
    .map((ticket) => [ticket.id, ticket.title] as const),
]);

function titleFor(id: string): string {
  const title = titlesById.get(id);
  if (!title) {
    throw new Error(`Evento desconocido para la vista del organizador: ${id}`);
  }
  return title;
}

const records: Omit<OrganizerEvent, "title">[] = [
  // Publicados (los 4 del catálogo vigente)
  {
    id: "hackathon-scesi",
    date: "28 SEP 2025",
    enrolled: 248,
    capacity: 300,
    modality: "Presencial",
    status: "published",
  },
  {
    id: "devtalks-ia-sin-humo",
    date: "12 OCT 2025",
    enrolled: 126,
    capacity: 180,
    modality: "Híbrido",
    status: "published",
  },
  {
    id: "feria-internacional-del-libro",
    date: "05 SEP 2025",
    enrolled: 89,
    capacity: 150,
    modality: "Presencial",
    status: "published",
  },
  {
    id: "taller-git-github",
    date: "26 OCT 2025",
    enrolled: 40,
    capacity: 40,
    modality: "Virtual",
    status: "published",
  },
  // Borradores
  {
    id: "linux-week",
    date: "20 NOV 2025",
    enrolled: 0,
    capacity: 250,
    modality: "Presencial",
    status: "draft",
  },
  {
    id: "taller-de-python",
    date: "05 DIC 2025",
    enrolled: 0,
    capacity: 60,
    modality: "Virtual",
    status: "draft",
  },
  {
    id: "charla-ciberseguridad",
    date: "12 DIC 2025",
    enrolled: 0,
    capacity: 120,
    modality: "Híbrido",
    status: "draft",
  },
  // Finalizados
  {
    id: "programming-day-2025",
    date: "18 MAR 2025",
    enrolled: 310,
    capacity: 350,
    modality: "Presencial",
    status: "finished",
  },
  {
    id: "game-jam-scesi",
    date: "14 JUN 2025",
    enrolled: 96,
    capacity: 100,
    modality: "Presencial",
    status: "finished",
  },
  {
    id: "techzone-2024",
    date: "22 NOV 2024",
    enrolled: 210,
    capacity: 250,
    modality: "Híbrido",
    status: "finished",
  },
  {
    id: "scesi-open-day",
    date: "30 ABR 2025",
    enrolled: 145,
    capacity: 200,
    modality: "Presencial",
    status: "finished",
  },
  {
    id: "hackathon-invierno",
    date: "09 AGO 2025",
    enrolled: 72,
    capacity: 80,
    modality: "Virtual",
    status: "finished",
  },
];

/** Listado del organizador: títulos resueltos desde las fuentes existentes. */
export const organizerEvents: OrganizerEvent[] = records.map((record) => ({
  ...record,
  title: titleFor(record.id),
}));
