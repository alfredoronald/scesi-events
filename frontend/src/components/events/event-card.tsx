import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, GitBranch, MapPin } from "lucide-react";
import type { EventRecord } from "@/config/events";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

/** Card de evento: la tarjeta completa es un enlace (patrón de recommended-events). */
export function EventCard({ event }: { event: EventRecord }) {
  return (
    <Link
      href={event.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-scesi-grey-light outline-none",
        "transition-shadow hover:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scesi-red-normal",
        "sm:flex-row",
      )}
    >
      <div className="relative aspect-[16/10] w-full bg-scesi-grey-normal sm:aspect-auto sm:w-1/3">
        {event.image ? (
          <Image
            src={event.image}
            alt={`Foto del evento ${event.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-white">
            <GitBranch className="h-8 w-8" aria-hidden="true" />
            <span className="text-sm font-semibold">{event.title}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
        <div>
          <Badge variant={event.organizerKind === "guest" ? "neutral" : "red"}>
            {event.organizer}
          </Badge>
        </div>

        <h2 className="mt-6 text-2xl leading-tight font-semibold text-scesi-grey-normal sm:text-3xl">
          {event.title}
        </h2>

        <p className="mt-3 text-body text-scesi-grey-normal/70 line-clamp-2">
          {event.description}
        </p>

        <ul className="mt-7 space-y-3 text-body text-scesi-grey-normal/80">
          <li className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4 shrink-0 text-scesi-grey-normal"
              aria-hidden="true"
            />
            <span>{event.date}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin
              className="h-4 w-4 shrink-0 text-scesi-grey-normal"
              aria-hidden="true"
            />
            <span>{event.location}</span>
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between pt-8 text-body font-medium text-scesi-grey-normal">
          <span>Ver información</span>
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
