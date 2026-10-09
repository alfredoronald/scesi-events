import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Explorar eventos",
  description: "Descubre talleres, charlas y actividades de la comunidad SCESI.",
};

export default function ExploreEventsPage() {
  return (
    <DashboardSection
      title="Explorar eventos"
      description="Encuentra talleres, charlas y actividades de la comunidad."
      emptyMessage="Pronto aparecerán aquí los próximos eventos de SCESI."
    />
  );
}
