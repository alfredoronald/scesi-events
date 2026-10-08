import type { StaticImageData } from "next/image";
import {
  LayoutDashboard,
  Search,
  Star,
  Ticket,
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
};

/** Menú del panel del participante. */
export const participantNav: NavItem[] = [
  { label: "Resumen", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Explorar eventos", href: "/dashboard/explorar", icon: Search },
  { label: "Mis entradas", href: "/dashboard/entradas", icon: Ticket },
  { label: "Calificaciones", href: "/dashboard/calificaciones", icon: Star },
];
