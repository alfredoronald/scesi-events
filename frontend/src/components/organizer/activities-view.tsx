"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import {
  activitySchedule,
  type ActivityRecord,
} from "@/config/organizer-activities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Actividad vigente según la hora del día (la fecha del cronograma no se
 * compara, para que el mock se resalte en cualquier fecha):
 * - antes de la primera → la próxima (la primera);
 * - después → la última que ya empezó (sigue vigente hasta la siguiente).
 */
function computeActiveId(
  activities: ActivityRecord[],
  nowMinutes: number,
): string | null {
  if (activities.length === 0) return null;
  if (toMinutes(activities[0].time) > nowMinutes) return activities[0].id;

  let active = activities[activities.length - 1];
  for (const activity of activities) {
    if (toMinutes(activity.time) <= nowMinutes) active = activity;
  }
  return active.id;
}

/** Vista "Actividades": cronograma por día con la actividad vigente resaltada. */
export function ActivitiesView() {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  // Se calcula tras el mount (evita hydration mismatch) y se refresca cada30 s.
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-title text-scesi-grey-normal md:text-display">
            Actividades
          </h1>
          <p className="mt-3 text-body text-scesi-grey-normal/70">
            Organiza charlas, talleres y responsables dentro del cronograma.
          </p>
        </div>
        <Button href="/organizador/actividades/nueva" className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nueva actividad
        </Button>
      </div>

      {/* Cronograma */}
      <div className="mt-8 overflow-hidden rounded-xl border border-scesi-grey-light-active bg-white">
        {activitySchedule.map((day) => {
          const activeId =
            nowMinutes === null
              ? null
              : computeActiveId(day.activities, nowMinutes);

          return (
            <div key={`${day.day}-${day.month}`} className="flex flex-col sm:flex-row">
              {/* Bloque de fecha */}
              <div className="flex items-center justify-center gap-3 bg-scesi-grey-darker px-6 py-4 text-white sm:w-36 sm:flex-col sm:gap-1 sm:py-10">
                <span className="text-4xl font-bold leading-none sm:text-5xl">
                  {day.day}
                </span>
                <span className="text-xs font-semibold tracking-[0.2em]">
                  {day.month}
                </span>
                <span className="text-[10px] tracking-[0.2em] text-white/60">
                  {day.weekday}
                </span>
              </div>

              {/* Actividades del día */}
              <ul className="flex-1 divide-y divide-scesi-grey-light-active">
                {day.activities.map((activity) => {
                  const isActive = activity.id === activeId;
                  return (
                    <li key={activity.id}>
                      <div
                        className={cn(
                          "flex items-center gap-4 border-l-4 px-5 py-4 sm:gap-6 sm:px-6",
                          isActive
                            ? "border-scesi-red-normal bg-scesi-red-light"
                            : "border-transparent",
                        )}
                      >
                        <time className="w-14 shrink-0 text-sm font-semibold text-scesi-red-normal">
                          {activity.time}
                        </time>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-scesi-grey-normal">
                            {activity.title}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-scesi-grey-normal/70">
                            <MapPin
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            {activity.location}
                          </p>
                        </div>
                        <span className="hidden shrink-0 text-sm text-scesi-grey-normal/70 md:block">
                          {activity.responsible}
                        </span>
                        <Link
                          href={`/organizador/actividades/${activity.id}`}
                          aria-label={`Ver ${activity.title}`}
                          className={cn(
                            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors outline-none",
                            "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2",
                            "border-scesi-grey-light-active text-scesi-grey-normal",
                            "hover:border-scesi-red-normal hover:bg-white hover:text-scesi-red-normal",
                          )}
                        >
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
