import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Asistentes",
  description: "Consulta el listado de asistentes del evento.",
};

export default function StaffAttendeesPage() {
  return (
    <DashboardSection
      title="Asistentes"
      description="Consulta el listado de asistentes del evento."
      emptyMessage="El listado de asistentes estará disponible próximamente."
      backHref="/staff"
      backLabel="Volver a Mi horario"
    />
  );
}
