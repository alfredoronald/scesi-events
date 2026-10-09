"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { availableViews } from "@/config/navigation";
import { cn } from "@/lib/cn";

/** Switcher de vista por rol (Participante / Organizador / Staff / Administrador). */
export function SidebarViewSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const current =
    availableViews.find((view) =>
      pathname === view.href || pathname.startsWith(`${view.href}/`),
    ) ?? availableViews[0];

  return (
    <div className="mb-4">
      <label
        htmlFor="view-switcher"
        className="block px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-scesi-grey-light-active"
      >
        Cambiar vista
      </label>
      <div className="relative">
        <select
          id="view-switcher"
          value={current.href}
          onChange={(event) => router.push(event.target.value)}
          className={cn(
            "h-11 w-full cursor-pointer appearance-none rounded-lg border border-scesi-grey-dark bg-scesi-grey-dark",
            "pl-3 pr-10 text-sm font-medium text-white outline-none transition-colors",
            "hover:border-scesi-grey-light-active/40",
            "focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal",
          )}
        >
          {availableViews.map((view) => (
            <option key={view.href} value={view.href}>
              {view.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scesi-grey-light-active"
        />
      </div>
    </div>
  );
}
