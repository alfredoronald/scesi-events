"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";

export function ProjectDetailView() {
  const { id } = useParams<{ id: string }>();
  const resource = useResource<{ titulo: string; descripcion: string; githubUrl: string | null; colaboradores: { id: string; nombre: string }[] } | null>(`/proyectos/${encodeURIComponent(id)}`, null);
  const project = resource.data;
  return <main className="mx-auto w-full max-w-4xl p-6 sm:p-10"><Link href="/" className="text-sm text-scesi-red-normal">← Inicio</Link><ResourceStatus {...resource} />{project && <article className="mt-6 rounded-2xl border p-8"><h1 className="text-3xl font-semibold">{project.titulo}</h1><p className="mt-5 whitespace-pre-line text-sm leading-relaxed">{project.descripcion}</p><h2 className="mt-6 text-lg font-semibold">Colaboradores</h2><ul className="mt-3 space-y-2 text-sm">{project.colaboradores.map((person) => <li key={person.id}>{person.nombre}</li>)}</ul>{project.githubUrl && <a href={project.githubUrl} className="mt-6 inline-block text-scesi-red-normal underline">Repositorio del proyecto</a>}</article>}</main>;
}
