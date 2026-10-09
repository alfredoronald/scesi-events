"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import {
  attendeeStatusLabels,
  staffAttendees,
  type AttendeeStatus,
} from "@/config/staff-attendees";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { useCheckIns } from "./check-in-provider";

type Filter = "all" | AttendeeStatus;

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "confirmed", label: "Confirmados" },
  { id: "pending", label: "Pendientes" },
  { id: "waitlist", label: "Lista de espera" },
];

const statusVariants: Record<AttendeeStatus, BadgeVariant> = {
  confirmed: "green",
  pending: "neutral",
  waitlist: "blue",
};

const columns = ["Asistente", "Código", "Registro", "Ingreso", "Estado"] as const;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Vista "Asistentes": pestañas por estado, buscador y tabla de inscritos. */
export function AttendeesView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const { checkIns } = useCheckIns();

  const counts = useMemo(() => {
    const totals: Record<AttendeeStatus, number> = {
      confirmed: 0,
      pending: 0,
      waitlist: 0,
    };
    for (const attendee of staffAttendees) totals[attendee.status] += 1;
    return totals;
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return staffAttendees.filter((attendee) => {
      const matchesFilter = filter === "all" || attendee.status === filter;
      const matchesQuery =
        !term ||
        normalize(attendee.name).includes(term) ||
        normalize(attendee.code).includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div>
      {/* Cabecera */}
      <div className="max-w-2xl">
        <h1 className="text-title text-scesi-grey-normal md:text-display">
          Asistentes
        </h1>
        <p className="mt-3 text-body text-scesi-grey-normal/70">
          Consulta los inscritos, su registro y su ingreso.
        </p>
      </div>

      {/* Pestañas + buscador */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar asistentes"
        >
          {filters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={cn(
                "h-9 rounded-lg px-4 text-sm font-medium transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
                filter === id
                  ? "bg-scesi-grey-normal text-white"
                  : "border border-scesi-grey-light-active bg-white text-scesi-grey-normal/70 hover:bg-scesi-grey-light hover:text-scesi-grey-normal",
              )}
            >
              {label}
              {(id === "all" || counts[id] > 0) &&
                ` · ${id === "all" ? staffAttendees.length : counts[id]}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <label htmlFor="attendee-search" className="sr-only">
            Buscar asistente
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-normal/50"
            aria-hidden="true"
          />
          <input
            id="attendee-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar asistente..."
            className={cn(
              "h-9 w-full rounded-lg border border-scesi-grey-light-active bg-white",
              "pl-9 pr-3 text-sm text-scesi-grey-normal outline-none",
              "placeholder:text-scesi-grey-normal/50",
              "focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/30",
            )}
          />
        </div>
      </div>

      {/* Tabla */}
      {filtered.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-scesi-grey-light-active bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-scesi-grey-light text-xs font-semibold uppercase tracking-wider text-scesi-grey-normal/70">
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-scesi-grey-light-active">
              {filtered.map((attendee) => {
                const checkInTime = checkIns[attendee.id];
                return (
                  <tr
                    key={attendee.id}
                    className="transition-colors hover:bg-scesi-grey-light/60"
                  >
                    <td className="px-5 py-4 font-semibold text-scesi-grey-normal">
                      {attendee.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-scesi-grey-normal/80">
                      {attendee.code}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-scesi-grey-normal/80">
                      {attendee.registeredAt}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {checkInTime ? (
                        <span className="font-medium text-scesi-grey-normal">
                          {checkInTime}
                        </span>
                      ) : (
                        <span className="text-scesi-grey-normal/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariants[attendee.status]}>
                        {attendeeStatusLabels[attendee.status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-scesi-grey-light-active px-6 py-14 text-center">
          <SearchX
            className="h-6 w-6 text-scesi-grey-normal/40"
            aria-hidden="true"
          />
          <p className="font-medium text-scesi-grey-normal">
            No se encontraron asistentes
          </p>
          <p className="text-sm text-scesi-grey-normal/70">
            Prueba con otro término o cambia el filtro de estado.
          </p>
        </div>
      )}
    </div>
  );
}
