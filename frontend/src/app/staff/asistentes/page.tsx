import type { Metadata } from "next";
import { AttendeesView } from "@/components/staff/attendees-view";

export const metadata: Metadata = {
  title: "Asistentes",
  description: "Consulta los inscritos, su registro y su ingreso.",
};

export default function StaffAttendeesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <AttendeesView />
    </div>
  );
}
