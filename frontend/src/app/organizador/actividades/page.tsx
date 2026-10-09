import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Actividades",
  description: "Organiza el cronograma y las actividades de tus eventos.",
};

export default function OrganizerActivitiesPage() {
  return (
    <DashboardSection
      title="Actividades"
      description="Organiza el cronograma y las actividades de tus eventos."
      emptyMessage="La gestión de actividades estará disponible próximamente."
      backHref="/organizador"
      backLabel="Volver a Mis eventos"
    />
  );
}
