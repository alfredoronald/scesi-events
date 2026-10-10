import { Star } from "lucide-react";
import { averageRating, organizerComments, ratingDistribution, totalRatings } from "@/config/organizer-comments";
import { CommentCard } from "./comment-card";

export function CommentsView() {
  return (
    <div>
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
                    <div className="h-full bg-scesi-red-normal" style={{ width: `${count / totalRatings * 100}%` }} />
                  </div>
                  <span className="w-7 text-right text-scesi-grey-normal/70">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </section>
        <section aria-label="Opiniones de asistentes" className="grid gap-3">
          {organizerComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
        </section>
      </div>
    </div>
  );
}
