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

type EventListResponse = { data: PublicEvent[] };

export async function getEvents(period: "upcoming" | "past"): Promise<PublicEvent[]> {
  const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${baseUrl}/api/events?period=${period}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`La API respondió ${response.status}`);
  const body = (await response.json()) as EventListResponse;
  if (!Array.isArray(body.data)) throw new Error("Respuesta inválida de la API");
  return body.data;
}
