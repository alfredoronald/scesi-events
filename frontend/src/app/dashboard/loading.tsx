export default function DashboardLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando resumen"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera de saludo */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-32 rounded bg-scesi-grey-light-active/60" />
            <div className="h-9 w-56 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-72" />
          </div>
          <div className="h-11 w-44 rounded-lg bg-scesi-grey-light-active/60" />
        </div>

        {/* Hero del próximo evento */}
        <div className="mt-8 h-64 rounded-xl bg-scesi-grey-dark sm:h-56" />

        {/* Tarjetas */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="h-72 rounded-xl border border-scesi-grey-light-active bg-white p-6">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-scesi-grey-light-active/60" />
              <div className="h-5 w-48 rounded bg-scesi-grey-light-active/60" />
            </div>
            <div className="mt-6 space-y-4">
              {[0, 1].map((row) => (
                <div key={row} className="flex items-center gap-4">
                  <div className="h-[84px] w-28 rounded-lg bg-scesi-grey-light-active/60" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded-full bg-scesi-grey-light-active/60" />
                    <div className="h-4 w-40 rounded bg-scesi-grey-light-active/60" />
                    <div className="h-3 w-32 rounded bg-scesi-grey-light-active/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-72 rounded-xl border border-scesi-grey-light-active bg-white p-6">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-scesi-grey-light-active/60" />
              <div className="h-5 w-32 rounded bg-scesi-grey-light-active/60" />
            </div>
            <div className="mt-6 space-y-5">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center justify-between">
                  <div className="h-4 w-36 rounded bg-scesi-grey-light-active/60" />
                  <div className="h-6 w-10 rounded bg-scesi-grey-light-active/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
