export default function TicketsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando entradas"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="h-9 w-56 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-72" />
        <div className="mt-3 h-5 w-80 rounded bg-scesi-grey-light-active/40" />

        {/* Filtros */}
        <div className="mt-8 flex flex-wrap gap-2">
          <div className="h-9 w-28 rounded-lg bg-scesi-grey-light-active/60" />
          <div className="h-9 w-28 rounded-lg bg-scesi-grey-light-active/40" />
          <div className="h-9 w-32 rounded-lg bg-scesi-grey-light-active/40" />
        </div>

        {/* Filas de entrada */}
        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex overflow-hidden rounded-2xl bg-scesi-grey-light sm:flex-row"
            >
              <div className="flex items-center justify-center bg-scesi-grey-dark px-6 py-8 sm:min-w-40" />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="h-5 w-28 rounded-full bg-scesi-grey-light-active/50" />
                <div className="h-6 w-56 rounded bg-scesi-grey-light-active/50" />
                <div className="h-4 w-40 rounded bg-scesi-grey-light-active/40" />
              </div>
              <div className="flex items-center justify-between gap-6 border-t border-scesi-grey-light-active px-6 py-4 sm:border-t-0 sm:border-l sm:px-8">
                <div className="space-y-2">
                  <div className="h-3 w-14 rounded bg-scesi-grey-light-active/40" />
                  <div className="h-5 w-20 rounded bg-scesi-grey-light-active/50" />
                </div>
                <div className="h-4 w-24 rounded bg-scesi-grey-light-active/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
