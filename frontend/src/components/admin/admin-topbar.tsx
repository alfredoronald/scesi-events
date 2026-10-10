"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { adminEvents, normalizeEventSearch } from "@/config/admin-events";

export function AdminTopbar({ title }: { title: string }) {
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const term = normalizeEventSearch(query.trim());
  const results = term ? adminEvents.filter((event) => normalizeEventSearch(`${event.title} ${event.responsible}`).includes(term)).slice(0, 5) : [];

  return (
    <header className="sticky top-16 z-20 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-scesi-grey-dark bg-scesi-grey-normal px-5 py-4 sm:px-8 lg:top-0">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-scesi-grey-light-active">Administrador</p>
        <p className="mt-1 truncate text-lg font-medium text-white">{title}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setQuery(""); }}>
          <label htmlFor="admin-global-search" className="sr-only">Buscar en SCESI</label>
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-light-active" />
          <input id="admin-global-search" type="search" placeholder="Buscar en SCESI..." value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }} className="h-10 w-60 rounded-lg border border-scesi-grey-light-active/25 bg-scesi-grey-normal pl-9 pr-3 text-xs text-white outline-none placeholder:text-scesi-grey-light-active/60 focus:border-scesi-red-normal" />
          {term && <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] rounded-xl border border-scesi-grey-light-active bg-white p-3 text-sm text-scesi-grey-normal shadow-lg">
            <p role="status" className="mb-2 text-xs text-scesi-grey-normal/60">{results.length ? "Eventos encontrados" : "No se encontraron eventos"}</p>
            <ul>{results.map((event) => <li key={event.id} className="border-b border-scesi-grey-light py-2"><p className="font-medium">{event.title}</p><p className="text-xs text-scesi-grey-normal/60">{event.responsible} · {event.date}</p></li>)}</ul>
            <Link href="/admin/eventos" onClick={() => setQuery("")} className="mt-3 inline-block text-xs text-scesi-red-normal underline focus-visible:outline-2 focus-visible:outline-scesi-red-normal">Ir a Todos los eventos</Link>
          </div>}
        </div>
        <div className="relative">
          <button type="button" aria-label="Notificaciones" aria-expanded={notificationsOpen} aria-controls="admin-notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setUnread(false); }} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-scesi-grey-light-active/25 text-white hover:bg-scesi-grey-dark focus-visible:outline-2 focus-visible:outline-scesi-red-light">
            <Bell aria-hidden="true" className="h-5 w-5" />
            {unread && <span aria-label="Una notificación sin leer" className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-scesi-red-normal" />}
          </button>
          {notificationsOpen && <div id="admin-notifications" className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-scesi-grey-light-active bg-white p-4 text-sm text-scesi-grey-normal shadow-lg">
            <p className="font-semibold">Notificaciones</p>
            <p className="mt-2 text-xs text-scesi-grey-normal/65">Hay {adminEvents.filter((event) => event.status === "draft").length} eventos en borrador para revisar.</p>
            <Link href="/admin/eventos" onClick={() => setNotificationsOpen(false)} className="mt-3 inline-block text-xs text-scesi-red-normal underline focus-visible:outline-2 focus-visible:outline-scesi-red-normal">Ver eventos</Link>
            <button type="button" onClick={() => setNotificationsOpen(false)} className="mt-3 block text-xs underline focus-visible:outline-2 focus-visible:outline-scesi-red-normal">Cerrar</button>
          </div>}
        </div>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-scesi-red-normal text-xs font-semibold text-white">CS</span>
          <div className="hidden sm:block"><p className="text-xs font-semibold text-white">Coordinación SCESI</p><p className="mt-1 text-[10px] text-scesi-grey-light-active">Administrador</p></div>
        </div>
      </div>
    </header>
  );
}
