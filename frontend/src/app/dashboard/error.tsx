"use client";

import { RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start justify-center gap-4 px-5 py-16 sm:px-8 lg:px-10">
      <p className="text-xs font-medium tracking-[0.18em] text-scesi-red-normal uppercase">
        Algo salió mal
      </p>
      <h1 className="text-title text-scesi-grey-normal">
        No pudimos cargar tu resumen
      </h1>
      <p className="text-body text-scesi-grey-normal/70">
        Ocurrió un error inesperado. Vuelve a intentarlo; si persiste, vuelve
        más tarde.
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className="max-w-full overflow-x-auto rounded-lg bg-scesi-grey-light px-3 py-2 font-mono text-xs text-scesi-grey-normal/70">
          {error.message}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-scesi-red-normal px-5 text-sm font-medium text-white transition-colors outline-none hover:bg-scesi-red-normal-hover active:bg-scesi-red-normal-active focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reintentar
      </button>
    </div>
  );
}
