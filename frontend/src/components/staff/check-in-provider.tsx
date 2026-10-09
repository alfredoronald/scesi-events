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
  checkIn: (attendeeId: string, time: string) => void;
};

const CheckInContext = createContext<CheckInContextValue | null>(null);

/** Semilla desde el mock: solo los asistentes con checkedInAt. */
const seedCheckIns: CheckInMap = Object.fromEntries(
  staffAttendees.flatMap((attendee) =>
    attendee.checkedInAt ? [[attendee.id, attendee.checkedInAt] as const] : [],
  ),
);

/**
 * Estado compartido de check-in del staff. La vista de Control de acceso
 * llamará `checkIn()` y la columna Ingreso de Asistentes lo reflejará en vivo.
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
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckIns debe usarse dentro de CheckInProvider");
  }
  return context;
}
