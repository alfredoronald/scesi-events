import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ticketStatusLabels, tickets } from "@/config/tickets";
import { cn } from "@/lib/cn";

type PageParams = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return tickets.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { id } = await params;
  const ticket = tickets.find((entry) => entry.id === id);
  return {
    title: ticket ? `Entrada ${ticket.code}` : "Entrada",
    description: ticket
      ? `Entrada de ${ticket.title}. Consulta tu código de acceso.`
      : "Detalle de entrada.",
  };
}

export default async function TicketDetailPage({ params }: PageParams) {
  const { id } = await params;
  const ticket = tickets.find((entry) => entry.id === id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <Link
        href="/dashboard/entradas"
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium text-scesi-grey-normal/70 outline-none",
          "transition-colors hover:text-scesi-red-normal",
          "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a mis entradas
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="flex flex-col overflow-hidden rounded-2xl bg-scesi-grey-light sm:flex-row">
          {/* Bloque de fecha */}
          <div className="flex items-center justify-center gap-4 bg-scesi-grey-normal px-6 py-6 text-white sm:min-w-40 sm:flex-col sm:gap-1 sm:py-10">
            <span className="text-4xl leading-none font-semibold whitespace-nowrap">
              {ticket.dateBig}
            </span>
            <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">
              {ticket.dateSmall}
            </span>
          </div>

          {/* Datos */}
          <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Badge
                variant={ticket.status === "cancelled" ? "neutral" : "red"}
              >
                {ticketStatusLabels[ticket.status]}
              </Badge>
              {ticket.eventId && (
                <Link
                  href="/dashboard/explorar"
                  className="text-sm font-medium text-scesi-red-normal outline-none hover:text-scesi-red-normal-hover focus-visible:ring-2 focus-visible:ring-scesi-red-normal"
                >
                  Ver evento
                </Link>
              )}
            </div>

            <h1 className="text-2xl leading-tight font-semibold text-scesi-grey-normal sm:text-3xl">
              {ticket.title}
            </h1>

            <ul className="mt-2 space-y-3 text-body text-scesi-grey-normal/80">
              <li className="flex items-center gap-2">
                <CalendarDays
                  className="h-4 w-4 shrink-0 text-scesi-grey-normal"
                  aria-hidden="true"
                />
                {ticket.dateBig} · {ticket.dateSmall}
              </li>
              <li className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 shrink-0 text-scesi-grey-normal"
                  aria-hidden="true"
                />
                {ticket.location}
              </li>
            </ul>
          </div>
        </article>

        {/* Código de acceso */}
        <aside className="rounded-2xl border border-scesi-grey-light-active bg-white p-6 text-center">
          <p className="text-[11px] font-medium tracking-[0.14em] text-scesi-grey-normal/50 uppercase">
            Código de acceso
          </p>
          <p className="mt-1 text-3xl font-semibold text-scesi-grey-normal">
            {ticket.code}
          </p>
          <div className="mt-5 flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-scesi-grey-light text-scesi-grey-normal/50">
            <Ticket className="h-8 w-8" aria-hidden="true" />
            <span className="text-xs">QR disponible en tu entrada</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
