import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Métricas",
  description: "Revisa el rendimiento y las estadísticas de tus eventos.",
};

export default function OrganizerMetricsPage() {
  return (
    <DashboardSection
      title="Métricas"
      description="Revisa el rendimiento y las estadísticas de tus eventos."
      emptyMessage="El panel de métricas estará disponible próximamente."
      backHref="/organizador"
      backLabel="Volver a Mis eventos"
    />
  );
}
