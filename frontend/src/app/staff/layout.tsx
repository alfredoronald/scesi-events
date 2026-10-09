import type { ReactNode } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <SidebarShell preset="staff">{children}</SidebarShell>;
}
