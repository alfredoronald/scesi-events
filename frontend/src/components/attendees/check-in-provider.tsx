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
  checkIn: (attendeeId: string, time: string) => void;
};

/** Semilla desde el mock: solo los asistentes con checkedInAt. */
const seedCheckIns: CheckInMap = Object.fromEntries(
  attendees.flatMap((attendee) =>
    attendee.checkedInAt ? [[attendee.id, attendee.checkedInAt] as const] : [],
  ),
);

/** Valor por defecto: la vista funciona aunque no haya provider (sin mutación). */
const CheckInContext = createContext<CheckInContextValue>({
  checkIns: seedCheckIns,
  checkIn: () => {},
});

/**
 * Estado compartido de check-in de la app (raíz). Control de acceso llamará
 * `checkIn()` y la columna Ingreso de Asistentes lo reflejará en vivo.
 */
export function CheckInProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<CheckInMap>(seedCheckIns);

  const value = useMemo<CheckInContextValue>(
    () => ({
      checkIns,
      checkIn: (attendeeId, time) =>
        setCheckIns((previous) => ({ ...previous, [attendeeId]: time })),
    }),
    [checkIns],
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIns(): CheckInContextValue {
  return useContext(CheckInContext);
}
