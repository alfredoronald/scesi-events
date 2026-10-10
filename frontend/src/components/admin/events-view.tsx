"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { adminEventStatusLabels, normalizeEventSearch, type AdminEvent } from "@/config/admin-events";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { formatDate, type ApiEvent } from "@/lib/backend-types";
import { EventStatusControl } from "@/components/events/event-status-control";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Filter = "all" | "active" | "draft" | "finished";
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" }, { id: "active", label: "Activos" },
  { id: "draft", label: "Borradores" }, { id: "finished", label: "Finalizados" },
];
function matchesFilter(event: AdminEvent, filter: Filter) {
  return filter === "all" || (filter === "active" ? event.status === "published" || event.status === "ongoing" : event.status === filter);
}

export function AdminEventsView() {
  const resource = useResource<ApiEvent[]>("/eventos", [], true);
  const statuses = { publicado: "published", en_curso: "ongoing", borrador: "draft", cerrado: "finished" } as const;
  const adminEvents: AdminEvent[] = resource.data.map((event) => ({ id: event.id, title: event.titulo, responsible: event.organizador.nombreCompleto, date: formatDate(event.fechaInicio), type: event.participacionScesi === "invited" ? "Invitados" : event.participacionScesi === "staff" ? "Staff" : "Organizado", status: statuses[event.estado] }));
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const term = normalizeEventSearch(query.trim());
  const filtered = adminEvents.filter((event) => matchesFilter(event, filter) &&
    normalizeEventSearch(`${event.title} ${event.responsible} ${event.type} ${adminEventStatusLabels[event.status]}`).includes(term));
  const pageCount = Math.ceil(filtered.length / 4);
  const visible = filtered.slice(page * 4, page * 4 + 4);

  return (
    <div>
      <ResourceStatus {...resource} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-scesi-red-normal">Supervisión</p>
          <h1 className="mt-3 text-title text-scesi-grey-normal md:text-display">Todos los eventos</h1>
          <p className="mt-2 text-body text-scesi-grey-normal/65">Administra eventos propios, colaboraciones e invitaciones.</p>
        </div>
        <Button href="/admin/eventos/nuevo" className="self-start rounded-lg sm:shrink-0"><Plus aria-hidden="true" className="h-4 w-4" />Crear evento</Button>
      </div>
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-scesi-grey-light-active/50 bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filtrar eventos" className="flex flex-wrap gap-1">
          {filters.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => { setFilter(id); setPage(0); }} className={cn("rounded-lg px-4 py-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal", filter === id ? "bg-scesi-grey-normal text-white" : "text-scesi-grey-normal/60 hover:bg-scesi-grey-light")}>
              {label} · {adminEvents.filter((event) => matchesFilter(event, id)).length}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-64">
          <label htmlFor="admin-event-search" className="sr-only">Buscar evento</label>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-normal" />
          <input id="admin-event-search" type="search" placeholder="Buscar evento..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} className="h-10 w-full rounded-lg border border-scesi-grey-light-active/50 bg-white pl-9 pr-3 text-sm text-scesi-grey-normal outline-none placeholder:text-scesi-grey-normal/50 focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20" />
        </div>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-scesi-grey-light-active/50 bg-white p-4 sm:p-6">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Eventos de la plataforma</caption>
          <thead className="bg-scesi-grey-light/50 text-[10px] font-medium uppercase tracking-widest text-scesi-grey-normal/50"><tr>{["Evento", "Responsable", "Fecha", "Tipo", "Estado"].map((column) => <th scope="col" key={column} className="px-4 py-3">{column}</th>)}</tr></thead>
          <tbody>
            {visible.map((event) => (
              <tr key={event.id} className="border-b border-scesi-grey-light text-scesi-grey-normal/65">
                <td className="px-4 py-5 font-semibold text-scesi-grey-normal">{event.title}</td>
                <td className="px-4 py-5">{event.responsible}</td>
                <td className="whitespace-nowrap px-4 py-5">{event.date}</td>
                <td className="px-4 py-5">{event.type}</td>
                <td className="px-4 py-5"><Badge variant={event.status === "finished" ? "neutral" : "green"} className="rounded-md px-2 py-1.5 font-normal normal-case tracking-normal">{adminEventStatusLabels[event.status]}</Badge><EventStatusControl event={resource.data.find((row) => row.id === event.id)!} onSaved={resource.reload} /></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-scesi-grey-normal/65">No se encontraron eventos. Prueba otra búsqueda o cambia el filtro.</td></tr>}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && <nav aria-label="Páginas de eventos" className="mt-4 flex flex-wrap items-center justify-end gap-4 text-xs text-scesi-grey-normal/65">
        <span role="status">{page * 4 + 1}–{Math.min(page * 4 + 4, filtered.length)} de {filtered.length}</span>
        <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-lg px-2 py-2 focus-visible:outline-2 focus-visible:outline-scesi-red-normal disabled:opacity-40">Anterior</button>
        <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)} className="rounded-lg px-2 py-2 focus-visible:outline-2 focus-visible:outline-scesi-red-normal disabled:opacity-40">Siguiente</button>
      </nav>}
    </div>
  );
}
