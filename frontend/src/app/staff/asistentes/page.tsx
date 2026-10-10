import type { Metadata } from "next";
import { StaffAttendeesView } from "@/components/staff/attendees-view";

export const metadata: Metadata = {
  title: "Asistentes",
  description: "Busca participantes y revisa su estado de ingreso.",
};

export default function StaffAttendeesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <StaffAttendeesView />
    </div>
  );
}
