import { tickets } from "./tickets";

export type RateableEvent = {
  id: string;
  title: string;
};

export type SentRating = {
  /** id del evento (cada evento se valora una sola vez). */
  id: string;
  eventTitle: string;
  comment: string;
  /** Puntuación 0–5 con un decimal (4.5). */
  score: number;
};

/** Eventos ya valorados (se excluyen del selector). */
const alreadyRated = new Set([
  "game-jam-scesi",
  "techzone-2024",
  "linux-week",
]);

/**
 * Opciones del selector: entradas pasadas aún sin valorar.
 * Se deriva de config/tickets.ts (misma fuente que la vista Mis entradas).
 */
export const rateableEvents: RateableEvent[] = tickets
  .filter((ticket) => ticket.status === "past" && !alreadyRated.has(ticket.id))
  .map(({ id, title }) => ({ id, title }));

/** Pregunta específica por evento; las demás usan la genérica. */
export const eventQuestions: Record<string, string> = {
  "programming-day-2025": `¿Cómo estuvo la charla "Clean Code en acción"?`,
};

export const defaultQuestion = "¿Cómo estuvo tu experiencia?";

/** Valoraciones ya enviadas (mock inicial de la lista). */
export const sentRatings: SentRating[] = [
  {
    id: "game-jam-scesi",
    eventTitle: "Game Jam SCESI",
    comment: "Una experiencia increíble, aprendí muchísimo.",
    score: 5.0,
  },
  {
    id: "techzone-2024",
    eventTitle: "TechZone 2024",
    comment: "Muy buenas charlas y excelente ambiente.",
    score: 4.0,
  },
  {
    id: "linux-week",
    eventTitle: "Linux Week",
    comment: "Contenido práctico y buenos expositores.",
    score: 4.5,
  },
];
