import type { Metadata } from "next";
import { AdminEventsView } from "@/components/admin/events-view";

export const metadata: Metadata = {
  title: "Todos los eventos",
  description: "Administra eventos propios, colaboraciones e invitaciones.",
};

export default function AdminEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <AdminEventsView />
    </div>
  );
}
