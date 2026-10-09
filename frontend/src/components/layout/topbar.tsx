"use client";

import { usePathname } from "next/navigation";
import { participant } from "@/config/dashboard";
import {
  adminNav,
  organizerNav,
  participantNav,
  staffNav,
} from "@/config/navigation";
import { Avatar } from "@/components/ui/avatar";

/** Todas las vistas, en orden de prioridad (participante primero). */
const allNavs = [...participantNav, ...organizerNav, ...staffNav, ...adminNav];

/** Deriva el título de la sección desde la ruta + la config de navegación. */
function titleForPath(pathname: string): string {
  const item = allNavs.find(({ href, exact }) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`),
  );
  return item?.label ?? "Resumen";
}

export function Topbar() {
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <header className="sticky top-16 z-20 flex h-16 items-center justify-between gap-4 border-b border-scesi-grey-dark bg-scesi-grey-normal px-5 sm:px-8 lg:top-0">
      <p className="truncate text-base font-medium text-white sm:text-lg">{title}</p>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm leading-tight font-medium text-white">
            {participant.name}
          </p>
          <p className="text-xs text-scesi-grey-light-active">{participant.role}</p>
        </div>
        <Avatar initials={participant.initials} />
      </div>
    </header>
  );
}
