import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Reportes",
  description: "Genera reportes de asistencia, ventas y métricas.",
};

export default function AdminReportsPage() {
  return (
    <DashboardSection
      title="Reportes"
      description="Genera reportes de asistencia, ventas y métricas."
      emptyMessage="Los reportes estarán disponibles próximamente."
      backHref="/admin"
      backLabel="Volver a Resumen"
    />
  );
}
