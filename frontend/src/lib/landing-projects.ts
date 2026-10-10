import type { Project } from "@/config/landing";

export async function loadLandingProjects(): Promise<Project[]> {
  const baseUrl = (process.env.API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/api/v1/proyectos?pageSize=3`, { cache: "no-store" });
    if (!response.ok) return [];
    const body = await response.json() as { data: Array<{ id: string; titulo: string; descripcion: string; imagenUrl: string | null; categoria: string | null; createdAt: string }> };
    return body.data.map((project) => ({ id: project.id, title: project.titulo, description: project.descripcion, image: project.imagenUrl ?? "/landing/hero-mascot.png", category: project.categoria ?? "Proyecto SCESI", date: new Date(project.createdAt).toLocaleDateString("es-BO", { month: "short", year: "numeric", timeZone: "America/La_Paz" }), location: "SCESI", href: `/proyectos/${project.id}` }));
  } catch { return []; }
}
