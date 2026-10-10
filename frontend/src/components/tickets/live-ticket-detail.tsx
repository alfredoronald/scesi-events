"use client";
import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { formatDate, type ApiInscription } from "@/lib/backend-types";
import { api } from "@/lib/api";

export function LiveTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const resource = useResource<ApiInscription | null>(`/inscripciones/${encodeURIComponent(id)}`, null);
  const qr = useResource<{ qrDataUrl: string } | null>(resource.data?.tieneQr ? `/inscripciones/${encodeURIComponent(id)}/qr` : null, null);
  const ticket = resource.data;
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("comprobante");
    if (!(file instanceof File) || !file.size) return;
    setPending(true); setMessage("");
    try { await api(`/inscripciones/${id}/comprobante`, { method: "POST", body: file, headers: { "Content-Type": "application/pdf" } }); setMessage("Comprobante enviado. El organizador revisará tu pago."); resource.reload(); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "No se pudo enviar el comprobante."); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-6xl p-6 sm:p-10"><Link href="/dashboard/entradas" className="text-sm text-scesi-red-normal">← Mis entradas</Link><ResourceStatus {...resource} />{ticket && <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><article className="rounded-2xl bg-scesi-grey-light p-8"><h1 className="text-3xl font-semibold">{ticket.evento.titulo}</h1><p className="mt-4">{formatDate(ticket.evento.fechaInicio)} · {ticket.evento.lugar}</p><p className="mt-4">Estado de pago: {ticket.estadoPago.replaceAll("_", " ")}</p><Link href={`/dashboard/eventos/${ticket.eventoId}`} className="mt-6 inline-block text-scesi-red-normal">Ver evento</Link>{(ticket.estadoPago === "pendiente" || ticket.estadoPago === "rechazado") && <form onSubmit={upload} className="mt-6 space-y-3"><label className="block text-sm">Comprobante PDF (máximo 5 MB)<input name="comprobante" type="file" accept="application/pdf" required className="mt-2 block w-full rounded-lg border p-3" /></label><button disabled={pending} className="rounded-lg bg-scesi-red-normal px-4 py-3 text-sm text-white">{pending ? "Enviando…" : "Enviar comprobante"}</button><p role="status" className="text-sm">{message}</p></form>}</article><aside className="rounded-2xl border p-6 text-center"><p className="text-sm">Código de acceso</p><p className="mt-2 text-3xl font-semibold">{ticket.codigo}</p>{ticket.tieneQr ? <><ResourceStatus {...qr} />{qr.data && <Image src={qr.data.qrDataUrl} alt={`QR de la entrada ${ticket.codigo}`} width={260} height={260} unoptimized className="mt-4 w-full" />}</> : <p className="mt-6 text-sm text-gray-500">El QR estará disponible cuando se confirme tu pago.</p>}</aside></div>}</div>;
}
