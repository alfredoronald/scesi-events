import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Crear evento",
  description: "Configura la información, fechas y cupos de tu nuevo evento.",
};

export default function CreateEventPage() {
  return (
    <DashboardSection
      title="Crear evento"
      description="Configura la información, fechas y cupos de tu nuevo evento."
      emptyMessage="El formulario de creación de eventos estará disponible próximamente."
      backHref="/organizador"
      backLabel="Volver a Mis eventos"
    />
  );
}
