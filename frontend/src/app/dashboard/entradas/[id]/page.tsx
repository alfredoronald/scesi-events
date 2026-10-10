import { Suspense } from "react";
import { LiveTicketDetail } from "@/components/tickets/live-ticket-detail";

export default function TicketPage() {
  return <Suspense fallback={<p className="p-8">Cargando entrada…</p>}><LiveTicketDetail /></Suspense>;
}
