import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Comentarios",
  description: "Lee y responde los comentarios de los asistentes.",
};

export default function OrganizerCommentsPage() {
  return (
    <DashboardSection
      title="Comentarios"
      description="Lee y responde los comentarios de los asistentes."
      emptyMessage="Los comentarios estarán disponibles próximamente."
      backHref="/organizador"
      backLabel="Volver a Mis eventos"
    />
  );
}
