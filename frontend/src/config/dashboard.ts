import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, Ticket } from "lucide-react";
import { events, type EventRecord } from "./events";

export type Participant = {
  name: string;
  initials: string;
  role: string;
};

export type NextEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  daysLeft: number;
  confirmed: boolean;
  ticketHref: string;
};

export type ActivityStat = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
};

/**
 * Mock tipado del panel del participante.
 * Cuando exista la API se sustituye por un fetch en el Server Component,
 * manteniendo los mismos tipos.
 */
export const participant: Participant = {
  name: "Andrea Mendoza",
  initials: "AM",
  role: "Participante",
};

export const nextEvent: NextEvent = {
  title: "Hackathon SCESI",
  date: "28 SEP",
  time: "08:00",
  location: "FCyT — UMSS",
  daysLeft: 11,
  confirmed: true,
  ticketHref: "/dashboard/entradas",
};

/** Derivado del catálogo único (fuente de verdad en config/events.ts). */
export const recommendedEvents: EventRecord[] = events.filter(
  (event) => event.recommended,
);

export const activityStats: ActivityStat[] = [
  { id: "attended", label: "Eventos asistidos", value: "08", icon: Calendar },
  { id: "hours", label: "Horas de comunidad", value: "42h", icon: Clock },
  { id: "tickets", label: "Próximas entradas", value: "03", icon: Ticket },
];
