"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { roleHome } from "@/lib/api";

type Tab = "login" | "register";

type Props = {
  onClose: () => void;
};

export function AuthModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("login");
  const { authenticate } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const user = await authenticate(tab === "login" ? "/auth/login" : "/auth/register", tab === "login"
        ? { identifier: email.trim(), password }
        : { nombreCompleto: name.trim(), username: username.trim(), email: email.trim(), password });
      router.push(roleHome[user.rol]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo iniciar sesión."); }
    finally { setPending(false); }
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-8">
        {/* Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="mb-4 flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="SCESI UMSS"
            width={48}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {/* Eyebrow */}
        <p className="text-xs font-semibold tracking-widest text-scesi-red-normal uppercase mb-1">
          Acceso a la comunidad
        </p>

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          {tab === "login" ? "Bienvenido de vuelta." : "Crea tu cuenta."}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {tab === "login"
            ? "Accede a tus inscripciones, agenda y actividades."
            : "Únete a la comunidad SCESI y participa en eventos."}
        </p>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === "login"
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === "register"
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {tab === "register" && <div><label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label><input id="username" required minLength={3} maxLength={60} pattern="[a-zA-Z0-9_.\-]+" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm" /></div>}

          {/* Nombre (solo en registro) */}
          {tab === "register" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre completo
              </label>
              <input
                id="name"
                required
                minLength={3}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-scesi-red-normal focus:ring-1 focus:ring-scesi-red-normal"
              />
            </div>
          )}

          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type={tab === "register" ? "email" : "text"}
              required
              autoComplete={tab === "login" ? "username" : "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-scesi-red-normal focus:ring-1 focus:ring-scesi-red-normal"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              required
              minLength={tab === "register" ? 8 : 1}
              autoComplete={tab === "register" ? "new-password" : "current-password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-scesi-red-normal focus:ring-1 focus:ring-scesi-red-normal"
            />
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-3 rounded-lg bg-scesi-red-normal py-3.5 text-sm font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
          >
            {pending ? "Procesando…" : tab === "login" ? "Ingresar" : "Crear cuenta"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Al continuar aceptas los{" "}
          <span className="underline cursor-pointer">términos de uso</span> y la{" "}
          <span className="underline cursor-pointer">política de privacidad</span>.
        </p>
      </div>
    </div>
  );
}
