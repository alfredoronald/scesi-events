import { Suspense } from "react";
import { EventDetailView } from "@/components/events/event-detail-view";

export default function EventPage() {
  return <Suspense fallback={<p className="p-8">Cargando evento…</p>}><EventDetailView /></Suspense>;
}
