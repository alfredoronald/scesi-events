import { events } from "./events";

export type TicketStatus = "upcoming" | "past" | "cancelled";

export const ticketStatusLabels: Record<TicketStatus, string> = {
  upcoming: "Confirmado",
  past: "Asistido",
  cancelled: "Cancelada",
};

export type TicketRecord = {
  id: string;
  /** Referencia al catálogo compartido (conexión con la vista Explorar). */
  eventId?: string;
  /** Código de acceso impreso en la entrada: SC-0284. */
  code: string;
  status: TicketStatus;
  /** Bloque de fecha grande: "28", "05–15". */
  dateBig: string;
  /** Bloque de fecha pequeño: "SEP · 08:00", "SEP". */
  dateSmall: string;
  title: string;
  location: string;
};

type UpcomingSeed = {
  id: string;
  eventId: string;
  code: string;
  dateBig: string;
  dateSmall: string;
};

/**
 * Las entradas próximas se resuelven contra el catálogo de eventos
 * (fuente única de verdad): si cambia el título o lugar del evento,
 * esta vista se actualiza sola.
 */
const upcomingSeeds: UpcomingSeed[] = [
  {
    id: "hackathon-scesi",
    eventId: "hackathon-scesi",
    code: "SC-0284",
    dateBig: "28",
    dateSmall: "SEP · 08:00",
  },
  {
    id: "devtalks-ia-sin-humo",
    eventId: "devtalks-ia-sin-humo",
    code: "SC-0418",
    dateBig: "12",
    dateSmall: "OCT · 18:30",
  },
  {
    id: "feria-internacional-del-libro",
    eventId: "feria-internacional-del-libro",
    code: "SC-0096",
    dateBig: "05–15",
    dateSmall: "SEP",
  },
];

function resolveUpcoming(seed: UpcomingSeed): TicketRecord {
  const event = events.find(({ id }) => id === seed.eventId);
  if (!event) {
    throw new Error(
      `Ticket "${seed.id}" referencia un evento inexistente: "${seed.eventId}"`,
    );
  }
  return {
    ...seed,
    status: "upcoming",
    title: event.title,
    location: event.location,
  };
}

/** Entradas pasadas: datos autónomos (eventos históricos fuera del catálogo). */
const pastTickets: TicketRecord[] = [
  {
    id: "game-jam-scesi",
    code: "SC-0175",
    status: "past",
    dateBig: "20",
    dateSmall: "JUN · 16:00",
    title: "Game Jam SCESI",
    location: "Laboratorio 2 — FCyT",
  },
  {
    id: "techzone-2024",
    code: "SC-0142",
    status: "past",
    dateBig: "05–07",
    dateSmall: "JUN",
    title: "TechZone 2024",
    location: "Coliseo Cobija",
  },
  {
    id: "linux-week",
    code: "SC-0119",
    status: "past",
    dateBig: "19",
    dateSmall: "MAY",
    title: "Linux Week",
    location: "Auditorio MEMI",
  },
  {
    id: "programming-day-2025",
    code: "SC-0098",
    status: "past",
    dateBig: "12",
    dateSmall: "ABR",
    title: "Programming Day 2025",
    location: "FCyT — UMSS",
  },
  {
    id: "taller-de-python",
    code: "SC-0087",
    status: "past",
    dateBig: "22",
    dateSmall: "MAR",
    title: "Taller de Python",
    location: "Laboratorio 3 — FCyT",
  },
  {
    id: "charla-ciberseguridad",
    code: "SC-0076",
    status: "past",
    dateBig: "08",
    dateSmall: "MAR",
    title: "Charla de Ciberseguridad",
    location: "Aula Magna",
  },
  {
    id: "scesi-open-day",
    code: "SC-0054",
    status: "past",
    dateBig: "15",
    dateSmall: "FEB",
    title: "SCESI Open Day",
    location: "Patio central — FCyT",
  },
  {
    id: "hackathon-invierno",
    code: "SC-0031",
    status: "past",
    dateBig: "30",
    dateSmall: "NOV",
    title: "Hackathon de Invierno",
    location: "FCyT — UMSS",
  },
];

/**
 * Mock tipado de entradas del participante.
 * Cuando exista la API se sustituye por un fetch en el Server Component,
 * manteniendo los mismos tipos.
 */
export const tickets: TicketRecord[] = [
  ...upcomingSeeds.map(resolveUpcoming),
  ...pastTickets,
];
