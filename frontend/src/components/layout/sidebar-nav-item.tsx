"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/config/navigation";

type SidebarNavItemProps = {
  item: NavItem;
  /** Cierra el drawer móvil al navegar. */
  onNavigate?: () => void;
};

export function SidebarNavItem(props: SidebarNavItemProps) {
  // usePathname se suspende en shells de rutas con params dinámicos;
  // el fallback muestra el ítem sin estado activo.
  return (
    <Suspense fallback={<NavItemLink {...props} isActive={false} />}>
      <ActiveNavItem {...props} />
    </Suspense>
  );
}

function ActiveNavItem({ item, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return <NavItemLink item={item} onNavigate={onNavigate} isActive={isActive} />;
}

function NavItemLink({
  item,
  onNavigate,
  isActive,
}: SidebarNavItemProps & { isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none",
        "text-scesi-grey-light hover:bg-scesi-grey-dark hover:text-white",
        "focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal",
        isActive &&
          "bg-scesi-red-normal text-white hover:bg-scesi-red-normal-hover active:bg-scesi-red-normal-active",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute -right-2.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-scesi-red-normal-hover"
        />
      )}
    </Link>
  );
}
