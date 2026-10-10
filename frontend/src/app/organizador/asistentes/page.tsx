import type { Metadata } from "next";
import { AttendeesView } from "@/components/attendees/attendees-view";

export const metadata: Metadata = {
  title: "Asistentes",
  description: "Consulta registros, confirma ingresos y exporta la lista del evento.",
};

export default function OrganizerAttendeesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <AttendeesView />
    </div>
  );
}
