import type { Metadata } from "next";
import { LiveEventExplorer } from "@/components/events/live-event-explorer";

export const metadata: Metadata = {
  title: "Explorar eventos",
  description: "Descubre talleres, charlas y actividades de la comunidad SCESI.",
};

export default function ExploreEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <h1 className="text-title text-scesi-grey-normal md:text-display">
        Explorar eventos
      </h1>
      <p className="mt-3 text-body text-scesi-grey-normal/70">
        Descubre experiencias, talleres y encuentros de la comunidad.
      </p>

      <LiveEventExplorer />
    </div>
  );
}
