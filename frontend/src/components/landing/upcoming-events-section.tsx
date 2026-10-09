/**
 * Sección "Próximos eventos" de la landing page.
 *
 * Layout fiel al mockup:
 *  - Card grande destacada (primer evento) a la derecha con overlay oscuro
 *  - Dos cards pequeñas debajo (título + descripción + botón)
 */
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import type { LandingEvent } from "@/config/landing";

type Props = {
  events: LandingEvent[];
};

function FeaturedCard({ event }: { event: LandingEvent }) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-[16/9] md:aspect-auto md:h-full min-h-[280px]">
      {/*
       * Imagen de fondo del evento destacado.
       * Referencia: /public/events/<event.image>
       * La imagen debe ser horizontal, mín. 800×500 px.
       */}
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Badge categoría */}
      <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
        {event.category}
      </span>

      {/* Contenido inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
        <p className="text-sm text-white/80 line-clamp-2 mb-3">
          {event.description}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-white/70 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
        </div>
        <a
          href={event.href}
          className="inline-flex items-center gap-2 rounded-lg bg-scesi-red-normal px-4 py-2 text-xs font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
        >
          Ver evento <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function SmallCard({ event }: { event: LandingEvent }) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="relative h-40 bg-gray-100 flex-shrink-0">
        {/*
         * Imagen de la card pequeña.
         * Referencia: /public/events/<event.image>
         */}
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <span className="absolute top-2 left-2 rounded-full bg-scesi-red-normal px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {event.category}
        </span>
      </div>

      {/* Texto */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 flex-1">
          {event.description}
        </p>
        <a
          href={event.href}
          className="mt-3 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-scesi-red-normal hover:underline"
        >
          Ver más <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function UpcomingEventsSection({ events }: Props) {
  const [featured, ...rest] = events;

  return (
    <section id="proximos-eventos" className="bg-white py-12 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Próximos eventos</h2>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-scesi-red-normal hover:underline font-medium"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid: featured grande + columna de pequeñas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featured && (
            <div className="md:row-span-2">
              <FeaturedCard event={featured} />
            </div>
          )}
          {rest.map((ev) => (
            <SmallCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>
    </section>
  );
}
