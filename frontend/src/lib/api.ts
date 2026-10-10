export type User = {
  id: string;
  nombreCompleto: string;
  username: string;
  email: string;
  rol: "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE";
  activo: boolean;
};
export type Session = { accessToken: string; usuario: User; expiresIn: string };
export const roleHome: Record<User["rol"], string> = {
  ADMIN: "/admin/eventos", ORGANIZADOR: "/organizador", STAFF: "/staff", PARTICIPANTE: "/dashboard",
};

let token: string | null = null;
let expiresAt = 0;
let refreshing: Promise<Session> | null = null;
export function setAccessToken(value: string | null) {
  token = value;
  try { expiresAt = value ? JSON.parse(atob(value.split(".")[1].replaceAll("-", "+").replaceAll("_", "/"))).exp * 1000 : 0; }
  catch { expiresAt = 0; }
}

export async function refreshSession(): Promise<Session> {
  refreshing ??= api<Session>("/auth/refresh", { method: "POST", body: "{}" }, false)
    .then((session) => { setAccessToken(session.accessToken); return session; })
    .finally(() => { refreshing = null; });
  return refreshing;
}

export async function api<T>(path: string, options: RequestInit = {}, retry = true, envelope = false): Promise<T> {
  if (token && expiresAt && expiresAt <= Date.now() + 10000 && retry && !path.startsWith("/auth/")) await refreshSession();
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`/api/v1${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  } catch { throw new Error("No se pudo conectar con el servidor. Intenta nuevamente."); }
  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    await refreshSession();
    return api<T>(path, options, false, envelope);
  }
  if (response.status === 204) return undefined as T;
  if (response.ok && !response.headers.get("content-type")?.includes("application/json")) return await response.blob() as T;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const details = Array.isArray(body?.error?.details) ? body.error.details.map((detail: { message: string }) => detail.message).join(" ") : "";
    throw new Error(details || body?.error?.message || body?.message || "No se pudo completar la solicitud.");
  }
  return (envelope ? body : body.data) as T;
}

export async function apiList<T>(path: string): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const first = await api<{ data: T[]; meta?: { totalPages: number } }>(`${path}${separator}page=1&pageSize=100`, {}, true, true);
  const result = [...first.data];
  for (let page = 2; page <= (first.meta?.totalPages ?? 1); page++) {
    const next = await api<T[]>(`${path}${separator}page=${page}&pageSize=100`);
    result.push(...next);
  }
  return result;
}
