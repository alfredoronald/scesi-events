import type { Metadata } from "next";
import { ActivityStats } from "@/components/dashboard/activity-stats";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { NextEventCard } from "@/components/dashboard/next-event-card";
import { RecommendedEvents } from "@/components/dashboard/recommended-events";

export const metadata: Metadata = {
  title: "Resumen",
  description:
    "Tu agenda SCESI: próximo evento, recomendaciones y actividad del año.",
};

export default function SummaryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <DashboardHeader />

      <div className="mt-8">
        <NextEventCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <RecommendedEvents />
        <ActivityStats />
      </div>
    </div>
  );
}
