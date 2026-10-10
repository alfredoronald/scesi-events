"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const fieldClass = "mt-2 w-full rounded-lg border border-scesi-grey-light-active p-3 text-sm";
export function CreateEventForm({ backHref }: { backHref: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "");
    try {
      await api("/eventos", { method: "POST", body: JSON.stringify({ titulo: value("titulo"), descripcion: value("descripcion"), tipo: value("tipo"), modalidad: value("modalidad"), lugar: value("lugar"), fechaInicio: new Date(value("fechaInicio")).toISOString(), fechaFin: new Date(value("fechaFin")).toISOString(), cupoMaximo: value("cupoMaximo") ? Number(value("cupoMaximo")) : null, participacionScesi: value("participacionScesi"), esPago: Number(value("precio")) > 0, precio: Number(value("precio")) || null }) });
      router.push(backHref);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo crear el evento."); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-3xl p-6 sm:p-10"><h1 className="text-3xl font-semibold">Crear evento</h1><p className="mt-3 text-sm text-gray-500">Se guardará como borrador.</p><form onSubmit={submit} className="mt-6 space-y-5 rounded-xl border p-6">{[{ name: "titulo", label: "Título", type: "text", minLength: 3, maxLength: 160 }, { name: "lugar", label: "Lugar", type: "text", minLength: 3, maxLength: 200 }, { name: "fechaInicio", label: "Inicio", type: "datetime-local" }, { name: "fechaFin", label: "Fin", type: "datetime-local" }].map((field) => <label key={field.name} className="block text-sm">{field.label}<input name={field.name} type={field.type} required minLength={field.minLength} maxLength={field.maxLength} className={fieldClass} /></label>)}<label className="block text-sm">Descripción<textarea name="descripcion" required minLength={10} maxLength={5000} rows={4} className={fieldClass} /></label>{[{ name: "tipo", label: "Tipo", values: ["charla", "taller", "hackathon", "congreso", "ctf"] }, { name: "modalidad", label: "Modalidad", values: ["presencial", "virtual", "mixto"] }, { name: "participacionScesi", label: "Participación SCESI", values: ["organized", "invited", "staff"] }].map((field) => <label key={field.name} className="block text-sm">{field.label}<select name={field.name} className={fieldClass}>{field.values.map((value) => <option key={value}>{value}</option>)}</select></label>)}<label className="block text-sm">Cupos (vacío = sin límite)<input name="cupoMaximo" type="number" min={1} max={100000} className={fieldClass} /></label><label className="block text-sm">Precio en Bs (0 = gratuito)<input name="precio" type="number" min={0} max={99999} step="0.01" defaultValue={0} className={fieldClass} /></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={pending} className="rounded-lg bg-scesi-red-normal px-5 py-3 text-white">{pending ? "Guardando…" : "Crear evento"}</button></form></div>;
}
