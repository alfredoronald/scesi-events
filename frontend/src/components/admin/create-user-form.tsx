"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function CreateUserForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try { await api("/usuarios", { method: "POST", body: JSON.stringify(data) }); router.push("/admin/usuarios"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo crear el usuario."); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-3xl p-6 sm:p-10"><h1 className="text-3xl font-semibold">Crear usuario</h1><form onSubmit={submit} className="mt-6 space-y-5 rounded-xl border p-6">{[{ name: "nombreCompleto", label: "Nombre completo", type: "text", min: 3 }, { name: "username", label: "Usuario", type: "text", min: 3 }, { name: "email", label: "Correo", type: "email", min: 3 }, { name: "password", label: "Contraseña inicial", type: "password", min: 8 }].map((field) => <label key={field.name} className="block text-sm">{field.label}<input name={field.name} type={field.type} required minLength={field.min} className="mt-2 w-full rounded-lg border p-3" /></label>)}<label className="block text-sm">Rol<select name="rol" className="mt-2 w-full rounded-lg border p-3">{["PARTICIPANTE", "STAFF", "ORGANIZADOR", "ADMIN"].map((role) => <option key={role}>{role}</option>)}</select></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={pending} className="rounded-lg bg-scesi-red-normal px-5 py-3 text-white">{pending ? "Guardando…" : "Crear usuario"}</button></form></div>;
}
