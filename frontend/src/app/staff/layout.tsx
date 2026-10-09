import type { ReactNode } from "react";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { CheckInProvider } from "@/components/staff/check-in-provider";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <CheckInProvider>
      <SidebarShell preset="staff">{children}</SidebarShell>
    </CheckInProvider>
  );
}
