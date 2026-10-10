import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = { title: "Crear evento", description: "Crea un evento desde el espacio de administración." };

export default function AdminCreateEventPage() {
  return <DashboardSection title="Crear evento" description="Configura un evento desde el espacio de administración." emptyMessage="El formulario de creación de eventos estará disponible próximamente." backHref="/admin/eventos" backLabel="Volver a Todos los eventos" />;
}
