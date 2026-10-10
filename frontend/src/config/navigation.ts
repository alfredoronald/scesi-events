import type { StaticImageData } from "next/image";
import {
  BarChart3,
  Calendar,
  Check,
  Clock,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Star,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match exacto de ruta (necesario para "/dashboard": no debe activarse en subrutas). */
  exact?: boolean;
};

export type SidebarConfig = {
  items: NavItem[];
  logo?: { src: string | StaticImageData; alt: string };
  footer?: { label: string; href: string };
  /** Eyebrow sobre el nav (ej. admin: "Espacio de trabajo"). */
  sectionLabel?: string;
};

export type ViewOption = {
  label: string;
  href: string;
};

/** Vistas disponibles en el switcher del sidebar (por rol). */
export const availableViews: ViewOption[] = [
  { label: "Participante", href: "/dashboard" },
  { label: "Organizador", href: "/organizador" },
  { label: "Staff", href: "/staff" },
  { label: "Administrador", href: "/admin" },
];

/** Menú del panel del participante. */
export const participantNav: NavItem[] = [
  { label: "Resumen", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Explorar eventos", href: "/dashboard/explorar", icon: Search },
  { label: "Mis entradas", href: "/dashboard/entradas", icon: Ticket },
  { label: "Calificaciones", href: "/dashboard/calificaciones", icon: Star },
];

/** Menú de la vista Organizador. */
export const organizerNav: NavItem[] = [
  { label: "Mis eventos", href: "/organizador", icon: Calendar, exact: true },
  { label: "Asistentes", href: "/organizador/asistentes", icon: Users },
  { label: "Actividades", href: "/organizador/actividades", icon: Clock },
  { label: "Comentarios", href: "/organizador/comentarios", icon: MessageSquare },
];

/** Menú de la vista Staff. */
export const staffNav: NavItem[] = [
  { label: "Mi horario", href: "/staff", icon: Clock, exact: true },
  { label: "Control de acceso", href: "/staff/control-acceso", icon: Check },
  { label: "Asistentes", href: "/staff/asistentes", icon: Users },
];

/** Menú de la vista Administrador. */
export const adminNav: NavItem[] = [
  { label: "Resumen", href: "/admin", icon: BarChart3, exact: true },
  { label: "Todos los eventos", href: "/admin/eventos", icon: Calendar },
  { label: "Usuarios y roles", href: "/admin/usuarios", icon: Users },
  { label: "Reportes", href: "/admin/reportes", icon: BarChart3 },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings },
];

const sidebarLogo = { src: "/logo.svg", alt: "SCESI UMSS" };
const sidebarFooter = { label: "Volver al sitio público", href: "/" };

/** Configs de sidebar por vista (logo y footer comunes). */
export const participantSidebar: SidebarConfig = {
  items: participantNav,
  logo: sidebarLogo,
  footer: sidebarFooter,
};

export const organizerSidebar: SidebarConfig = {
  items: organizerNav,
  logo: sidebarLogo,
  footer: sidebarFooter,
};

export const staffSidebar: SidebarConfig = {
  items: staffNav,
  logo: sidebarLogo,
  footer: sidebarFooter,
};

export const adminSidebar: SidebarConfig = {
  items: adminNav,
  logo: sidebarLogo,
  footer: sidebarFooter,
  sectionLabel: "Espacio de trabajo",
};

/** Presets resolubles desde componentes cliente (las configs contienen iconos). */
export const sidebarPresets = {
  participant: participantSidebar,
  organizador: organizerSidebar,
  staff: staffSidebar,
  admin: adminSidebar,
} as const;

export type SidebarPresetKey = keyof typeof sidebarPresets;
