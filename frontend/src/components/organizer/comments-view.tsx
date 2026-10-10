"use client";
import { Star } from "lucide-react";
import { useAttendance } from "@/components/attendees/use-attendance";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { formatDate } from "@/lib/backend-types";
import { CommentCard } from "./comment-card";

export function CommentsView() {
  const { events, eventId, setEventId } = useAttendance();
  const resource = useResource<{ total: number; promedioGeneral: number; distribucion: { score: number; count: number }[]; comentarios: { id: string; autor: string; score: number; comentario: string; fecha: string; respuesta: string | null }[] } | null>(eventId ? `/eventos/${eventId}/calificaciones/resumen` : null, null);
  const totalRatings = resource.data?.total ?? 0;
  const averageRating = resource.data?.promedioGeneral ?? 0;
  const ratingDistribution = resource.data?.distribucion ?? [];
  const organizerComments = resource.data?.comentarios.map((comment) => ({ id: comment.id, author: comment.autor, initials: comment.autor.split(" ").slice(0, 2).map((part) => part[0]).join(""), score: comment.score, text: comment.comentario, dateLabel: formatDate(comment.fecha), reply: comment.respuesta ?? "" })) ?? [];
  return (
    <div>
      <ResourceStatus {...events} /><ResourceStatus {...resource} />
      <label htmlFor="comments-event" className="sr-only">Evento</label><select id="comments-event" value={eventId} onChange={(event) => setEventId(event.target.value)} className="mb-5 w-full rounded-lg border p-3">{events.data.map((event) => <option key={event.id} value={event.id}>{event.titulo}</option>)}</select>
      <h1 className="text-title text-scesi-grey-normal md:text-display">Comentarios</h1>
      <p className="mt-3 text-body text-scesi-grey-normal/70">Revisa calificaciones y opiniones para mejorar los próximos eventos.</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <section aria-label="Resumen de calificaciones" className="rounded-xl border border-scesi-grey-light-active/50 bg-white px-6 py-6">
          <p className="text-center text-6xl font-semibold tracking-tight text-scesi-grey-normal" aria-label={`Promedio: ${averageRating.toFixed(1)} de 5`}>{averageRating.toFixed(1)}</p>
          <div aria-hidden="true" className="mt-6 flex justify-center gap-1 text-scesi-red-normal">
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="mt-3 text-center text-xs text-scesi-grey-normal/60">{totalRatings} calificaciones</p>
          <div className="mt-8 space-y-4">
            {ratingDistribution.map(({ score, count }) => {
              const percentage = totalRatings > 0 ? Math.round(count / totalRatings * 100) : 0;
              return (
                <div key={score} className="flex items-center gap-3 text-xs text-scesi-grey-normal">
                  <span className="inline-flex w-5 shrink-0 items-center">{score}<Star aria-hidden="true" className="h-2.5 w-2.5 fill-current" /></span>
                  <div role="progressbar" aria-label={`${score} estrellas`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={`${count} calificaciones, ${percentage}%`} className="h-1 flex-1 overflow-hidden bg-scesi-grey-light">
                    <div className="h-full bg-scesi-red-normal" style={{ width: `${totalRatings ? count / totalRatings * 100 : 0}%` }} />
                  </div>
                  <span className="w-7 text-right text-scesi-grey-normal/70">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </section>
        <section aria-label="Opiniones de asistentes" className="grid gap-3">
          {organizerComments.map((comment) => <CommentCard key={comment.id} comment={comment} initialReply={comment.reply} />)}
        </section>
      </div>
    </div>
  );
}
