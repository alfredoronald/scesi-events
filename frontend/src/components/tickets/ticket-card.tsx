import Link from "next/link";
import { MapPin, Ticket } from "lucide-react";
import { ticketStatusLabels, type TicketRecord } from "@/config/tickets";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

/** Fila de entrada: bloque de fecha oscuro + datos + código y acción. */
export function TicketCard({ ticket }: { ticket: TicketRecord }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-scesi-grey-light sm:flex-row">
      {/* Bloque de fecha */}
      <div className="flex items-center justify-center gap-4 bg-scesi-grey-normal px-6 py-5 text-white sm:min-w-40 sm:flex-col sm:gap-1 sm:py-8">
        <span className="text-4xl leading-none font-semibold whitespace-nowrap">
          {ticket.dateBig}
        </span>
        <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">
          {ticket.dateSmall}
        </span>
      </div>

      {/* Datos de la entrada */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <Badge variant={ticket.status === "cancelled" ? "neutral" : "red"}>
            {ticket.paymentPending ? "Pago pendiente" : ticket.status === "past" && ticket.attended === false ? "Finalizado · sin asistencia" : ticketStatusLabels[ticket.status]}
          </Badge>
        </div>

        <h2 className="text-2xl leading-tight font-semibold text-scesi-grey-normal">
          {ticket.title}
        </h2>

        <p className="flex items-center gap-2 text-body text-scesi-grey-normal/70">
          <MapPin
            className="h-4 w-4 shrink-0 text-scesi-grey-normal"
            aria-hidden="true"
          />
          {ticket.location}
        </p>
      </div>

      {/* Código y acción */}
      <div className="flex items-center justify-between gap-6 border-t border-scesi-grey-light-active px-6 py-4 sm:border-t-0 sm:border-l sm:px-8">
        <div className="sm:text-center">
          <p className="text-[11px] font-medium tracking-[0.14em] text-scesi-grey-normal/50 uppercase">
            Código
          </p>
          <p className="text-xl font-semibold text-scesi-grey-normal">
            {ticket.code}
          </p>
        </div>

        <Link
          href={`/dashboard/entradas/${ticket.id}`}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium text-scesi-grey-normal outline-none",
            "transition-colors hover:text-scesi-red-normal",
            "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
          )}
        >
          <Ticket className="h-4 w-4" aria-hidden="true" />
          Ver entrada
        </Link>
      </div>
    </article>
  );
}
