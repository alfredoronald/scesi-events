import { adminEvents } from "./admin-events";
import { adminUserAssignments, adminUserCounts } from "./admin-users";
import { averageRating, organizerComments, totalRatings } from "./organizer-comments";

export type ReportKind = "attendance" | "participation" | "ratings" | "staff";
export type ReportDataset = {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
};

/** Serie demo de enero a noviembre de 2025, común al gráfico y al CSV. */
export const monthlyAttendance = [
  { month: "Ene", count: 220 },
  { month: "Feb", count: 330 },
  { month: "Mar", count: 380 },
  { month: "Abr", count: 520 },
  { month: "May", count: 450 },
  { month: "Jun", count: 610 },
  { month: "Jul", count: 585 },
  { month: "Ago", count: 700 },
  { month: "Sep", count: 820 },
  { month: "Oct", count: 800 },
  { month: "Nov", count: 869 },
];

export const totalAttendance = monthlyAttendance.reduce((sum, month) => sum + month.count, 0);
const previousPeriodAttendance = 5176;
export const attendanceGrowth = ((totalAttendance - previousPeriodAttendance) / previousPeriodAttendance * 100).toFixed(1);

export const reportCards: { kind: ReportKind; title: string; description: string }[] = [
  { kind: "attendance", title: "Reporte de asistencia", description: "Ingresos, salidas y permanencia por evento" },
  { kind: "participation", title: "Participación anual", description: "Crecimiento y recurrencia de la comunidad" },
  { kind: "ratings", title: "Valoración de eventos", description: "Calificaciones, comentarios y charlas favoritas" },
  { kind: "staff", title: "Actividad del staff", description: "Turnos, horas e incidencias registradas" },
];

/** Informes demo; la asistencia por evento suma el mismo total que el gráfico. */
const baseAttendance = Math.floor(totalAttendance / adminEvents.length);
const attendanceRemainder = totalAttendance % adminEvents.length;

export const reportDatasets: Record<ReportKind, ReportDataset> = {
  attendance: {
    filename: "scesi-asistencia-eventos.csv",
    headers: ["Evento", "Ingresos", "Salidas", "Permanencia media (minutos)"],
    rows: adminEvents.map((event, index) => [event.title, baseAttendance + (index < attendanceRemainder ? 1 : 0), 12 + index, 120 + index % 5 * 15]),
  },
  participation: {
    filename: "scesi-participacion-anual.csv",
    headers: ["Año", "Participantes", "Organizadores", "Staff", "Administradores", "Participantes año anterior (demo)", "Crecimiento (%)", "Participantes recurrentes (demo)"],
    rows: [[2025, adminUserCounts.participant, adminUserCounts.organizer, adminUserCounts.staff, adminUserCounts.admin, 3070, ((adminUserCounts.participant - 3070) / 3070 * 100).toFixed(1), 930]],
  },
  ratings: {
    filename: "scesi-valoracion-eventos.csv",
    headers: ["Evento", "Calificaciones", "Promedio", "Autor", "Puntuación", "Comentario", "Charla favorita (demo)"],
    rows: organizerComments.map((comment) => ["Hackathon SCESI", totalRatings, averageRating.toFixed(1), comment.author, comment.score, comment.text, comment.id === "andrea-mendoza" ? "IA aplicada: de la idea al prototipo" : ""]),
  },
  staff: {
    filename: "scesi-actividad-staff.csv",
    headers: ["Equipo", "Personal", "Eventos asignados", "Turnos (demo)", "Horas (demo)", "Incidencias (demo)"],
    rows: [["Staff SCESI", adminUserCounts.staff, adminUserAssignments.staffedEvents, 128, 512, 3]],
  },
};

export const monthlyAttendanceReport: ReportDataset = {
  filename: "scesi-asistencia-mensual.csv",
  headers: ["Año", "Mes", "Asistencias"],
  rows: monthlyAttendance.map(({ month, count }) => [2025, month, count]),
};
