import type { ReactNode } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return <SidebarShell preset="organizador">{children}</SidebarShell>;
}
