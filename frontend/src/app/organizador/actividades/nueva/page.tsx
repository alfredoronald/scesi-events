import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Nueva actividad",
  description: "Configura la información y el horario de tu actividad.",
};

export default function CreateActivityPage() {
  return (
    <DashboardSection
      title="Nueva actividad"
      description="Configura la información y el horario de tu actividad."
      emptyMessage="El formulario de creación de actividades estará disponible próximamente."
      backHref="/organizador/actividades"
      backLabel="Volver a Actividades"
    />
  );
}
