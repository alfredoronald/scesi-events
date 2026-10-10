"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import {
  sidebarPresets,
  type SidebarConfig,
  type SidebarPresetKey,
} from "@/config/navigation";
import { cn } from "@/lib/cn";
import { SidebarDrawer } from "./sidebar-drawer";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarViewSwitcher } from "./sidebar-view-switcher";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Topbar } from "./topbar";
import { RoleGuard } from "@/components/auth/auth-provider";
import type { User } from "@/lib/api";

function SidebarHeader({ logo }: { logo?: SidebarConfig["logo"] }) {
  const { open, toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-scesi-grey-dark bg-scesi-grey-normal px-5 lg:hidden">
      <Link href="/dashboard" aria-label="SCESI Events, inicio">
        {logo && (
          <Image src={logo.src} alt={logo.alt} width={47} height={32} priority />
        )}
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-controls="sidebar-drawer"
        aria-expanded={open}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg text-scesi-grey-light outline-none",
          "transition-colors hover:bg-scesi-grey-dark focus-visible:ring-2 focus-visible:ring-scesi-red-light",
        )}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  );
}

function DesktopSidebar({ config }: { config: SidebarConfig }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-scesi-grey-dark bg-scesi-grey-normal lg:flex">
      <Link
        href="/dashboard"
        aria-label="SCESI Events, inicio"
        className="flex h-20 shrink-0 items-center border-b border-scesi-grey-dark px-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scesi-red-light"
      >
        {config.logo && (
          <Image
            src={config.logo.src}
            alt={config.logo.alt}
            width={47}
            height={32}
            priority
          />
        )}
      </Link>
      <nav
        aria-label="Navegación principal"
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6"
      >
        {config.sectionLabel && (
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-widest text-scesi-grey-light-active">
            {config.sectionLabel}
          </p>
        )}
        {config.items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </nav>
      <p className="px-6 pb-3 text-xs text-scesi-grey-light-active">
        Eventos para aprender y conectar
      </p>
      {config.footer && (
        <SidebarFooter footer={config.footer}>
          <SidebarViewSwitcher />
        </SidebarFooter>
      )}
    </aside>
  );
}

export function SidebarShell({
  preset,
  children,
}: {
  preset: SidebarPresetKey;
  children: ReactNode;
}) {
  const config = sidebarPresets[preset];
  const roles: Record<SidebarPresetKey, User["rol"]> = { participant: "PARTICIPANTE", organizador: "ORGANIZADOR", staff: "STAFF", admin: "ADMIN" };

  return (
    <RoleGuard role={roles[preset]}><SidebarProvider>
      <div className="min-h-dvh bg-scesi-grey-light">
        <DesktopSidebar config={config} />
        <SidebarHeader logo={config.logo} />
        <SidebarDrawer {...config} />
        <main className="min-h-[calc(100dvh-4rem)] bg-white lg:ml-64 lg:min-h-dvh">
          <Topbar />
          {children}
        </main>
      </div>
    </SidebarProvider></RoleGuard>
  );
}
