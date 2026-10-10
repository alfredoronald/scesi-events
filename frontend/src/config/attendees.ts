import { events } from "./events";
import { tickets } from "./tickets";
import { organizerEvents } from "./organizer-events";

export type AttendeeStatus = "confirmed" | "pending" | "waitlist";

/** Títulos de los estados de inscripción. */
export const attendeeStatusLabels: Record<AttendeeStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  waitlist: "Lista de espera",
};

export type AttendeeRecord = {
  id: string;
  name: string;
  email: string;
  /** Código de acceso, p. ej. "SC-0284". */
  code: string;
  eventId: string;
  /** Título del evento resuelto desde las fuentes existentes. */
  eventName: string;
  /** Registro con fecha y hora, p. ej. "12 SEP · 14:32". */
  registeredAt: string;
  /** Hora de ingreso sembrada por el mock; null = aún no ingresa. */
  checkedInAt: string | null;
  /** Hora de salida sembrada por el mock; null = sigue en el evento. */
  checkedOutAt: string | null;
  status: AttendeeStatus;
};

/** Evento cuyo listado muestra esta vista (mismo id que en Mis eventos). */
const EVENT_ID = "hackathon-scesi";

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

/** Cupos del evento, tomados de la config de Mis eventos (SSOT). */
export function attendeesCapacity(): number {
  const event = organizerEvents.find((item) => item.id === EVENT_ID);
  if (!event) {
    throw new Error(`Evento sin cupos para la vista de asistentes: ${EVENT_ID}`);
  }
  return event.capacity;
}

/* -------------------------------------------------------------------------
 * Dataset demo determinista (248 inscritos al Hackathon SCESI).
 * ---------------------------------------------------------------------- */

const FIRST_NAMES = [
  "Andrea", "Diego", "María", "Luis", "Valentina", "Jorge", "Camila", "Rodrigo",
  "Fernanda", "Óscar", "Gabriela", "Miguel", "Daniela", "Iván", "Paula", "Héctor",
];

const LAST_NAMES_A = [
  "Mendoza", "Salazar", "Rojas", "Torrico", "Vargas", "Quispe", "Peñaranda",
  "Flores", "Mamani", "Céspedes", "Aguilar", "Ríos", "Sejas", "Villarroel",
  "Copacati", "Terceros",
];

const LAST_NAMES_B = [
  "López", "Fernández", "Guzmán", "Ayala", "Cruz", "Soto", "Molina", "Cárdenas",
  "Zárate", "Miranda", "Mendoza", "Peredo", "Gutiérrez", "Rojas", "Suarez", "Poma",
];

/** PRNG determinista: el dataset es idéntico en cada build. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Filas exactas del mock, siempre visibles al inicio de la lista. */
const mockHead: Omit<AttendeeRecord, "eventName">[] = [
  {
    id: "att-001",
    name: "Andrea Mendoza",
    email: "andrea.mendoza@scesi.bo",
    code: "SC-0284",
    eventId: EVENT_ID,
    registeredAt: "12 SEP · 14:32",
    checkedInAt: "09:42",
    checkedOutAt: null,
    status: "confirmed",
  },
  {
    id: "att-002",
    name: "Diego Salazar",
    email: "diego.salazar@scesi.bo",
    code: "SC-0192",
    eventId: EVENT_ID,
    registeredAt: "11 SEP · 09:15",
    checkedInAt: "09:31",
    checkedOutAt: null,
    status: "confirmed",
  },
  {
    id: "att-003",
    name: "María Rojas",
    email: "maria.rojas@scesi.bo",
    code: "SC-0311",
    eventId: EVENT_ID,
    registeredAt: "14 SEP · 18:08",
    checkedInAt: null,
    checkedOutAt: null,
    status: "confirmed",
  },
  {
    id: "att-004",
    name: "Luis Torrico",
    email: "luis.torrico@scesi.bo",
    code: "SC-0174",
    eventId: EVENT_ID,
    registeredAt: "10 SEP · 11:40",
    checkedInAt: null,
    checkedOutAt: null,
    status: "pending",
  },
];

/** Reparto objetivo: 196 confirmados, 34 pendientes, 18 en lista de espera. */
const TARGETS = { confirmed: 196, pending: 34, waitlist: 18 };

function buildDataset(): Omit<AttendeeRecord, "eventName">[] {
  const rand = mulberry32(20250928);

  // Pool de estados restante (4 filas del mock ya cubren parte de cada total).
  const pool: AttendeeStatus[] = [
    ...Array<AttendeeStatus>(TARGETS.confirmed - 3).fill("confirmed"),
    ...Array<AttendeeStatus>(TARGETS.pending - 1).fill("pending"),
    ...Array<AttendeeStatus>(TARGETS.waitlist).fill("waitlist"),
  ];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const rest: Omit<AttendeeRecord, "eventName">[] = pool.map((status, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastA = LAST_NAMES_A[Math.floor(index / 16) % LAST_NAMES_A.length];
    const lastB = LAST_NAMES_B[Math.floor(index / 256) % LAST_NAMES_B.length];
    const day = 1 + (index % 29);
    const hour = String(8 + (index % 10)).padStart(2, "0");
    const minute = String((index * 7) % 60).padStart(2, "0");

    return {
      id: `att-${String(index + 5).padStart(3, "0")}`,
      name: `${first} ${lastA} ${lastB}`,
      email: `${slug(first)}.${slug(lastA)}.${slug(lastB)}@scesi.bo`,
      code: `SC-${String(400 + index).padStart(4, "0")}`,
      eventId: EVENT_ID,
      registeredAt: `${day} SEP · ${hour}:${minute}`,
      checkedInAt: null,
      checkedOutAt: null,
      status,
    };
  });

  // Ingresos: todos los confirmados salvo María Rojas (mock: ingreso "—").
  for (const attendee of rest) {
    if (attendee.status !== "confirmed") continue;
    const hour = String(8 + Math.floor(rand() * 3)).padStart(2, "0");
    const minute = String(Math.floor(rand() * 60)).padStart(2, "0");
    attendee.checkedInAt = `${hour}:${minute}`;
  }

  // Salidas: exactamente 12 confirmados (mock: "12 salidas registradas").
  const confirmed = rest.filter((attendee) => attendee.status === "confirmed");
  let outs = 0;
  for (const attendee of confirmed) {
    if (outs >= 12) break;
    if (rand() > 0.6) continue;
    const hour = String(16 + (Math.floor(rand() * 3))).padStart(2, "0");
    const minute = String(Math.floor(rand() * 60)).padStart(2, "0");
    attendee.checkedOutAt = `${hour}:${minute}`;
    outs += 1;
  }
  // Por si el azar asignó menos de 12: se completan en orden.
  for (const attendee of confirmed) {
    if (outs >= 12) break;
    if (attendee.checkedOutAt) continue;
    attendee.checkedOutAt = "17:30";
    outs += 1;
  }

  return [...mockHead, ...rest];
}

const records = buildDataset();

if (records.length !== organizerEvents.find((item) => item.id === EVENT_ID)?.enrolled) {
  throw new Error(
    "La lista de asistentes no coincide con los inscritos de Mis eventos (SSOT roto)",
  );
}

/** Inscritos del evento con su nombre resuelto desde las fuentes existentes. */
export const attendees: AttendeeRecord[] = records.map((record) => ({
  ...record,
  eventName: eventNameFor(record.eventId),
}));
