export type AdminUserRole = "participant" | "organizer" | "staff" | "admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  lastAccess: string;
  status: "active" | "inactive";
};

export const adminUserRoleLabels: Record<AdminUserRole, string> = {
  participant: "Participante",
  organizer: "Organizador",
  staff: "Staff",
  admin: "Administrador",
};

/** Totales demo de la plataforma; la tabla muestra una muestra de usuarios. */
export const adminUserCounts: Record<AdminUserRole, number> = {
  participant: 3742,
  organizer: 18,
  staff: 64,
  admin: 8,
};

export const totalAdminUsers = Object.values(adminUserCounts).reduce(
  (total, count) => total + count,
  0,
);

export const participantPercentage = (
  adminUserCounts.participant / totalAdminUsers * 100
).toFixed(1);

export const adminUserAssignments = { activeTeams: 4, staffedEvents: 7 };

export const adminUsers: AdminUser[] = [
  {
    id: "andrea-mendoza",
    name: "Andrea Mendoza",
    email: "andrea@correo.com",
    role: "participant",
    lastAccess: "Hoy · 10:18",
    status: "active",
  },
  {
    id: "carlos-vargas",
    name: "Carlos Vargas",
    email: "carlos@scesi.org",
    role: "staff",
    lastAccess: "Hoy · 09:42",
    status: "active",
  },
  {
    id: "elena-salinas",
    name: "Elena Salinas",
    email: "elena@scesi.org",
    role: "organizer",
    lastAccess: "Ayer · 18:30",
    status: "active",
  },
  {
    id: "marco-rivero",
    name: "Marco Rivero",
    email: "marco@scesi.org",
    role: "admin",
    lastAccess: "17 SEP · 14:20",
    status: "active",
  },
];
