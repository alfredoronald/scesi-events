import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Todos los eventos",
  description: "Consulta y gestiona todos los eventos de la plataforma.",
};

export default function AdminEventsPage() {
  return (
    <DashboardSection
      title="Todos los eventos"
      description="Consulta y gestiona todos los eventos de la plataforma."
      emptyMessage="El listado de eventos estará disponible próximamente."
      backHref="/admin"
      backLabel="Volver a Resumen"
    />
  );
}
