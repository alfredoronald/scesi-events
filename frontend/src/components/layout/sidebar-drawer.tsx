"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SidebarConfig } from "@/config/navigation";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useSidebar } from "./sidebar-context";

/** Drawer móvil del sidebar: overlay + panel deslizante (&lt; lg). */
export function SidebarDrawer({ items, logo, footer }: SidebarConfig) {
  const { open, closeDrawer } = useSidebar();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Cierra al cambiar de ruta.
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Escape + bloqueo de scroll del body mientras está abierto.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = () =>
      drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
    focusableElements()?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = focusableElements();
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, closeDrawer]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity motion-reduce:transition-none lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id="sidebar-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-scesi-grey-dark",
          "bg-scesi-grey-normal transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        ref={drawerRef}
      >
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          {logo && (
            <Image
              src={logo.src}
              alt={logo.alt}
              width={47}
              height={32}
              priority
            />
          )}
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar menú"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg outline-none",
              "text-scesi-grey-light transition-colors hover:bg-scesi-grey-dark hover:text-white",
              "focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal",
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2"
        >
          {items.map((item) => (
            <SidebarNavItem key={item.href} item={item} onNavigate={closeDrawer} />
          ))}
        </nav>

        {footer && <SidebarFooter footer={footer} />}
      </div>
    </>
  );
}
