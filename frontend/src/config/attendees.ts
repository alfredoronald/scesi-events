import { events } from "./events";
import { tickets } from "./tickets";

export type AttendeeStatus = "confirmed" | "pending" | "waitlist";

export type AttendeeRecord = {
  id: string;
  name: string;
  /** Código de acceso que escanea el staff, p. ej. "SCESI-2841". */
  code: string;
  eventId: string;
  /** Título del evento resuelto desde las fuentes existentes. */
  eventName: string;
  /** Fecha de inscripción, p. ej. "02 SEP 2025". */
  registeredAt: string;
  /** Hora de ingreso sembrada por el mock; null = aún no ingresa. */
  checkedInAt: string | null;
  status: AttendeeStatus;
};

export const attendeeStatusLabels: Record<AttendeeStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  waitlist: "Lista de espera",
};

/** Títulos desde las fuentes existentes (catálogo de eventos + entradas). */
const titlesById = new Map<string, string>([
  ...events.map((event) => [event.id, event.title] as const),
  ...tickets
    .filter((ticket) => ticket.status === "past")
    .map((ticket) => [ticket.id, ticket.title] as const),
]);

function eventNameFor(id: string): string {
  const title = titlesById.get(id);
  if (!title) {
    throw new Error(`Evento desconocido para la vista de asistentes: ${id}`);
  }
  return title;
}

const records: Omit<AttendeeRecord, "eventName">[] = [
  // Confirmados
  {
    id: "att-01",
    name: "María Fernanda Rocha",
    code: "SCESI-2841",
    eventId: "hackathon-scesi",
    registeredAt: "02 SEP 2025",
    checkedInAt: "08:42",
    status: "confirmed",
  },
  {
    id: "att-02",
    name: "Diego Alejandro Vargas",
    code: "SCESI-1907",
    eventId: "hackathon-scesi",
    registeredAt: "04 SEP 2025",
    checkedInAt: "08:51",
    status: "confirmed",
  },
  {
    id: "att-03",
    name: "Valeria Quispe Mamani",
    code: "SCESI-3320",
    eventId: "devtalks-ia-sin-humo",
    registeredAt: "28 SEP 2025",
    checkedInAt: "18:05",
    status: "confirmed",
  },
  {
    id: "att-04",
    name: "Rodrigo Peñaranda Soto",
    code: "SCESI-2074",
    eventId: "hackathon-scesi",
    registeredAt: "09 SEP 2025",
    checkedInAt: null,
    status: "confirmed",
  },
  {
    id: "att-05",
    name: "Camila Torres Ríos",
    code: "SCESI-4158",
    eventId: "taller-git-github",
    registeredAt: "15 SEP 2025",
    checkedInAt: null,
    status: "confirmed",
  },
  {
    id: "att-06",
    name: "Andrés Villarroel Céspedes",
    code: "SCESI-3662",
    eventId: "devtalks-ia-sin-humo",
    registeredAt: "01 OCT 2025",
    checkedInAt: null,
    status: "confirmed",
  },
  {
    id: "att-07",
    name: "Jhoselin Ayala Cruz",
    code: "SCESI-2295",
    eventId: "feria-internacional-del-libro",
    registeredAt: "20 SEP 2025",
    checkedInAt: null,
    status: "confirmed",
  },
  // Pendientes
  {
    id: "att-08",
    name: "Luis Fernando Ticona",
    code: "SCESI-1163",
    eventId: "hackathon-scesi",
    registeredAt: "11 SEP 2025",
    checkedInAt: null,
    status: "pending",
  },
  {
    id: "att-09",
    name: "Andrea Molina Sejas",
    code: "SCESI-1548",
    eventId: "devtalks-ia-sin-humo",
    registeredAt: "30 SEP 2025",
    checkedInAt: null,
    status: "pending",
  },
  {
    id: "att-10",
    name: "Kevin Salvador Cárdenas",
    code: "SCESI-2617",
    eventId: "taller-git-github",
    registeredAt: "18 SEP 2025",
    checkedInAt: null,
    status: "pending",
  },
  {
    id: "att-11",
    name: "Nayeli Copia Miranda",
    code: "SCESI-3089",
    eventId: "hackathon-scesi",
    registeredAt: "22 SEP 2025",
    checkedInAt: null,
    status: "pending",
  },
  // Lista de espera
  {
    id: "att-12",
    name: "Bruno Esteban Zárate",
    code: "SCESI-3471",
    eventId: "hackathon-scesi",
    registeredAt: "26 SEP 2025",
    checkedInAt: null,
    status: "waitlist",
  },
  {
    id: "att-13",
    name: "Sofía Ayelén Mendoza",
    code: "SCESI-3926",
    eventId: "devtalks-ia-sin-humo",
    registeredAt: "03 OCT 2025",
    checkedInAt: null,
    status: "waitlist",
  },
  {
    id: "att-14",
    name: "Pablo César Guzmán",
    code: "SCESI-4402",
    eventId: "hackathon-scesi",
    registeredAt: "06 OCT 2025",
    checkedInAt: null,
    status: "waitlist",
  },
];

/** Listado de asistentes: nombres de evento resueltos desde las fuentes existentes. */
export const attendees: AttendeeRecord[] = records.map((record) => ({
  ...record,
  eventName: eventNameFor(record.eventId),
}));
