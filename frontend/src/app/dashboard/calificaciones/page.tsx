import type { Metadata } from "next";
import { RatingSection } from "@/components/ratings/rating-section";

export const metadata: Metadata = {
  title: "Calificaciones",
  description: "Comparte tu experiencia y consulta las valoraciones que enviaste.",
};

export default function RatingsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <h1 className="text-title text-scesi-grey-normal md:text-display">
        Calificaciones
      </h1>
      <p className="mt-3 text-body text-scesi-grey-normal/70">
        Comparte tu experiencia y consulta las valoraciones que enviaste.
      </p>
      <RatingSection />
    </div>
  );
}
