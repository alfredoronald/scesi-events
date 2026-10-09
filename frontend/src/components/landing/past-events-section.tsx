/**
 * Sección "Eventos pasados" de la landing page.
 * Layout: lista de filas tipo tabla (badge estado + título + fecha + flecha).
 */
import { ArrowRight, MapPin } from "lucide-react";
import type { LandingEvent } from "@/config/landing";

type Props = {
  events: LandingEvent[];
};

export function PastEventsSection({ events }: Props) {
  return (
    <section className="bg-gray-50 py-12 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Eventos pasados</h2>

        <div className="flex flex-col gap-2">
          {events.map((ev) => (
            <a
              key={ev.id}
              href={ev.href}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-sm hover:border-scesi-red-normal transition-all group"
            >
              {/* Badge */}
              <span className="shrink-0 rounded-full bg-scesi-red-light px-3 py-0.5 text-xs font-semibold text-scesi-red-normal">
                {ev.category}
              </span>

              {/* Título */}
              <p className="flex-1 truncate text-sm font-semibold text-gray-900">
                {ev.title}
              </p>

              {/* Ubicación — oculto en móvil */}
              <span className="hidden sm:flex items-center gap-1 shrink-0 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                {ev.location}
              </span>

              {/* Fecha */}
              <span className="shrink-0 text-xs text-gray-400 hidden sm:block">
                {ev.date}
              </span>

              {/* Flecha */}
              <ArrowRight className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-scesi-red-normal transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
