import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Usuarios y roles",
  description: "Administra los usuarios y sus roles en la plataforma.",
};

export default function AdminUsersPage() {
  return (
    <DashboardSection
      title="Usuarios y roles"
      description="Administra los usuarios y sus roles en la plataforma."
      emptyMessage="La gestión de usuarios estará disponible próximamente."
      backHref="/admin"
      backLabel="Volver a Resumen"
    />
  );
}
