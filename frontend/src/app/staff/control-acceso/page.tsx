import type { Metadata } from "next";
import { StaffAccessControlView } from "@/components/staff/access-control-view";

export const metadata: Metadata = {
  title: "Control de acceso",
  description: "Valida entradas y registra ingresos o salidas del evento.",
};

export default function StaffAccessControlPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <StaffAccessControlView />
    </div>
  );
}
