"use client";

import { useMemo, useState } from "react";
import { Check, Clock, MapPin, Search, SearchX, Users } from "lucide-react";
import {
  type AttendeeRecord,
  type AttendeeStatus,
} from "@/config/attendees";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { useAttendance } from "./use-attendance";
import { ResourceStatus } from "@/components/auth/use-resource";
import { formatDate } from "@/lib/backend-types";
import { PaymentControl } from "./payment-control";

type Filter = "all" | AttendeeStatus;

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "confirmed", label: "Confirmados" },
  { id: "pending", label: "Pendientes" },
  { id: "waitlist", label: "Lista de espera" },
];

const columns = ["Asistente", "Código", "Registro", "Ingreso", "Estado"] as const;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Estado visible en la tabla: combina la inscripción con el ingreso/salida.
 * Presente = ingresó y no salió; Retirado = registró salida.
 */
function presentationOf(
  attendee: AttendeeRecord,
  checkedInAt: string | null | undefined,
  checkedOutAt: string | null | undefined,
): { label: string; variant: BadgeVariant } {
  if (checkedOutAt) return { label: "Retirado", variant: "blue" };
  if (checkedInAt) return { label: "Presente", variant: "green" };
  if (attendee.status === "confirmed") {
    return { label: "Confirmado", variant: "green" };
  }
  if (attendee.status === "pending") {
    return { label: "Pendiente", variant: "neutral" };
  }
  return { label: "Lista de espera", variant: "blue" };
}

/** Vista "Asistentes": tarjetas de resumen, pestañas, buscador y tabla. */
export function AttendeesView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const { events, eventId, setEventId, resource, roster, checkIns, checkOuts } = useAttendance();
  const selectedEvent = events.data.find((event) => event.id === eventId);
  const attendees: AttendeeRecord[] = roster.map((row) => ({ id: row.id, name: row.nombreCompleto, email: row.email, code: row.codigo, eventId, eventName: selectedEvent?.titulo ?? "", registeredAt: formatDate(row.createdAt), checkedInAt: row.checkedInAt, checkedOutAt: row.checkedOutAt, status: row.estadoPago === "no_aplica" || row.estadoPago === "confirmado" ? "confirmed" : "pending" }));

  const summary = useMemo(() => {
    const total = attendees.length;
    const confirmed = attendees.filter((a) => a.status === "confirmed").length;
    const waitlist = attendees.filter((a) => a.status === "waitlist").length;
    const outs = attendees.filter((a) => checkOuts[a.id]).length;
    // "En el evento": confirmados que aún no registran salida.
    const inEvent = attendees.filter(
      (a) => Boolean(checkIns[a.id]) && !checkOuts[a.id],
    ).length;

    return {
      total,
      confirmed,
      waitlist,
      outs,
      inEvent,
      rate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
      capacity: selectedEvent?.cupoMaximo ?? "sin límite",
    };
  }, [attendees, checkIns, checkOuts, selectedEvent]);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return attendees.filter((attendee) => {
      const matchesFilter = filter === "all" || attendee.status === filter;
      const matchesQuery =
        !term ||
        normalize(attendee.name).includes(term) ||
        normalize(attendee.email).includes(term) ||
        normalize(attendee.code).includes(term);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, attendees]);

  const cards = [
    {
      label: "Registrados",
      value: summary.total,
      note: `de ${summary.capacity} cupos`,
      icon: Users,
    },
    {
      label: "Confirmados",
      value: summary.confirmed,
      note: `${summary.rate}% de asistencia`,
      icon: Check,
      accent: true,
    },
    {
      label: "En el evento",
      value: summary.inEvent,
      note: `${summary.outs} salidas registradas`,
      icon: MapPin,
    },
    {
      label: "Lista de espera",
      value: summary.waitlist,
      note: "Próximos en ingresar",
      icon: Clock,
    },
  ];

  return (
    <div>
      <ResourceStatus {...events} /><ResourceStatus {...resource} />
      <label htmlFor="organizer-attendees-event" className="sr-only">Evento</label>
      <select id="organizer-attendees-event" value={eventId} onChange={(event) => setEventId(event.target.value)} className="mb-5 w-full rounded-lg border p-3">{events.data.map((event) => <option key={event.id} value={event.id}>{event.titulo}</option>)}</select>
      {/* Cabecera */}
      <div className="max-w-2xl">
        <h1 className="text-title text-scesi-grey-normal md:text-display">
          Asistentes
        </h1>
        <p className="mt-3 text-body text-scesi-grey-normal/70">
          Consulta registros, confirma ingresos y exporta la lista del evento.
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-xl border border-scesi-grey-light-active bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-scesi-grey-normal/70">{label}</p>
              <Icon
                className="h-5 w-5 shrink-0 text-scesi-red-normal"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 text-3xl font-bold text-scesi-grey-normal">
              {value}
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                accent
                  ? "font-medium text-scesi-green-normal"
                  : "text-scesi-grey-normal/60",
              )}
            >
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* Pestañas + buscador */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                "h-10 rounded-lg px-4 text-sm font-medium transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
                filter === id
                  ? "bg-scesi-grey-normal text-white"
                  : "text-scesi-grey-normal/60 hover:bg-scesi-grey-light hover:text-scesi-grey-normal",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
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
            placeholder="Nombre, correo o código…"
            className={cn(
              "h-10 w-full rounded-lg border border-scesi-grey-light-active bg-white",
              "pl-9 pr-3 text-sm text-scesi-grey-normal outline-none",
              "placeholder:text-scesi-grey-normal/50",
              "focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/30",
            )}
          />
        </div>
      </div>

      {/* Tabla */}
      {filtered.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-scesi-grey-light-active bg-white p-3">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-scesi-grey-light text-xs font-semibold uppercase tracking-wider text-scesi-grey-normal/60">
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-scesi-grey-light-active">
              {filtered.map((attendee) => {
                const checkInTime = checkIns[attendee.id];
                const presentation = presentationOf(
                  attendee,
                  checkInTime,
                  checkOuts[attendee.id],
                );
                return (
                  <tr
                    key={attendee.id}
                    className="transition-colors hover:bg-scesi-grey-light/60"
                  >
                    <td className="px-4 py-4 font-semibold text-scesi-grey-normal">
                      {attendee.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-scesi-grey-normal/80">
                      {attendee.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-scesi-grey-normal/80">
                      {attendee.registeredAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {checkInTime ? (
                        <span className="font-medium text-scesi-grey-normal">
                          {checkInTime}
                        </span>
                      ) : (
                        <span className="text-scesi-grey-normal/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={presentation.variant}
                        className="rounded-md px-2 py-0.5 text-xs font-medium normal-case tracking-normal"
                      >
                        {presentation.label}
                      </Badge>
                      {attendee.status === "pending" && <PaymentControl id={attendee.id} hasReceipt={Boolean(roster.find((row) => row.id === attendee.id)?.comprobanteUrl)} onSaved={resource.reload} />}
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
