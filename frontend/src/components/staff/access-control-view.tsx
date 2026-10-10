"use client";

import { useState, type FormEvent } from "react";
import { Ticket } from "lucide-react";
import { accessEvents, validateAccessCode, type AccessEntry } from "@/config/staff-access";
import { useCheckIns } from "@/components/attendees/check-in-provider";

export function StaffAccessControlView() {
  const [eventId, setEventId] = useState(accessEvents[0].id);
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState<AccessEntry | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { checkIns, checkOuts, checkIn, checkOut } = useCheckIns();
  const isPresent = Boolean(entry && checkIns[entry.id] && !checkOuts[entry.id]);

  function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const result = validateAccessCode(code, eventId);
    if (!result.ok) {
      setEntry(null);
      setError(result.message);
      return;
    }
    setCode(result.entry.code);
    setEntry(result.entry);
    setError("");
  }

  function register() {
    if (!entry) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (isPresent) {
      checkOut(entry.id, time);
      setMessage(`Salida registrada para ${entry.name} a las ${time}.`);
    } else {
      checkIn(entry.id, time);
      setMessage(`Ingreso registrado para ${entry.name} a las ${time}.`);
    }
    // Obliga a validar otra vez antes de registrar un movimiento nuevo.
    setEntry(null);
    setCode("");
  }

  return (
    <div>
      <h1 className="text-title text-scesi-grey-normal md:text-display">Control de acceso</h1>
      <p className="mt-2 text-body text-scesi-grey-normal/65">Valida entradas y registra ingresos o salidas del evento.</p>
      <label htmlFor="access-event" className="sr-only">Evento para control de acceso</label>
      <select
        id="access-event"
        value={eventId}
        onChange={(event) => { setEventId(event.target.value); setCode(""); setEntry(null); setError(""); setMessage(""); }}
        className="mt-2 h-11 w-full rounded-lg border border-scesi-grey-light-active/50 bg-white px-3 text-base text-scesi-grey-normal outline-none focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20"
      >
        {accessEvents.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
      </select>

      <section aria-label="Validación de entradas" className="mt-7 grid min-h-[420px] items-center gap-8 rounded-xl bg-scesi-grey-normal px-6 py-10 text-white md:grid-cols-2 md:px-12 md:py-16">
        <div className="flex flex-col items-center justify-center">
          <div aria-hidden="true" className="relative flex aspect-square w-full max-w-64 items-center justify-center">
            <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-scesi-red-normal" />
            <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-scesi-red-normal" />
            <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-scesi-red-normal" />
            <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-scesi-red-normal" />
            <Ticket className="h-12 w-12 text-scesi-grey-light-active/50" />
          </div>
          <p className="mt-4 text-xs text-scesi-grey-light-active/70">Vista previa del lector QR · cámara no conectada</p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-scesi-red-light-active">Validación manual lista</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight">Acerca el código QR</h2>
          <p className="mt-3 text-xs leading-relaxed text-scesi-grey-light-active/80">También puedes introducir el código de la entrada manualmente.</p>
          <form onSubmit={validate} className="mt-6">
            <label htmlFor="access-code" className="sr-only">Código de la entrada</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
              <input
                id="access-code"
                name="accessCode"
                value={code}
                onChange={(event) => { setCode(event.target.value); setEntry(null); setError(""); setMessage(""); }}
                placeholder="SC-0000"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "access-error" : "access-demo-help"}
                className="h-12 min-w-0 flex-1 rounded-lg border border-scesi-grey-light-active/30 bg-scesi-grey-normal px-3 text-sm outline-none placeholder:text-scesi-grey-light-active/60 focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal sm:rounded-r-none"
              />
              <button type="submit" className="h-12 rounded-lg bg-scesi-red-normal px-5 text-xs font-medium text-white hover:bg-scesi-red-normal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-light sm:rounded-l-none">Validar</button>
            </div>
            {error && <p id="access-error" role="alert" className="mt-3 text-sm text-scesi-red-light-active">{error}</p>}
          </form>
          <p id="access-demo-help" className="mt-3 text-xs text-scesi-grey-light-active/60">Demo: {eventId === "programming-day-2025" ? "SC-1001" : "SC-0311"}. Los movimientos se conservan durante esta sesión.</p>

          {entry && (
            <div className="mt-5 rounded-lg border border-scesi-grey-light-active/30 p-4">
              <div role="status">
                <p className="text-sm font-semibold">{entry.name}</p>
                <p className="mt-1 text-xs text-scesi-grey-light-active">{entry.code} · Entrada confirmada</p>
                <p className="mt-2 text-xs text-scesi-grey-light">{isPresent ? `Dentro del evento · ingreso ${checkIns[entry.id]}` : checkOuts[entry.id] ? `Salida registrada a las ${checkOuts[entry.id]}` : "Sin ingreso registrado"}</p>
              </div>
              <button type="button" onClick={register} className="mt-4 rounded-lg bg-scesi-red-normal px-4 py-3 text-xs font-medium text-white hover:bg-scesi-red-normal-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-light">{isPresent ? "Registrar salida" : "Registrar ingreso"}</button>
            </div>
          )}
          <p role="status" className="mt-3 text-sm text-scesi-green-light">{message}</p>
        </div>
      </section>
    </div>
  );
}
