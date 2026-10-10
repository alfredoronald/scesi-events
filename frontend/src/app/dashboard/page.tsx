import type { Metadata } from "next";
import { LiveDashboard } from "@/components/dashboard/live-dashboard";

export const metadata: Metadata = {
  title: "Resumen",
  description:
    "Tu agenda SCESI: próximo evento, recomendaciones y actividad del año.",
};

export default function SummaryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <LiveDashboard />
    </div>
  );
}
