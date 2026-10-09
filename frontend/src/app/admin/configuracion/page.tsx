import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Ajusta la configuración general de la plataforma.",
};

export default function AdminSettingsPage() {
  return (
    <DashboardSection
      title="Configuración"
      description="Ajusta la configuración general de la plataforma."
      emptyMessage="La configuración estará disponible próximamente."
      backHref="/admin"
      backLabel="Volver a Resumen"
    />
  );
}
