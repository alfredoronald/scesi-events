"use client";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { EventExplorer } from "./event-explorer";
import type { EventRecord } from "@/config/events";
import { formatDate, type ApiEvent } from "@/lib/backend-types";

export function toEventRecord(event: ApiEvent): EventRecord {
  const date = new Date(event.fechaInicio);
  const now = new Date();
  return { id: event.id, title: event.titulo, description: event.descripcion, date: formatDate(event.fechaInicio), location: event.lugar,
    organizer: event.participacionScesi === "invited" ? "Comunidad invitada" : "Organizado por SCESI", organizerKind: event.participacionScesi === "invited" ? "guest" : "scesi",
    image: event.imagenUrl ?? "", thisSemester: date.getFullYear() === now.getFullYear() && Math.floor(date.getMonth() / 6) === Math.floor(now.getMonth() / 6), recommended: true, href: `/dashboard/eventos/${event.id}` };
}
export function LiveEventExplorer() {
  const resource = useResource<ApiEvent[]>("/eventos?periodo=proximos", [], true);
  return <><ResourceStatus {...resource} /><EventExplorer events={resource.data.map(toEventRecord)} /></>;
}
