import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Organizador",
  description: "Gestiona los eventos que organizas desde un solo lugar.",
};

export default function OrganizerPage() {
  return (
    <DashboardSection
      title="Vista Organizador"
      description="Aquí encontrarás las herramientas para crear y gestionar tus eventos."
      emptyMessage="La vista de organizador estará disponible próximamente."
    />
  );
}
