import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Control de acceso",
  description: "Registra la entrada y salida de los asistentes.",
};

export default function StaffAccessControlPage() {
  return (
    <DashboardSection
      title="Control de acceso"
      description="Registra la entrada y salida de los asistentes."
      emptyMessage="El control de acceso estará disponible próximamente."
      backHref="/staff"
      backLabel="Volver a Mi horario"
    />
  );
}
