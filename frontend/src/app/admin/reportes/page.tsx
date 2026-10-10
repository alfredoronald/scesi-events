import type { Metadata } from "next";
import { AdminReportsView } from "@/components/admin/reports-view";

export const metadata: Metadata = {
  title: "Reportes",
  description: "Genera informes consolidados sobre eventos, participación y comunidad.",
};

export default function AdminReportsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <AdminReportsView />
    </div>
  );
}
