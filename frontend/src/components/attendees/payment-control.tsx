"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export function PaymentControl({ id, hasReceipt, onSaved }: { id: string; hasReceipt: boolean; onSaved: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function decide(estado: string) {
    setPending(true); setError("");
    try { await api(`/inscripciones/${id}/pago`, { method: "PATCH", body: JSON.stringify({ estado }) }); onSaved(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar el pago."); }
    finally { setPending(false); }
  }
  async function viewReceipt() {
    setPending(true); setError("");
    try {
      const file = await api<Blob>(`/inscripciones/${id}/comprobante`);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a"); link.href = url; link.download = `comprobante-${id}.pdf`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo descargar el comprobante."); }
    finally { setPending(false); }
  }
  return <div className="mt-2 space-y-2 text-xs">{hasReceipt && <button type="button" disabled={pending} onClick={viewReceipt} className="block underline">Ver comprobante</button>}<div className="flex gap-2"><button type="button" disabled={pending} onClick={() => decide("confirmado")} className="rounded-lg border px-2 py-1">Confirmar pago</button><button type="button" disabled={pending} onClick={() => decide("rechazado")} className="rounded-lg border px-2 py-1">Rechazar</button></div>{error && <p role="alert" className="max-w-64 text-red-700">{error}</p>}</div>;
}
