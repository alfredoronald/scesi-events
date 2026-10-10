"use client";

import { useAuth } from "@/components/auth/auth-provider";

export function SidebarViewSwitcher() {
  const { user } = useAuth();
  const labels = { ADMIN: "Administrador", ORGANIZADOR: "Organizador", STAFF: "Staff", PARTICIPANTE: "Participante" };
  return <div className="mb-4 rounded-lg bg-scesi-grey-dark px-3 py-3 text-sm text-white">{user ? labels[user.rol] : "Sesión"}</div>;
}
