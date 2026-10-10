import type { AttendeeStatus } from "./attendees";
import { staffSchedules } from "./staff-schedule";
import { staffAttendees } from "./staff-attendees";

export type AccessEntry = {
  id: string;
  name: string;
  code: string;
  eventId: string;
  status: AttendeeStatus;
};

export const accessEvents = staffSchedules.map(({ eventId, title }) => ({ id: eventId, title }));

/** Validación y tabla comparten una única fuente de entradas por evento. */
export const accessEntries: AccessEntry[] = staffAttendees.map(
  ({ id, name, code, eventId, status }) => ({ id, name, code, eventId, status }),
);

type AccessValidation = { ok: true; entry: AccessEntry } | { ok: false; message: string };

export function validateAccessCode(code: string, eventId: string): AccessValidation {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { ok: false, message: "Introduce el código de la entrada." };
  const entry = accessEntries.find((item) => item.code === normalized && item.eventId === eventId);
  if (!entry) {
    return {
      ok: false,
      message: accessEntries.some((item) => item.code === normalized)
        ? "La entrada corresponde a otro evento. Revisa el evento seleccionado."
        : "No se encontró una entrada con ese código.",
    };
  }
  if (entry.status !== "confirmed") {
    return { ok: false, message: entry.status === "pending" ? "Esta inscripción está pendiente de confirmación." : "Esta persona está en lista de espera." };
  }
  return { ok: true, entry };
}
