"use client";
import { BarChart3, Check, Clock, Users, type LucideIcon } from "lucide-react";
import {
  reportCards,
  type ReportDataset,
  type ReportKind,
} from "@/config/admin-reports";
import { cn } from "@/lib/cn";
import { ReportDownloadButton } from "./report-download-button";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";

const icons: Record<ReportKind, LucideIcon> = {
  attendance: Check,
  participation: Users,
  ratings: BarChart3,
  staff: Clock,
};

export function AdminReportsView() {
  const metrics = useResource<Array<{ titulo: string; inscritos: number; asistentes: number; participantes: number; promedioGeneral: number | null; certificados: number }>>("/metricas/eventos", []);
  const months = useResource<Array<{ mes: string; checkins: number }>>("/metricas/asistencias-mensuales", []);
  const staff = useResource<Array<{ nombre: string; eventos: number; ingresos: number }>>("/reportes/staff", []);
  const monthlyAttendance = months.data.map((row) => ({ month: row.mes, count: row.checkins }));
  const totalAttendance = monthlyAttendance.reduce((sum, row) => sum + row.count, 0);
  const last = monthlyAttendance[monthlyAttendance.length - 1]?.count ?? 0;
  const previous = monthlyAttendance[monthlyAttendance.length - 2]?.count ?? 0;
  const attendanceGrowth = previous ? ((last - previous) / previous * 100).toFixed(1) : null;
  const reportDatasets: Record<ReportKind, ReportDataset> = {
    attendance: { filename: "scesi-asistencia-eventos.csv", headers: ["Evento", "Inscritos", "Asistentes"], rows: metrics.data.map((row) => [row.titulo, row.inscritos, row.asistentes]) },
    participation: { filename: "scesi-participacion.csv", headers: ["Evento", "Participantes", "Certificados"], rows: metrics.data.map((row) => [row.titulo, row.participantes, row.certificados]) },
    ratings: { filename: "scesi-valoraciones.csv", headers: ["Evento", "Promedio"], rows: metrics.data.map((row) => [row.titulo, row.promedioGeneral ?? "Sin valoraciones"]) },
    staff: { filename: "scesi-staff.csv", headers: ["Staff", "Eventos asignados", "Ingresos registrados"], rows: staff.data.map((row) => [row.nombre, row.eventos, row.ingresos]) },
  };
  const monthlyAttendanceReport: ReportDataset = { filename: "scesi-asistencia-mensual.csv", headers: ["Mes", "Asistencias"], rows: monthlyAttendance.map((row) => [row.month, row.count]) };
  const maximumAttendance = Math.max(1, ...monthlyAttendance.map((month) => month.count));

  return (
    <div>
      <ResourceStatus {...metrics} /><ResourceStatus {...months} /><ResourceStatus {...staff} />
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-scesi-red-normal">Inteligencia de datos</p>
      <h1 className="mt-3 text-title text-scesi-grey-normal md:text-display">Reportes</h1>
      <p className="mt-2 text-body text-scesi-grey-normal/65">Genera informes consolidados sobre eventos, participación y comunidad.</p>

      <section aria-label="Informes disponibles" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map(({ kind, title, description }) => {
          const Icon = icons[kind];
          return (
            <article key={kind} className="flex min-h-56 flex-col rounded-xl border border-scesi-grey-light-active/50 bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-scesi-red-light text-scesi-red-normal">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="mt-6 text-base font-medium text-scesi-grey-normal">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-scesi-grey-normal/60">{description}</p>
              <ReportDownloadButton report={reportDatasets[kind]} />
            </article>
          );
        })}
      </section>

      <section aria-labelledby="monthly-attendance-heading" className="mt-4 rounded-xl border border-scesi-grey-light-active/50 bg-white p-5 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-scesi-grey-normal/50">Vista consolidada</p>
            <h2 id="monthly-attendance-heading" className="mt-2 text-base font-medium text-scesi-grey-normal">Asistencia mensual en todos los eventos</h2>
          </div>
          <ReportDownloadButton report={monthlyAttendanceReport} compact />
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <p className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-scesi-grey-normal">{totalAttendance.toLocaleString("en-US")}</span>
            <span className="text-xs text-scesi-grey-normal/60">asistencias acumuladas</span>
          </p>
          <p className="text-xs font-medium text-scesi-green-normal">{attendanceGrowth === null ? "Sin período anterior" : `${Number(attendanceGrowth) >= 0 ? "+" : ""}${attendanceGrowth}% respecto al mes anterior`}</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <figure aria-label="Asistencia mensual" className="min-w-[460px]">
            <div aria-hidden="true" className="grid h-40 items-end gap-2 border-b border-scesi-grey-light sm:h-48" style={{ gridTemplateColumns: `repeat(${Math.max(1, monthlyAttendance.length)}, minmax(0, 1fr))` }}>
              {monthlyAttendance.map(({ month, count }, index) => (
                <div
                  key={month}
                  title={`${month}: ${count} asistencias`}
                  className={cn("rounded-t-sm", index >= monthlyAttendance.length - 3 ? "bg-scesi-red-normal" : "bg-scesi-red-light-active")}
                  style={{ height: `${count / maximumAttendance * 100}%` }}
                />
              ))}
            </div>
            <div aria-hidden="true" className="mt-3 grid gap-2 text-center text-[10px] text-scesi-grey-normal/50" style={{ gridTemplateColumns: `repeat(${Math.max(1, monthlyAttendance.length)}, minmax(0, 1fr))` }}>
              {monthlyAttendance.map(({ month }) => <span key={month}>{month}</span>)}
            </div>
            <figcaption className="sr-only">
              {monthlyAttendance.map(({ month, count }) => `${month}: ${count} asistencias`).join("; ")}.
              Total: {totalAttendance} asistencias. Crecimiento: {attendanceGrowth}%.
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
