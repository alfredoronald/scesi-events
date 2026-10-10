export type PublicEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  startsAt: string;
  endsAt: string;
  location: string;
  coverImageUrl: string | null;
  participationKind: "organized" | "invited" | "staff";
  registrationUrl: string | null;
};

export async function getEvents(period: "upcoming" | "past"): Promise<PublicEvent[]> {
  const baseUrl = (process.env.API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api/v1/eventos?periodo=${period === "upcoming" ? "proximos" : "pasados"}&pageSize=100`, { cache: "no-store" });
  if (!response.ok) throw new Error(`La API respondió ${response.status}`);
  const body = (await response.json()) as { data: Array<{ id: string; slug: string; titulo: string; descripcion: string; fechaInicio: string; fechaFin: string; lugar: string; imagenUrl: string | null; participacionScesi: PublicEvent["participationKind"] }> };
  if (!Array.isArray(body.data)) throw new Error("Respuesta inválida de la API");
  return body.data.map((event) => ({ id: event.id, slug: event.slug, title: event.titulo, summary: event.descripcion, startsAt: event.fechaInicio, endsAt: event.fechaFin, location: event.lugar, coverImageUrl: event.imagenUrl, participationKind: event.participacionScesi, registrationUrl: `/dashboard/explorar?evento=${event.id}` }));
}
