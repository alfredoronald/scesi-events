import type { Metadata } from "next";
import { CreateEventForm } from "@/components/events/create-event-form";

export const metadata: Metadata = { title: "Crear evento", description: "Crea un evento desde el espacio de administración." };

export default function AdminCreateEventPage() {
  return <CreateEventForm backHref="/admin/eventos" />;
}
