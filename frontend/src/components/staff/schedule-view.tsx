"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { staffSchedules, shiftStatusLabels, type ShiftStatus, type StaffScheduleDay } from "@/config/staff-schedule";
import { cn } from "@/lib/cn";

const statusClasses: Record<ShiftStatus, string> = {
  completed: "bg-scesi-blue-light text-scesi-blue-normal",
  ongoing: "bg-scesi-red-light text-scesi-red-normal",
  pending: "bg-scesi-amber-light text-scesi-amber-normal",
};

export function StaffScheduleView() {
  const [eventId, setEventId] = useState(staffSchedules[0].eventId);
  const [dayId, setDayId] = useState<StaffScheduleDay["id"]>("today");
  const schedule = staffSchedules.find((item) => item.eventId === eventId) ?? staffSchedules[0];
  const day = schedule.days.find((item) => item.id === dayId) ?? schedule.days[0];

  return (
    <div>
      <h1 className="text-title text-scesi-grey-normal md:text-display">Mi horario</h1>
      <p className="mt-2 text-body text-scesi-grey-normal/65">Consulta tus turnos, espacios y responsabilidades asignadas.</p>
      <label htmlFor="staff-schedule-event" className="sr-only">Evento de tus turnos</label>
      <select
        id="staff-schedule-event"
        value={eventId}
        onChange={(event) => { setEventId(event.target.value); setDayId("today"); }}
        className="mt-2 h-11 w-full rounded-lg border border-scesi-grey-light-active/50 bg-white px-3 text-base text-scesi-grey-normal outline-none focus:border-scesi-red-normal focus:ring-2 focus:ring-scesi-red-normal/20"
      >
        {staffSchedules.map((item) => <option key={item.eventId} value={item.eventId}>{item.title}</option>)}
      </select>

      <div role="group" aria-label="Día del cronograma" className="mt-6 flex flex-wrap gap-2">
        {schedule.days.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={day.id === item.id}
            aria-controls="staff-day-schedule"
            onClick={() => setDayId(item.id)}
            className={cn("rounded-lg border px-4 py-3 text-[10px] font-medium uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scesi-red-normal", day.id === item.id ? "border-scesi-grey-normal bg-scesi-grey-normal text-white" : "border-scesi-grey-light-active/50 bg-white text-scesi-grey-normal/60 hover:bg-scesi-grey-light")}
          >
            {item.label} · {item.day} {item.month}
          </button>
        ))}
      </div>

      <section id="staff-day-schedule" aria-label={`Turnos del ${day.day} ${day.month}, ${day.weekday}`} className="mt-4 flex flex-col overflow-hidden rounded-xl border border-scesi-grey-light-active/30 bg-white sm:flex-row">
        <div className="flex shrink-0 items-center justify-center gap-4 bg-scesi-grey-normal px-6 py-6 text-white sm:w-36 sm:flex-col sm:justify-start sm:gap-3 sm:py-8">
          <p className="text-5xl font-semibold leading-none">{day.day}</p>
          <div className="text-[10px] uppercase tracking-widest text-scesi-grey-light-active"><p>{day.month}</p><p className="mt-1">{day.weekday}</p></div>
        </div>
        <div className="min-w-0 flex-1 p-3 sm:px-6 sm:py-2">
          {day.shifts.length ? (
            <ul>
              {day.shifts.map((shift) => (
                <li key={shift.id} className={cn("flex flex-wrap items-center gap-4 border-b border-l-2 px-3 py-6 sm:flex-nowrap sm:gap-6", shift.status === "ongoing" ? "border-b-scesi-red-normal border-l-scesi-red-normal bg-scesi-red-light/50" : "border-b-scesi-grey-light border-l-transparent")}>
                  <span className="shrink-0 text-xs font-medium text-scesi-red-normal"><time>{shift.start}</time>–<time>{shift.end}</time></span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-medium text-scesi-grey-normal">{shift.title}</h2>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-scesi-grey-normal/60"><MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />{shift.location}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-md px-3 py-2 text-[10px] font-semibold uppercase tracking-widest sm:ml-auto sm:min-w-24 sm:text-center", statusClasses[shift.status])}>{shiftStatusLabels[shift.status]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="px-4 py-14 text-center text-sm text-scesi-grey-normal/65">No tienes turnos asignados para este día.</div>
          )}
        </div>
      </section>
    </div>
  );
}
