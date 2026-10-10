import { attendees, type AttendeeStatus } from "./attendees";

export type StaffAttendee = {
  id: string;
  name: string;
  code: string;
  eventId: string;
  status: AttendeeStatus;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  lastRecord: string;
};

const programmingEventId = "programming-day-2025";
const featured: StaffAttendee[] = [
  { id: "pd-andrea", name: "Andrea Mendoza", code: "SC-0284", eventId: programmingEventId, status: "confirmed", checkedInAt: "09:42", checkedOutAt: null, lastRecord: "Ingreso principal" },
  { id: "pd-diego", name: "Diego Salazar", code: "SC-0192", eventId: programmingEventId, status: "confirmed", checkedInAt: "09:31", checkedOutAt: null, lastRecord: "Auditorio A" },
  { id: "pd-maria", name: "María Rojas", code: "SC-0311", eventId: programmingEventId, status: "confirmed", checkedInAt: "08:55", checkedOutAt: "10:20", lastRecord: "Salida principal" },
  { id: "pd-luis", name: "Luis Torrico", code: "SC-0174", eventId: programmingEventId, status: "pending", checkedInAt: null, checkedOutAt: null, lastRecord: "Sin actividad" },
];

const names = ["Valeria", "Rodrigo", "Camila", "Jorge", "Fernanda", "Miguel", "Gabriela", "Iván", "Paula", "Héctor", "Daniela", "Óscar", "Bruno", "Sofía", "Kevin", "Nayeli"];
const surnames = ["Vargas", "Quispe", "Flores", "Mamani", "Céspedes", "Aguilar", "Ríos", "Sejas", "Villarroel", "Molina", "Ayala", "Cruz", "Soto", "Miranda", "Torrico", "Poma"];

/** Dataset demo determinista: 184 dentro, 12 salieron y 52 sin ingreso. */
const remaining: StaffAttendee[] = Array.from({ length: 244 }, (_, index) => {
  const entered = index < 193;
  const exited = index >= 182 && index < 193;
  return {
    id: `pd-${String(index + 5).padStart(3, "0")}`,
    name: `${names[index % names.length]} ${surnames[Math.floor(index / names.length) % surnames.length]}`,
    code: `SC-${String(400 + index).padStart(4, "0")}`,
    eventId: programmingEventId,
    status: entered ? "confirmed" : index === 243 ? "waitlist" : "pending",
    checkedInAt: entered ? `09:${String(index % 60).padStart(2, "0")}` : null,
    checkedOutAt: exited ? `10:${String(index % 60).padStart(2, "0")}` : null,
    lastRecord: exited ? "Salida principal" : entered ? "Ingreso principal" : "Sin actividad",
  };
});

/** Hackathon conserva los mismos ids y datos que el roster del organizador. */
export const staffAttendees: StaffAttendee[] = [
  ...featured,
  ...remaining,
  ...attendees.map(({ id, name, code, eventId, status, checkedInAt, checkedOutAt }) => ({
    id, name, code, eventId, status, checkedInAt, checkedOutAt,
    lastRecord: checkedOutAt ? "Salida principal" : checkedInAt ? "Ingreso principal" : "Sin actividad",
  })),
];

export type AttendanceState = "inside" | "exited" | "not-entered";

export function getAttendanceState(checkInTime?: string, checkOutTime?: string): AttendanceState {
  if (checkOutTime) return "exited";
  return checkInTime ? "inside" : "not-entered";
}
