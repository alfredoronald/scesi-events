import type { Metadata } from "next";
import { StaffScheduleView } from "@/components/staff/schedule-view";

export const metadata: Metadata = {
  title: "Mi horario",
  description: "Consulta tus turnos, espacios y responsabilidades asignadas.",
};

export default function StaffPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <StaffScheduleView />
    </div>
  );
}
