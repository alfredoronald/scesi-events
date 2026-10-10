"use client";
import { useEffect, useState } from "react";
import { api, apiList } from "@/lib/api";

export function useResource<T>(path: string | null, initial: T, list = false) {
  const [data, setData] = useState(initial);
  const [fallback] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!path) return;
    const load = list ? apiList<unknown>(path) : api<T>(path);
    load.then((value) => { if (active) { setData(value as T); setLoadedPath(path); setError(""); } })
      .catch((cause) => { if (active) { setLoadedPath(path); setData(fallback); setError(cause instanceof Error ? cause.message : "Error al cargar los datos."); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [path, list, version, fallback]);
  return { data: loadedPath === path ? data : initial, error: loadedPath === path ? error : "", loading: Boolean(path) && (loading || loadedPath !== path), reload: () => { setLoading(true); setVersion((value) => value + 1); } };
}

export function ResourceStatus({ loading, error, reload }: { loading: boolean; error: string; reload: () => void }) {
  if (loading) return <p role="status" className="my-4 text-sm text-gray-500">Cargando datos…</p>;
  if (error) return <div role="alert" className="my-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" onClick={reload} className="ml-2 underline">Reintentar</button></div>;
  return null;
}
