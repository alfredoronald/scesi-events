import type { Metadata } from "next";
import { TicketExplorer } from "@/components/tickets/ticket-explorer";
import { tickets } from "@/config/tickets";

export const metadata: Metadata = {
  title: "Mis entradas",
  description: "Consulta las inscripciones y entradas de tus eventos.",
};

export default function TicketsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <h1 className="text-title text-scesi-grey-normal md:text-display">
        Mis entradas
      </h1>
      <p className="mt-3 text-body text-scesi-grey-normal/70">
        Consulta tus inscripciones y códigos de ingreso.
      </p>

      <TicketExplorer tickets={tickets} />
    </div>
  );
}
