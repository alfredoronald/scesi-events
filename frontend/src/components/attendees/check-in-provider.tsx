"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { attendees } from "@/config/attendees";

type CheckInMap = Record<string, string>;

type CheckInContextValue = {
  /** attendeeId → hora de ingreso ("HH:MM"). */
  checkIns: CheckInMap;
  /** attendeeId → hora de salida ("HH:MM"). */
  checkOuts: CheckInMap;
  checkIn: (attendeeId: string, time: string) => void;
  checkOut: (attendeeId: string, time: string) => void;
};

/** Semilla desde el mock: solo los asistentes con checkedInAt. */
const seedCheckIns: CheckInMap = Object.fromEntries(
  attendees.flatMap((attendee) =>
    attendee.checkedInAt ? [[attendee.id, attendee.checkedInAt] as const] : [],
  ),
);

/** Semilla desde el mock: solo los asistentes con checkedOutAt. */
const seedCheckOuts: CheckInMap = Object.fromEntries(
  attendees.flatMap((attendee) =>
    attendee.checkedOutAt ? [[attendee.id, attendee.checkedOutAt] as const] : [],
  ),
);

/** Valor por defecto: la vista funciona aunque no haya provider (sin mutación). */
const CheckInContext = createContext<CheckInContextValue>({
  checkIns: seedCheckIns,
  checkOuts: seedCheckOuts,
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

  const value = useMemo<CheckInContextValue>(
    () => ({
      checkIns,
      checkOuts,
      checkIn: (attendeeId, time) => {
        setCheckIns((previous) => ({ ...previous, [attendeeId]: time }));
        // Un reingreso inicia una nueva presencia y elimina la salida anterior.
        setCheckOuts((previous) => {
          if (!previous[attendeeId]) return previous;
          const next = { ...previous };
          delete next[attendeeId];
          return next;
        });
      },
      checkOut: (attendeeId, time) =>
        setCheckOuts((previous) => ({ ...previous, [attendeeId]: time })),
    }),
    [checkIns, checkOuts],
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIns(): CheckInContextValue {
  return useContext(CheckInContext);
}
