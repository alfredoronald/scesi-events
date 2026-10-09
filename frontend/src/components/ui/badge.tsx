import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Pill de estado: "Inscripción confirmada", "Organizado por SCESI", etc. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-scesi-red-light px-3 py-1",
        "text-[11px] font-semibold uppercase tracking-wider text-scesi-red-normal",
        className,
      )}
    >
      {children}
    </span>
  );
}
