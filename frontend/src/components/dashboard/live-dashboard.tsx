"use client";
import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { NextEventCard } from "./next-event-card";
import { RecommendedEvents } from "./recommended-events";
import { ActivityStats } from "./activity-stats";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { toEventRecord } from "@/components/events/live-event-explorer";
import { formatDate, type ApiEvent, type ApiInscription } from "@/lib/backend-types";

export function LiveDashboard() {
  const [now] = useState(() => Date.now());
  const inscriptions = useResource<ApiInscription[]>("/inscripciones/me", []);
  const events = useResource<ApiEvent[]>("/eventos?periodo=proximos", [], true);
  const next = inscriptions.data.filter((row) => row.estadoPago !== "rechazado" && new Date(row.evento.fechaFin).getTime() >= now).sort((a, b) => a.evento.fechaInicio.localeCompare(b.evento.fechaInicio))[0];
  const year = new Date(now).getFullYear();
  const activity = inscriptions.data.filter((row) => new Date(row.evento.fechaInicio).getFullYear() === year);
  return <><DashboardHeader /><ResourceStatus {...inscriptions} /><ResourceStatus {...events} /><div className="mt-8">{next ? <NextEventCard nextEvent={{ confirmed: next.estadoPago === "confirmado" || next.estadoPago === "no_aplica", title: next.evento.titulo, date: formatDate(next.evento.fechaInicio), time: new Date(next.evento.fechaInicio).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" }), location: next.evento.lugar, ticketHref: `/dashboard/entradas/${next.id}`, daysLeft: Math.max(0, Math.ceil((new Date(next.evento.fechaInicio).getTime() - now) / 86400000)) }} /> : <p className="rounded-xl border p-6 text-sm text-gray-500">No tienes próximas inscripciones.</p>}</div><div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><RecommendedEvents recommendedEvents={events.data.slice(0, 3).map(toEventRecord)} /><ActivityStats registered={activity.length} attended={activity.filter((row) => row.asistencia).length} certificates={activity.filter((row) => row.certificadoId).length} /></div></>;
}
