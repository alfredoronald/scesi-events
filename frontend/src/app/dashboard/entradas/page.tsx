import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/dashboard-section";

export const metadata: Metadata = {
  title: "Mis entradas",
  description: "Consulta las inscripciones y entradas de tus eventos.",
};

export default function TicketsPage() {
  return (
    <DashboardSection
      title="Mis entradas"
      description="Consulta las inscripciones y entradas asociadas a tu cuenta."
      emptyMessage="Cuando te inscribas a un evento, encontrarás aquí tus entradas."
    />
  );
}
