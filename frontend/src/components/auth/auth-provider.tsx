"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, refreshSession, roleHome, setAccessToken, type Session, type User } from "@/lib/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticate: (path: "/auth/login" | "/auth/register", input: Record<string, string>) => Promise<User>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    refreshSession().then((session) => { if (active) setUser(session.usuario); })
      .catch(() => { setAccessToken(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function authenticate(path: "/auth/login" | "/auth/register", input: Record<string, string>) {
    const session = await api<Session>(path, { method: "POST", body: JSON.stringify(input) }, false);
    setAccessToken(session.accessToken);
    setUser(session.usuario);
    return session.usuario;
  }
  async function logout() {
    await api<void>("/auth/logout", { method: "POST", body: "{}" }, false);
    setAccessToken(null);
    setUser(null);
    router.replace("/");
  }
  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth requiere AuthProvider");
  return value;
}

export function RoleGuard({ role, children }: { role: User["rol"]; children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.rol !== role) router.replace(roleHome[user.rol]);
  }, [user, loading, role, router]);
  if (loading || !user || user.rol !== role) return <p role="status" className="p-8 text-sm text-gray-500">Verificando sesión…</p>;
  return children;
}
