"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { ApiEvent } from "@/lib/backend-types";

export function EventStatusControl({ event, onSaved }: { event: ApiEvent; onSaved: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function change(estado: string) {
    setPending(true); setError("");
    try { await api(`/eventos/${event.id}/estado`, { method: "PATCH", body: JSON.stringify({ estado }) }); onSaved(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar el estado."); }
    finally { setPending(false); }
  }
  return <div className="mt-2"><select aria-label={`Estado de ${event.titulo}`} disabled={pending} value={event.estado} onChange={(e) => change(e.target.value)} className="rounded-lg border bg-white p-2 text-xs">{[{ value: "borrador", label: "Borrador" }, { value: "publicado", label: "Publicado" }, { value: "en_curso", label: "En curso" }, { value: "cerrado", label: "Cerrado" }].map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select>{error && <p role="alert" className="mt-2 max-w-64 text-xs text-red-700">{error}</p>}</div>;
}
