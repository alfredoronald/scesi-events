import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Administrador",
  description: "Administra usuarios, roles y la configuración de la plataforma.",
};

export default function AdminPage() {
  return (
    <DashboardSection
      title="Vista Administrador"
      description="Aquí podrás gestionar usuarios, roles y la configuración general."
      emptyMessage="La vista de administrador estará disponible próximamente."
    />
  );
}
