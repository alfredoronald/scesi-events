/**
 * Carga de eventos para la landing pública.
 *
 * Lee los eventos reales de la API; las imágenes locales se usan como respaldo.
 */
import { getEvents, type PublicEvent } from "@/lib/events";
import {
  pastEvents,
  upcomingEvents,
  type LandingEvent,
} from "@/config/landing";

const MONTHS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const CATEGORY_LABELS: Record<PublicEvent["participationKind"], string> = {
  organized: "Organizado por SCESI",
  invited: "Comunidad invitada",
  staff: "Staff",
};

/** "05 – 15 SEP" | "20 DIC" — mismo formato que los datos mock. */
function formatDateRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = MONTHS[start.getUTCMonth()];
  const endMonth = MONTHS[end.getUTCMonth()];

  if (startMonth === endMonth) {
    return startDay === endDay
      ? `${startDay} ${startMonth}`
      : `${startDay} – ${endDay} ${startMonth}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Imagen local para un evento de la API: usa el cover si es relativo al
 * servidor (las semillas apuntan a /public en la raíz) y si no, intenta
 * emparejar por título con las fotos locales de config/landing.ts.
 */
function resolveImage(event: PublicEvent, fallbacks: LandingEvent[]): string {
  if (event.coverImageUrl?.startsWith("/")) return event.coverImageUrl;
  const match = fallbacks.find(
    (candidate) => normalize(candidate.title) === normalize(event.title),
  );
  return match?.image ?? fallbacks[0]?.image ?? "/landing/hero-mascot.png";
}

function fromApi(
  event: PublicEvent,
  status: LandingEvent["status"],
  fallbacks: LandingEvent[],
): LandingEvent {
  return {
    id: event.id,
    title: event.title,
    description: event.summary,
    date: formatDateRange(event.startsAt, event.endsAt),
    location: event.location,
    category: CATEGORY_LABELS[event.participationKind],
    image: resolveImage(event, fallbacks),
    status,
    href: event.registrationUrl ?? "#",
  };
}

export async function loadLandingEvents(): Promise<{
  upcoming: LandingEvent[];
  past: LandingEvent[];
}> {
  const [upcomingResult, pastResult] = await Promise.allSettled([
    getEvents("upcoming"),
    getEvents("past"),
  ]);

  const upcoming =
    upcomingResult.status === "fulfilled" && upcomingResult.value.length > 0
      ? upcomingResult.value.map((event) =>
          fromApi(event, "upcoming", upcomingEvents),
        )
       : [];

  const past =
    pastResult.status === "fulfilled" && pastResult.value.length > 0
      ? pastResult.value.map((event) => fromApi(event, "past", pastEvents))
       : [];

  return { upcoming, past };
}
