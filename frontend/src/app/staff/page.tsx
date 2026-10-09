import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Staff",
  description: "Consulta tus asignaciones y tareas del evento.",
};

export default function StaffPage() {
  return (
    <DashboardSection
      title="Vista Staff"
      description="Aquí verás tus asignaciones, horarios y tareas como parte del staff."
      emptyMessage="La vista de staff estará disponible próximamente."
    />
  );
}
