import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Calificaciones",
  description: "Comparte tu experiencia y califica los eventos a los que asististe.",
};

export default function RatingsPage() {
  return (
    <DashboardSection
      title="Calificaciones"
      description="Ayuda a mejorar los eventos compartiendo tu experiencia."
      emptyMessage="Los eventos que puedes calificar aparecerán aquí."
    />
  );
}
