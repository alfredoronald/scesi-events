"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { staffAttendees } from "@/config/staff-attendees";

type CheckInMap = Record<string, string>;

type CheckInContextValue = {
  /** attendeeId → hora de ingreso ("HH:MM"). */
  checkIns: CheckInMap;
  /** attendeeId → hora de salida ("HH:MM"). */
  checkOuts: CheckInMap;
  /** attendeeId → punto del último movimiento. */
  lastRecords: Record<string, string>;
  checkIn: (attendeeId: string, time: string, checkpoint?: string) => void;
  checkOut: (attendeeId: string, time: string, checkpoint?: string) => void;
};

/** Semilla desde el mock: solo los asistentes con checkedInAt. */
const seedCheckIns: CheckInMap = Object.fromEntries(
  staffAttendees.flatMap((attendee) =>
    attendee.checkedInAt ? [[attendee.id, attendee.checkedInAt] as const] : [],
  ),
);

/** Semilla desde el mock: solo los asistentes con checkedOutAt. */
const seedCheckOuts: CheckInMap = Object.fromEntries(
  staffAttendees.flatMap((attendee) =>
    attendee.checkedOutAt ? [[attendee.id, attendee.checkedOutAt] as const] : [],
  ),
);

const seedLastRecords = Object.fromEntries(
  staffAttendees.map((attendee) => [attendee.id, attendee.lastRecord]),
);

/** Valor por defecto: la vista funciona aunque no haya provider (sin mutación). */
const CheckInContext = createContext<CheckInContextValue>({
  checkIns: seedCheckIns,
  checkOuts: seedCheckOuts,
  lastRecords: seedLastRecords,
  checkIn: () => {},
  checkOut: () => {},
});

/**
 * Estado compartido de check-in/check-out de la app (raíz). Control de acceso
 * llamará `checkIn()`/`checkOut()` y Asistentes lo reflejará en vivo.
 */
export function CheckInProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<CheckInMap>(seedCheckIns);
  const [checkOuts, setCheckOuts] = useState<CheckInMap>(seedCheckOuts);
  const [lastRecords, setLastRecords] = useState<Record<string, string>>(seedLastRecords);

  const value = useMemo<CheckInContextValue>(
    () => ({
      checkIns,
      checkOuts,
      lastRecords,
      checkIn: (attendeeId, time, checkpoint = "Ingreso principal") => {
        setCheckIns((previous) => ({ ...previous, [attendeeId]: time }));
        setLastRecords((previous) => ({ ...previous, [attendeeId]: checkpoint }));
        // Un reingreso inicia una nueva presencia y elimina la salida anterior.
        setCheckOuts((previous) => {
          if (!previous[attendeeId]) return previous;
          const next = { ...previous };
          delete next[attendeeId];
          return next;
        });
      },
      checkOut: (attendeeId, time, checkpoint = "Salida principal") => {
        setCheckOuts((previous) => ({ ...previous, [attendeeId]: time }));
        setLastRecords((previous) => ({ ...previous, [attendeeId]: checkpoint }));
      },
    }),
    [checkIns, checkOuts, lastRecords],
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIns(): CheckInContextValue {
  return useContext(CheckInContext);
}
