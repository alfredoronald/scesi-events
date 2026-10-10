"use client";
import { useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { api } from "@/lib/api";
import { formatDate, type ApiEvent } from "@/lib/backend-types";

export function EventDetailView() {
  const { id } = useParams<{ id: string }>();
  const resource = useResource<ApiEvent | null>(`/eventos/${encodeURIComponent(id)}`, null);
  const { user } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function register(event: FormEvent) {
    event.preventDefault();
    if (!user || !resource.data) return;
    setPending(true); setError("");
    try {
      const result = await api<{ id: string }>(`/eventos/${resource.data.id}/inscripciones`, { method: "POST", body: JSON.stringify({ nombreCompleto: user.nombreCompleto, email: user.email, celular: phone, consentimientoDatos: consent }) });
      router.push(`/dashboard/entradas/${result.id}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo registrar la inscripción."); }
    finally { setPending(false); }
  }
  const event = resource.data;
  return <div className="mx-auto max-w-6xl p-6 sm:p-10"><Link href="/dashboard/explorar" className="text-sm text-scesi-red-normal">← Explorar eventos</Link><ResourceStatus {...resource} />{event && <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><article className="rounded-2xl bg-scesi-grey-light p-8"><h1 className="text-3xl font-semibold">{event.titulo}</h1><p className="mt-4 whitespace-pre-line">{event.descripcion}</p><p className="mt-6">{formatDate(event.fechaInicio)} · {event.lugar}</p><p className="mt-2">{event.modalidad} · {event.esPago ? `Bs ${event.precio}` : "Gratuito"}</p><p className="mt-2">{event.cupoMaximo === null ? "Sin límite de cupos" : `${Math.max(0, event.cupoMaximo - event.inscritosConfirmados)} cupos disponibles`}</p></article><form onSubmit={register} className="space-y-4 rounded-2xl border p-6"><h2 className="text-xl font-semibold">Inscribirme</h2><label className="block text-sm">Celular<input required minLength={6} maxLength={30} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label><label className="flex gap-2 text-sm"><input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />Acepto el tratamiento de mis datos para esta inscripción.</label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={pending || event.estado === "cerrado"} className="w-full rounded-lg bg-scesi-red-normal p-3 text-white disabled:opacity-50">{pending ? "Registrando…" : "Confirmar inscripción"}</button></form></div>}</div>;
}
