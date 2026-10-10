import type { Metadata } from "next";
import { AdminSettingsView } from "@/components/admin/settings-view";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Configura la información institucional y las preferencias del sistema.",
};

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <AdminSettingsView />
    </div>
  );
}
