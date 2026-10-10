"use client";
import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { api } from "@/lib/api";
import type { ApiActivity, ApiEvent } from "@/lib/backend-types";

export function NewActivityForm() {
  const resource = useResource<ApiEvent[]>("/eventos?mios=true", [], true);
  return <><ResourceStatus {...resource} /><ActivityForm events={resource.data} /></>;
}
export function ActivityDetailForm() {
  const { id } = useParams<{ id: string }>();
  const resource = useResource<ApiActivity | null>(`/actividades/${encodeURIComponent(id)}`, null);
  return <><ResourceStatus {...resource} />{resource.data && <ActivityForm key={id} initial={resource.data} events={[]} />}</>;
}
function localDate(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
function ActivityForm({ events, initial }: { events: ApiEvent[]; initial?: ApiActivity }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "");
    try { await api(initial ? `/actividades/${initial.id}` : `/eventos/${value("eventoId")}/actividades`, { method: initial ? "PATCH" : "POST", body: JSON.stringify({ titulo: value("titulo"), descripcion: value("descripcion"), ponente: value("ponente"), lugar: value("lugar"), tipo: value("tipo"), horaInicio: new Date(value("horaInicio")).toISOString(), horaFin: new Date(value("horaFin")).toISOString() }) }); router.push("/organizador/actividades"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la actividad."); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-3xl p-6 sm:p-10"><h1 className="text-3xl font-semibold">{initial ? "Editar actividad" : "Nueva actividad"}</h1><form onSubmit={submit} className="mt-6 space-y-5 rounded-xl border p-6">{!initial && <label className="block text-sm">Evento<select name="eventoId" required className="mt-2 w-full rounded-lg border p-3">{events.map((event) => <option key={event.id} value={event.id}>{event.titulo}</option>)}</select></label>}{[{ name: "titulo", label: "Título", value: initial?.titulo ?? "", type: "text" }, { name: "ponente", label: "Responsable / ponente", value: initial?.ponente ?? "", type: "text" }, { name: "lugar", label: "Lugar", value: initial?.lugar ?? "", type: "text" }, { name: "tipo", label: "Tipo", value: initial?.tipo ?? "actividad", type: "text" }, { name: "horaInicio", label: "Inicio", value: initial ? localDate(initial.horaInicio) : "", type: "datetime-local" }, { name: "horaFin", label: "Fin", value: initial ? localDate(initial.horaFin) : "", type: "datetime-local" }].map((field) => <label key={field.name} className="block text-sm">{field.label}<input name={field.name} required defaultValue={field.value} type={field.type} className="mt-2 w-full rounded-lg border p-3" /></label>)}<label className="block text-sm">Descripción<textarea name="descripcion" defaultValue={initial?.descripcion} maxLength={2000} rows={4} className="mt-2 w-full rounded-lg border p-3" /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={pending || (!initial && !events.length)} className="rounded-lg bg-scesi-red-normal px-5 py-3 text-white">{pending ? "Guardando…" : "Guardar actividad"}</button></form></div>;
}
