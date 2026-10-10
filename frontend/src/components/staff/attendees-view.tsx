"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { getAttendanceState, type AttendanceState } from "@/config/staff-attendees";
import { useAttendance } from "@/components/attendees/use-attendance";
import { ResourceStatus } from "@/components/auth/use-resource";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Filter = "all" | AttendanceState;
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "inside", label: "Dentro" },
  { id: "exited", label: "Salieron" },
  { id: "not-entered", label: "Sin ingreso" },
];
const statusLabels: Record<AttendanceState, string> = { inside: "Dentro", exited: "Salió", "not-entered": "Pendiente" };
function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function StaffAttendeesView() {
  const { events, eventId, setEventId, resource, roster: rows, checkIns, checkOuts, lastRecords } = useAttendance();
  const accessEvents = events.data.map((event) => ({ id: event.id, title: event.titulo }));
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const roster = rows.map((row) => ({ id: row.id, name: row.nombreCompleto, code: row.codigo }));
  const counts: Record<Filter, number> = { all: roster.length, inside: 0, exited: 0, "not-entered": 0 };
  for (const attendee of roster) counts[getAttendanceState(checkIns[attendee.id], checkOuts[attendee.id])] += 1;
  const term = normalize(query.trim());
  const filtered = roster.filter((attendee) =>
    (filter === "all" || getAttendanceState(checkIns[attendee.id], checkOuts[attendee.id]) === filter) &&
    normalize(`${attendee.name} ${attendee.code}`).includes(term),
  );
  const pageCount = Math.ceil(filtered.length / 4);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = filtered.slice(currentPage * 4, currentPage * 4 + 4);

  return (
    <div>
      <ResourceStatus {...events} /><ResourceStatus {...resource} />
      <h1 className="text-title text-scesi-grey-normal md:text-display">Asistentes</h1>
      <p className="mt-2 text-body text-scesi-grey-normal/65">Busca participantes y revisa su estado de ingreso.</p>
      <label htmlFor="staff-attendees-event" className="sr-only">Evento de los asistentes</label>
      <select id="staff-attendees-event" value={eventId} onChange={(event) => { setEventId(event.target.value); setFilter("all"); setQuery(""); setPage(0); }} className="mt-2 h-11 w-full rounded-lg border border-scesi-grey-light-active/50 bg-white px-3 text-base text-scesi-grey-normal outline-none focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20">
        {accessEvents.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
      </select>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar por estado de ingreso" className="flex flex-wrap gap-1">
          {filters.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => { setFilter(id); setPage(0); }} className={cn("rounded-lg px-4 py-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal", filter === id ? "bg-scesi-grey-normal text-white" : "text-scesi-grey-normal/60 hover:bg-scesi-grey-light")}>
              {label} · {counts[id]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <label htmlFor="staff-attendee-search" className="sr-only">Buscar asistente o código</label>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-normal/60" />
          <input id="staff-attendee-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Buscar asistente o código..." className="h-10 w-full rounded-lg border border-scesi-grey-light-active/50 bg-white pl-9 pr-3 text-xs text-scesi-grey-normal outline-none placeholder:text-scesi-grey-normal/50 focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20" />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-scesi-grey-light-active/50 bg-white p-4 sm:p-6">
        <table className="w-full min-w-[740px] text-left text-sm">
          <caption className="sr-only">Estado de asistencia del evento seleccionado</caption>
          <thead className="bg-scesi-grey-light/50 text-[10px] font-medium uppercase tracking-widest text-scesi-grey-normal/50">
            <tr>{["Asistente", "Código", "Hora entrada", "Último registro", "Estado"].map((column) => <th key={column} scope="col" className="px-4 py-3">{column}</th>)}</tr>
          </thead>
          <tbody>
            {visible.map((attendee) => {
              const status = getAttendanceState(checkIns[attendee.id], checkOuts[attendee.id]);
              return (
                <tr key={attendee.id} className="border-b border-scesi-grey-light text-scesi-grey-normal/65">
                  <th scope="row" className="px-4 py-5 font-semibold text-scesi-grey-normal">{attendee.name}</th>
                  <td className="whitespace-nowrap px-4 py-5">{attendee.code}</td>
                  <td className="px-4 py-5">{checkIns[attendee.id] || "—"}</td>
                  <td className="px-4 py-5">{lastRecords[attendee.id] || "Sin actividad"}</td>
                  <td className="px-4 py-5"><Badge variant="green" className="rounded-md px-2 py-1.5 font-normal normal-case tracking-normal">{statusLabels[status]}</Badge></td>
                </tr>
              );
            })}
            {!visible.length && <tr><td colSpan={5} className="px-4 py-12 text-center text-scesi-grey-normal/65">No se encontraron asistentes. Prueba otra búsqueda o cambia el filtro.</td></tr>}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && <nav aria-label="Páginas de asistentes" className="mt-4 flex flex-wrap items-center justify-end gap-4 text-xs text-scesi-grey-normal/65">
        <span role="status">{currentPage * 4 + 1}–{Math.min(currentPage * 4 + 4, filtered.length)} de {filtered.length}</span>
        <button type="button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} className="rounded-lg px-2 py-2 focus-visible:outline-2 focus-visible:outline-scesi-red-normal disabled:opacity-40">Anterior</button>
        <button type="button" disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-lg px-2 py-2 focus-visible:outline-2 focus-visible:outline-scesi-red-normal disabled:opacity-40">Siguiente</button>
      </nav>}
    </div>
  );
}
