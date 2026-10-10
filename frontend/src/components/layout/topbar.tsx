"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import {
  adminNav,
  organizerNav,
  participantNav,
  staffNav,
} from "@/config/navigation";
import { Avatar } from "@/components/ui/avatar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

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
  // usePathname se suspende al generar el shell de rutas con params dinámicos
  // (Cache Components): la lectura vive en la hoja y el boundary aquí.
  return (
    <Suspense
      fallback={
        <header className="sticky top-16 z-20 flex h-16 items-center border-b border-scesi-grey-dark bg-scesi-grey-normal px-5 sm:px-8 lg:top-0" />
      }
    >
      <TopbarContent />
    </Suspense>
  );
}

function TopbarContent() {
  const { user } = useAuth();
  const pathname = usePathname();
  const title = titleForPath(pathname);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <AdminTopbar title={title} />;
  }

  const isStaff = pathname === "/staff" || pathname.startsWith("/staff/");
  const profile = { name: user?.nombreCompleto ?? "", role: user?.rol ?? "", initials: user?.nombreCompleto.split(" ").slice(0, 2).map((part) => part[0]).join("") ?? "" };

  return (
    <header className="sticky top-16 z-20 flex h-16 items-center justify-between gap-4 border-b border-scesi-grey-dark bg-scesi-grey-normal px-5 sm:px-8 lg:top-0">
      <p className="truncate text-base font-medium text-white sm:text-lg">{title}</p>

      <div className={isStaff ? "flex flex-row-reverse items-center gap-3" : "flex items-center gap-3"}>
        <div className="hidden text-right sm:block">
          <p className="text-sm leading-tight font-medium text-white">
            {profile.name}
          </p>
          <p className="text-xs text-scesi-grey-light-active">{profile.role}</p>
        </div>
        <Avatar initials={profile.initials} />
      </div>
    </header>
  );
}
