"use client";
import { TicketExplorer } from "./ticket-explorer";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import type { ApiInscription } from "@/lib/backend-types";
import type { TicketRecord } from "@/config/tickets";

export function toTicketRecord(entry: ApiInscription): TicketRecord {
  const date = new Date(entry.evento.fechaInicio);
  return { id: entry.id, eventId: entry.eventoId, code: entry.codigo, title: entry.evento.titulo, location: entry.evento.lugar,
    paymentPending: entry.estadoPago === "pendiente", attended: Boolean(entry.asistencia),
    status: entry.estadoPago === "rechazado" ? "cancelled" : new Date(entry.evento.fechaFin) < new Date() ? "past" : "upcoming",
    dateBig: date.toLocaleDateString("es-BO", { day: "2-digit", timeZone: "America/La_Paz" }), dateSmall: date.toLocaleDateString("es-BO", { month: "short", year: "numeric", timeZone: "America/La_Paz" }) };
}
export function LiveTicketExplorer() {
  const resource = useResource<ApiInscription[]>("/inscripciones/me", []);
  return <><ResourceStatus {...resource} /><TicketExplorer tickets={resource.data.map(toTicketRecord)} /></>;
}
