import { Calendar, MapPin, Ticket } from "lucide-react";
import { nextEvent } from "@/config/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NextEventCard() {
  return (
    <section
      aria-labelledby="next-event-title"
      className="overflow-hidden rounded-xl bg-scesi-grey-normal"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            {nextEvent.confirmed && <Badge>Inscripción confirmada</Badge>}
            <span className="text-[11px] font-medium tracking-[0.18em] text-white/50 uppercase sm:order-last">
              Próximo evento
            </span>
          </div>

          <h2
            id="next-event-title"
            className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-title"
          >
            {nextEvent.title}
          </h2>

          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-scesi-grey-light-active">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {nextEvent.date} · {nextEvent.time}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{nextEvent.location}</span>
            </li>
          </ul>

          <div className="mt-6 flex justify-end">
            <Button
              href={nextEvent.ticketHref}
              variant="outline-light"
              size="sm"
            >
              <Ticket className="h-4 w-4" aria-hidden="true" />
              Ver mi entrada
            </Button>
          </div>
        </div>

        <div className="relative flex shrink-0 flex-col items-center justify-center gap-1 bg-scesi-red-normal px-8 py-6 sm:w-44">
          <span className="text-[11px] font-medium tracking-[0.18em] text-white/80 uppercase">
            Faltan
          </span>
          <span className="text-5xl leading-none font-semibold text-white">
            {nextEvent.daysLeft}
          </span>
          <span className="text-sm text-white/80">días</span>

          {/* Recortes decorativos en la unión con la tarjeta oscura */}
          <span
            aria-hidden="true"
            className="absolute -top-2 -left-2 hidden h-4 w-4 rounded-full bg-white sm:block"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -left-2 hidden h-4 w-4 rounded-full bg-white sm:block"
          />
        </div>
      </div>
    </section>
  );
}
