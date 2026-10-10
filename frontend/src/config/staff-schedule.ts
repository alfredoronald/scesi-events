import { organizerEvents } from "./organizer-events";

export const staffProfile = { name: "Carlos Vargas", initials: "CV", role: "Staff" };

export type ShiftStatus = "completed" | "ongoing" | "pending";
export type StaffShift = {
  id: string;
  start: string;
  end: string;
  title: string;
  location: string;
  status: ShiftStatus;
};
export type StaffScheduleDay = {
  id: "today" | "tomorrow";
  label: string;
  day: number;
  month: string;
  weekday: string;
  shifts: StaffShift[];
};
export type StaffEventSchedule = {
  eventId: string;
  title: string;
  days: StaffScheduleDay[];
};

export const shiftStatusLabels: Record<ShiftStatus, string> = {
  completed: "Completado",
  ongoing: "En curso",
  pending: "Pendiente",
};

/** Fechas y estados demo del mock; Hoy/Mañana se refieren a este cronograma. */
const schedules: Omit<StaffEventSchedule, "title">[] = [
  {
    eventId: "programming-day-2025",
    days: [
      {
        id: "today", label: "Hoy", day: 28, month: "SEP", weekday: "DOMINGO",
        shifts: [
          { id: "registration", start: "08:00", end: "10:00", title: "Registro y acreditación", location: "Acceso principal", status: "completed" },
          { id: "auditorium", start: "10:00", end: "12:30", title: "Apoyo en sala principal", location: "Auditorio A", status: "ongoing" },
          { id: "lunch", start: "13:00", end: "14:00", title: "Control de almuerzo", location: "Patio central", status: "pending" },
          { id: "labs", start: "15:30", end: "18:00", title: "Supervisión de laboratorios", location: "Bloque B", status: "pending" },
        ],
      },
      {
        id: "tomorrow", label: "Mañana", day: 29, month: "SEP", weekday: "LUNES",
        shifts: [
          { id: "opening", start: "08:00", end: "09:30", title: "Preparación de salas", location: "Auditorio A", status: "pending" },
          { id: "workshops", start: "09:30", end: "12:30", title: "Apoyo en talleres", location: "Bloque B", status: "pending" },
          { id: "closing", start: "14:00", end: "16:00", title: "Apoyo en clausura", location: "Auditorio A", status: "pending" },
        ],
      },
    ],
  },
  {
    eventId: "hackathon-scesi",
    days: [
      {
        id: "today", label: "Hoy", day: 28, month: "SEP", weekday: "DOMINGO",
        shifts: [
          { id: "hackathon-access", start: "08:00", end: "10:00", title: "Control de acceso", location: "Acceso principal", status: "completed" },
          { id: "hackathon-mentors", start: "10:00", end: "13:00", title: "Apoyo a equipos y mentores", location: "Laboratorios 1–4", status: "ongoing" },
          { id: "hackathon-logistics", start: "14:00", end: "18:00", title: "Coordinación logística", location: "Patio central", status: "pending" },
        ],
      },
      { id: "tomorrow", label: "Mañana", day: 29, month: "SEP", weekday: "LUNES", shifts: [] },
    ],
  },
];

export const staffSchedules: StaffEventSchedule[] = schedules.map((schedule) => {
  const event = organizerEvents.find((item) => item.id === schedule.eventId);
  if (!event) throw new Error(`Evento desconocido para Mi horario: ${schedule.eventId}`);
  return { ...schedule, title: event.title };
});
