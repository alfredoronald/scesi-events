import type { Metadata } from "next";
import { AdminUsersView } from "@/components/admin/users-view";

export const metadata: Metadata = {
  title: "Usuarios y roles",
  description: "Administra permisos y equipos dentro de la plataforma.",
};

export default function AdminUsersPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <AdminUsersView />
    </div>
  );
}
