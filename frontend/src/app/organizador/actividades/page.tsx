import type { Metadata } from "next";
import { ActivitiesView } from "@/components/organizer/activities-view";

export const metadata: Metadata = {
  title: "Actividades",
  description: "Organiza charlas, talleres y responsables dentro del cronograma.",
};

export default function OrganizerActivitiesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <ActivitiesView />
    </div>
  );
}
