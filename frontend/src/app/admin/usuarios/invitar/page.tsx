import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Invitar usuario",
  description: "Invita a un usuario a participar en la plataforma SCESI.",
};

export default function AdminInviteUserPage() {
  return (
    <DashboardSection
      title="Invitar usuario"
      description="Invita a un usuario y asigna su rol dentro de la plataforma."
      emptyMessage="El formulario de invitación de usuarios estará disponible próximamente."
      backHref="/admin/usuarios"
      backLabel="Volver a Usuarios y roles"
    />
  );
}
