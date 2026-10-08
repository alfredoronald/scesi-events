"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SidebarState = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

/**
 * Estado compartido entre el disparador (botón hamburguesa, normalmente en el
 * topbar) y el drawer móvil. Va dentro del árbol de cliente; los componentes
 * Server que lo rodean siguen siendo Server.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer, toggle }),
    [open, openDrawer, closeDrawer, toggle],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarState {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within <SidebarProvider>");
  }
  return context;
}
