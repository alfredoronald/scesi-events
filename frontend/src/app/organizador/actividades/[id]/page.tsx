import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { activitySchedule } from "@/config/organizer-activities";

export const metadata: Metadata = {
  title: "Detalle de actividad",
  description: "Información de la actividad seleccionada.",
};

/**
 * Precarga las actividades conocidas: el Topbar del layout usa usePathname,
 * que necesita una ruta conocida durante el prerender (Cache Components).
 */
export function generateStaticParams() {
  return activitySchedule.flatMap((day) =>
    day.activities.map((activity) => ({ id: activity.id })),
  );
}

export default function ActivityDetailPage() {
  return (
    <DashboardSection
      title="Detalle de actividad"
      description="Información de la actividad seleccionada."
      emptyMessage="El detalle de la actividad estará disponible próximamente."
      backHref="/organizador/actividades"
      backLabel="Volver a Actividades"
    />
  );
}
