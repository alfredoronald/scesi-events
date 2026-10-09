import type { ReactNode } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SidebarShell preset="admin">{children}</SidebarShell>;
}
