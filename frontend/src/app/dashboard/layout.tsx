import type { ReactNode } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <SidebarShell preset="participant">{children}</SidebarShell>;
}
