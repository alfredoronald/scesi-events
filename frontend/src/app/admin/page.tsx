import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administrador",
  description: "Administra usuarios, roles y la configuración de la plataforma.",
};

export default function AdminPage() {
  redirect("/admin/eventos");
}
