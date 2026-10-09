import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

/**
 * Selector de puntuación de 1 a 5 estrellas.
 * Solo importado desde componentes cliente (rating-section).
 */
export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div
      role="group"
      aria-label="Puntuación del evento"
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
          className="rounded-md p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-scesi-red-normal"
        >
          <Star
            aria-hidden="true"
            className={cn(
              "h-7 w-7 transition-colors",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-scesi-grey-light-active",
            )}
          />
        </button>
      ))}
    </div>
  );
}
