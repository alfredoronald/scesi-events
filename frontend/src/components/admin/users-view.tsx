"use client";
import { BarChart3, Calendar, Check, Plus, Users } from "lucide-react";
import {
  adminUserRoleLabels,
} from "@/config/admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResource, ResourceStatus } from "@/components/auth/use-resource";
import { type User } from "@/lib/api";
import { formatDate } from "@/lib/backend-types";

export function AdminUsersView() {
  const resource = useResource<(User & { ultimoAcceso: string | null })[]>("/usuarios", [], true);
  const counts = useResource<Record<string, { total: number }>>("/usuarios/conteos", {});
  const adminUserCounts = { participant: counts.data.PARTICIPANTE?.total ?? 0, organizer: counts.data.ORGANIZADOR?.total ?? 0, staff: counts.data.STAFF?.total ?? 0, admin: counts.data.ADMIN?.total ?? 0 };
  const total = Object.values(adminUserCounts).reduce((sum, count) => sum + count, 0);
  const participantPercentage = total ? (adminUserCounts.participant / total * 100).toFixed(1) : "0";
  const roles = { ADMIN: "admin", ORGANIZADOR: "organizer", STAFF: "staff", PARTICIPANTE: "participant" } as const;
  const adminUsers = resource.data.map((user) => ({ id: user.id, name: user.nombreCompleto, email: user.email, role: roles[user.rol], lastAccess: user.ultimoAcceso ? formatDate(user.ultimoAcceso) : "Sin acceso", active: user.activo }));
const cards = [
  {
    label: "Participantes",
    value: adminUserCounts.participant.toLocaleString("en-US"),
    note: `${participantPercentage}% del total`,
    icon: Users,
  },
  {
    label: "Organizadores",
    value: String(adminUserCounts.organizer),
    note: "Gestión de eventos",
    icon: Calendar,
  },
  {
    label: "Staff",
    value: String(adminUserCounts.staff),
    note: "Control de acceso",
    icon: Check,
  },
  {
    label: "Administradores",
    value: String(adminUserCounts.admin).padStart(2, "0"),
    note: "Acceso completo",
    icon: BarChart3,
  },
];

  return (
    <div>
      <ResourceStatus {...resource} /><ResourceStatus {...counts} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-scesi-red-normal">
            Control de acceso
          </p>
          <h1 className="mt-3 text-title text-scesi-grey-normal md:text-display">
            Usuarios y roles
          </h1>
          <p className="mt-2 text-body text-scesi-grey-normal/65">
            Administra permisos y equipos dentro de la plataforma.
          </p>
        </div>
        <Button href="/admin/usuarios/invitar" className="self-start sm:shrink-0">
          <Plus aria-hidden="true" className="h-4 w-4" />
          Invitar usuario
        </Button>
      </div>

      <section aria-label="Resumen de usuarios por rol" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-scesi-grey-light-active/50 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-normal text-scesi-grey-normal/60">{label}</h2>
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-scesi-red-normal" />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-scesi-grey-normal">{value}</p>
            <p className="mt-2 text-xs text-scesi-grey-normal/50">{note}</p>
          </div>
        ))}
      </section>

      <div className="mt-4 overflow-x-auto rounded-xl border border-scesi-grey-light-active/50 bg-white p-4 sm:p-6">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Usuarios, roles y estado de acceso</caption>
          <thead className="bg-scesi-grey-light/50 text-[10px] font-medium uppercase tracking-widest text-scesi-grey-normal/50">
            <tr>
              {["Usuario", "Correo", "Rol", "Último acceso", "Estado"].map((column) => (
                <th key={column} scope="col" className="px-4 py-3">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user) => (
              <tr key={user.id} className="border-b border-scesi-grey-light text-scesi-grey-normal/65">
                <th scope="row" className="px-4 py-5 font-semibold text-scesi-grey-normal">{user.name}</th>
                <td className="px-4 py-5">{user.email}</td>
                <td className="px-4 py-5">{adminUserRoleLabels[user.role]}</td>
                <td className="whitespace-nowrap px-4 py-5">{user.lastAccess}</td>
                <td className="px-4 py-5">
                  <Badge variant={user.active ? "green" : "neutral"} className="rounded-md px-2 py-1.5 font-normal normal-case tracking-normal">
                    {user.active ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
