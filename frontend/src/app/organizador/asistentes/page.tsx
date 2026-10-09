import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Asistentes",
  description: "Consulta y gestiona los asistentes de tus eventos.",
};

export default function OrganizerAttendeesPage() {
  return (
    <DashboardSection
      title="Asistentes"
      description="Consulta y gestiona los asistentes de tus eventos."
      emptyMessage="El listado de asistentes estará disponible próximamente."
      backHref="/organizador"
      backLabel="Volver a Mis eventos"
    />
  );
}
