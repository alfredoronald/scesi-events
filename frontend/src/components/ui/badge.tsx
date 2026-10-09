import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "red" | "neutral" | "blue" | "green";

const variants: Record<BadgeVariant, string> = {
  red: "bg-scesi-red-light text-scesi-red-normal",
  neutral: "bg-scesi-grey-light text-scesi-grey-normal",
  blue: "bg-scesi-blue-light text-scesi-blue-normal",
  green: "bg-scesi-green-light text-scesi-green-normal",
};

/** Pill de estado: "Inscripción confirmada", "Organizado por SCESI", etc. */
export function Badge({
  children,
  variant = "red",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "text-[11px] font-semibold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
