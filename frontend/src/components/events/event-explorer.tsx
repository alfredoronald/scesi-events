"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import type { EventRecord } from "@/config/events";
import { cn } from "@/lib/cn";
import { EventCard } from "./event-card";

type EventFilter = "all" | "semester";

const filters: Array<{ id: EventFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "semester", label: "Este semestre" },
];

/** Comparación insensible a mayúsculas y tildes. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function EventExplorer({ events }: { events: EventRecord[] }) {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return events.filter((event) => {
      const matchesFilter = filter === "all" || event.thisSemester;
      const matchesQuery =
        needle === "" || normalize(event.title).includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [events, filter, query]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Filtrar eventos"
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
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor="event-search" className="sr-only">
            Buscar eventos por nombre
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-scesi-grey-normal/40"
            aria-hidden="true"
          />
          <input
            id="event-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre"
            className={cn(
              "h-10 w-full rounded-lg border border-scesi-grey-light-active bg-white pr-3 pl-9",
              "text-sm text-scesi-grey-normal placeholder:text-scesi-grey-normal/40 outline-none",
              "focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-light/40",
            )}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-6 grid auto-rows-fr gap-6 md:grid-cols-2">
          {filtered.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-scesi-grey-light-active px-6 py-14 text-center">
          <SearchX
            className="h-6 w-6 text-scesi-grey-normal/40"
            aria-hidden="true"
          />
          <p className="font-medium text-scesi-grey-normal">
            No encontramos eventos
          </p>
          <p className="text-sm text-scesi-grey-normal/70">
            Prueba con otro nombre o cambia el filtro.
          </p>
        </div>
      )}
    </div>
  );
}
