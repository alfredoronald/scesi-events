"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import {
  defaultQuestion,
  eventQuestions,
  rateableEvents,
  sentRatings,
  type SentRating,
} from "@/config/ratings";
import { cn } from "@/lib/cn";
import { StarRating } from "./star-rating";

const cardClass =
  "rounded-xl border border-scesi-grey-light-active bg-white p-6 sm:p-8";
const fieldClass =
  "w-full rounded-lg border border-scesi-grey-light-active bg-white px-4 text-sm text-scesi-grey-normal outline-none placeholder:text-scesi-grey-normal/50 focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/30";

/**
 * Sección completa de Calificaciones: selector de evento, formulario con
 * estrellas y lista de valoraciones enviadas (la lista se actualiza al
 * enviar, demo sin backend). Client Component con estado local.
 */
export function RatingSection() {
  const [pending, setPending] = useState(rateableEvents);
  const [sent, setSent] = useState<SentRating[]>(sentRatings);
  const [selectedId, setSelectedId] = useState(rateableEvents[0]?.id ?? "");
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  const selected = pending.find((event) => event.id === selectedId);
  const question = eventQuestions[selectedId] ?? defaultQuestion;
  const canSubmit = Boolean(selected) && score > 0;

  function handleSubmit() {
    if (!selected || !canSubmit) return;

    setSent((previous) => [
      {
        id: selected.id,
        eventTitle: selected.title,
        comment: comment.trim() || "Sin comentarios.",
        score,
      },
      ...previous,
    ]);

    const remaining = pending.filter((event) => event.id !== selected.id);
    setPending(remaining);
    setSelectedId(remaining[0]?.id ?? "");
    setScore(0);
    setComment("");
  }

  return (
    <div>
      {/* Selector de evento a calificar */}
      <div className="relative mt-8">
        <label htmlFor="rating-event" className="sr-only">
          Selecciona un evento para calificar
        </label>
        <select
          id="rating-event"
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setScore(0);
          }}
          disabled={pending.length === 0}
          className={cn(fieldClass, "h-11 appearance-none pr-10")}
        >
          {pending.length === 0 ? (
            <option value="">No quedan eventos por calificar</option>
          ) : (
            pending.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))
          )}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-normal/50"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Formulario de valoración */}
        <section aria-labelledby="rating-form-title" className={cardClass}>
          <h2
            id="rating-form-title"
            className="text-xl font-semibold text-scesi-grey-normal sm:text-2xl"
          >
            {selected?.title ?? "Sin eventos pendientes"}
          </h2>
          <p className="mt-2 text-body text-scesi-grey-normal/70">
            {selected ? question : "Ya valoraste todos los eventos."}
          </p>

          <div className="mt-5">
            <StarRating value={score} onChange={setScore} />
          </div>

          <label htmlFor="rating-comment" className="sr-only">
            Tu comentario
          </label>
          <textarea
            id="rating-comment"
            rows={5}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={!selected}
            placeholder="Escribe un comentario sobre tu experiencia..."
            className={cn(fieldClass, "mt-5 resize-y p-3 leading-relaxed")}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "mt-5 h-11 w-full rounded-lg text-sm font-medium text-white outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
              "bg-scesi-red-normal hover:bg-scesi-red-normal-hover active:bg-scesi-red-normal-active",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            Enviar valoración
          </button>
        </section>

        {/* Valoraciones enviadas */}
        <section aria-labelledby="sent-ratings-title" className={cardClass}>
          <p className="text-xs font-semibold uppercase tracking-widest text-scesi-grey-normal/60">
            Mi actividad
          </p>
          <h2
            id="sent-ratings-title"
            className="mt-1 text-xl font-semibold text-scesi-grey-normal sm:text-2xl"
          >
            Valoraciones enviadas
          </h2>

          <ul className="mt-4 divide-y divide-scesi-grey-light-active">
            {sent.map((rating) => (
              <li
                key={rating.id}
                className="flex items-start justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-scesi-grey-normal">
                    {rating.eventTitle}
                  </p>
                  <p className="mt-1 text-sm text-scesi-grey-normal/70">
                    {rating.comment}
                  </p>
                </div>
                <p className="flex shrink-0 items-center gap-1 text-sm font-semibold text-scesi-red-normal">
                  {rating.score.toFixed(1)}
                  <Star
                    aria-hidden="true"
                    className="h-4 w-4 fill-scesi-red-normal text-scesi-red-normal"
                  />
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
