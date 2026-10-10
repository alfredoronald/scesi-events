export type AdminEventStatus = "published" | "ongoing" | "draft" | "finished";
export type AdminEvent = {
  id: string;
  title: string;
  responsible: string;
  date: string;
  type: "Organizado" | "Invitados" | "Staff";
  status: AdminEventStatus;
};

export const adminEventStatusLabels: Record<AdminEventStatus, string> = {
  published: "Publicado",
  ongoing: "En curso",
  draft: "Borrador",
  finished: "Finalizado",
};

/** Registros demo de supervisión, incluidos eventos de otras organizaciones. */
const featured: AdminEvent[] = [
  { id: "hackathon-scesi", title: "Hackathon SCESI", responsible: "Equipo SCESI", date: "28 SEP", type: "Organizado", status: "published" },
  { id: "feria-internacional-del-libro", title: "Feria del Libro", responsible: "Cámara del Libro", date: "05–15 SEP", type: "Invitados", status: "ongoing" },
  { id: "devtalks-ia-sin-humo", title: "DevTalks", responsible: "Equipo SCESI", date: "12 OCT", type: "Organizado", status: "published" },
  { id: "women-in-tech", title: "Women in Tech", responsible: "Comunidad WIT", date: "20 OCT", type: "Staff", status: "draft" },
];

const subjects = ["Linux Week", "Taller de Python", "Programming Day", "Game Jam", "TechZone", "SCESI Open Day", "Taller de Git", "Encuentro de comunidades"];
const remaining: AdminEvent[] = Array.from({ length: 32 }, (_, index) => ({
  id: `admin-demo-${index + 1}`,
  title: `${subjects[index % subjects.length]} · Edición ${Math.floor(index / subjects.length) + 1}`,
  responsible: index % 3 === 0 ? "Comunidad tecnológica" : "Equipo SCESI",
  date: `${String(1 + index % 28).padStart(2, "0")} ${index < 16 ? "NOV" : "AGO"}`,
  type: index % 3 === 0 ? "Invitados" : index % 3 === 1 ? "Organizado" : "Staff",
  status: index < 9 ? "published" : index < 16 ? "draft" : "finished",
}));

export const adminEvents: AdminEvent[] = [...featured, ...remaining];

export function normalizeEventSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
