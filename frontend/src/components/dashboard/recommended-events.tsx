import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { recommendedEvents } from "@/config/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecommendedEvents() {
  return (
    <section
      aria-labelledby="recommended-title"
      className="rounded-xl border border-scesi-grey-light-active bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-scesi-grey-normal/60 uppercase">
            Descubre
          </p>
          <h2
            id="recommended-title"
            className="mt-1 text-lg font-semibold text-scesi-grey-normal sm:text-xl"
          >
            Eventos recomendados
          </h2>
        </div>
        <Button href="/dashboard/explorar" variant="outline" size="sm">
          Ver todos
        </Button>
      </div>

      <ul className="mt-4 divide-y divide-scesi-grey-light-active">
        {recommendedEvents.map((event) => (
          <li key={event.id}>
            <Link
              href={event.href}
              className="group flex items-center gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scesi-red-normal"
            >
              <Image
                src={event.image}
                alt={`Miniatura del evento ${event.title}`}
                width={112}
                height={84}
                sizes="(max-width: 640px) 40vw, 112px"
                className="h-[84px] w-28 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1">
                <Badge>{event.organizer}</Badge>
                <span className="mt-2 block truncate text-base font-semibold text-scesi-grey-normal">
                  {event.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-scesi-grey-normal/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.location}
                  </span>
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-scesi-grey-normal/40 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
