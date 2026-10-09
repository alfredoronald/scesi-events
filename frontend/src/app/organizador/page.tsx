import type { Metadata } from "next";
import { EventsView } from "@/components/organizer/events-view";

export const metadata: Metadata = {
  title: "Mis eventos",
  description: "Crea, publica y administra toda la información de tus eventos.",
};

export default function OrganizerEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <EventsView />
    </div>
  );
}
