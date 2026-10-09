"use client";

import { useMemo, useState } from "react";
import { TicketX } from "lucide-react";
import type { TicketRecord, TicketStatus } from "@/config/tickets";
import { cn } from "@/lib/cn";
import { TicketCard } from "./ticket-card";

const filters: Array<{ id: TicketStatus; label: string }> = [
  { id: "upcoming", label: "Próximas" },
  { id: "past", label: "Pasadas" },
  { id: "cancelled", label: "Canceladas" },
];

const emptyMessages: Record<
  TicketStatus,
  { title: string; body: string }
> = {
  upcoming: {
    title: "No tienes entradas próximas",
    body: "Inscríbete a un evento desde Explorar eventos.",
  },
  past: {
    title: "Aún no tienes entradas pasadas",
    body: "Tus asistencias a eventos anteriores aparecerán aquí.",
  },
  cancelled: {
    title: "No tienes entradas canceladas",
    body: "Cuando canceles una inscripción aparecerá aquí.",
  },
};

export function TicketExplorer({ tickets }: { tickets: TicketRecord[] }) {
  const [filter, setFilter] = useState<TicketStatus>("upcoming");

  const counts = useMemo(() => {
    const totals: Record<TicketStatus, number> = {
      upcoming: 0,
      past: 0,
      cancelled: 0,
    };
    for (const ticket of tickets) {
      totals[ticket.status] += 1;
    }
    return totals;
  }, [tickets]);

  const filtered = useMemo(
    () => tickets.filter((ticket) => ticket.status === filter),
    [tickets, filter],
  );

  return (
    <div>
      <div
        className="mt-8 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar entradas"
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
            {counts[id] > 0 && ` · ${counts[id]}`}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {filtered.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-scesi-grey-light-active px-6 py-14 text-center">
          <TicketX
            className="h-6 w-6 text-scesi-grey-normal/40"
            aria-hidden="true"
          />
          <p className="font-medium text-scesi-grey-normal">
            {emptyMessages[filter].title}
          </p>
          <p className="text-sm text-scesi-grey-normal/70">
            {emptyMessages[filter].body}
          </p>
        </div>
      )}
    </div>
  );
}
