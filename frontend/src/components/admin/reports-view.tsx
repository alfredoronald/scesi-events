import { BarChart3, Check, Clock, Users, type LucideIcon } from "lucide-react";
import {
  attendanceGrowth,
  monthlyAttendance,
  monthlyAttendanceReport,
  reportCards,
  reportDatasets,
  totalAttendance,
  type ReportKind,
} from "@/config/admin-reports";
import { cn } from "@/lib/cn";
import { ReportDownloadButton } from "./report-download-button";

const icons: Record<ReportKind, LucideIcon> = {
  attendance: Check,
  participation: Users,
  ratings: BarChart3,
  staff: Clock,
};

export function AdminReportsView() {
  const maximumAttendance = Math.max(...monthlyAttendance.map((month) => month.count));

  return (
    <div>
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
          <p className="text-xs font-medium text-scesi-green-normal" aria-label={`Crecimiento del ${attendanceGrowth}% respecto al período anterior`}>+{attendanceGrowth}%</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <figure aria-label="Asistencia mensual de enero a noviembre de 2025" className="min-w-[460px]">
            <div aria-hidden="true" className="grid h-40 grid-cols-11 items-end gap-2 border-b border-scesi-grey-light sm:h-48">
              {monthlyAttendance.map(({ month, count }, index) => (
                <div
                  key={month}
                  title={`${month}: ${count} asistencias`}
                  className={cn("rounded-t-sm", index >= monthlyAttendance.length - 3 ? "bg-scesi-red-normal" : "bg-scesi-red-light-active")}
                  style={{ height: `${count / maximumAttendance * 100}%` }}
                />
              ))}
            </div>
            <div aria-hidden="true" className="mt-3 grid grid-cols-11 gap-2 text-center text-[10px] text-scesi-grey-normal/50">
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
