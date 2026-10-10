"use client";
import { useState } from "react";
import { useResource } from "@/components/auth/use-resource";
import { useAuth } from "@/components/auth/auth-provider";
import type { ApiEvent } from "@/lib/backend-types";

export type AttendanceRow = { id: string; nombreCompleto: string; email: string; codigo: string; eventId: string; estadoPago: string; comprobanteUrl: string | null; createdAt: string; checkedInAt: string | null; checkedOutAt: string | null; lastRecord: string | null };
export function timeLabel(date: string | null) {
  return date ? new Date(date).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit", timeZone: "America/La_Paz" }) : "";
}
export function useAttendance() {
  const { user } = useAuth();
  const events = useResource<ApiEvent[]>(user?.rol === "STAFF" ? "/eventos?staff=true" : "/eventos?mios=true", [], true);
  const [selected, setEventId] = useState("");
  const eventId = selected || events.data[0]?.id || "";
  const resource = useResource<AttendanceRow[]>(eventId ? `/eventos/${eventId}/asistencia` : null, [], true);
  // A changed selection must not display the previous event's roster.
  const roster = resource.data.filter((row) => row.eventId === eventId);
  const checkIns = Object.fromEntries(roster.map((row) => [row.id, timeLabel(row.checkedInAt)]));
  const checkOuts = Object.fromEntries(roster.map((row) => [row.id, timeLabel(row.checkedOutAt)]));
  const lastRecords = Object.fromEntries(roster.map((row) => [row.id, row.lastRecord ?? "Sin actividad"]));
  return { events, eventId, setEventId, resource, roster, checkIns, checkOuts, lastRecords };
}
