export default function ExploreEventsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando eventos"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="h-9 w-64 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-80" />
        <div className="mt-3 h-5 w-80 rounded bg-scesi-grey-light-active/40" />

        {/* Filtros y buscador */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded-lg bg-scesi-grey-light-active/60" />
            <div className="h-9 w-32 rounded-lg bg-scesi-grey-light-active/40" />
          </div>
          <div className="h-10 w-full rounded-lg bg-scesi-grey-light-active/40 sm:w-72" />
        </div>

        {/* Grid de cards */}
        <div className="mt-6 grid auto-rows-fr gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex overflow-hidden rounded-2xl bg-scesi-grey-light sm:flex-row"
            >
              <div className="aspect-[16/10] w-full bg-scesi-grey-light-active/40 sm:aspect-auto sm:w-1/3" />
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="h-5 w-32 rounded-full bg-scesi-grey-light-active/50" />
                <div className="mt-6 h-6 w-48 rounded bg-scesi-grey-light-active/50" />
                <div className="mt-3 h-4 w-full rounded bg-scesi-grey-light-active/40" />
                <div className="mt-2 h-4 w-3/4 rounded bg-scesi-grey-light-active/40" />
                <div className="mt-7 space-y-3">
                  <div className="h-4 w-40 rounded bg-scesi-grey-light-active/40" />
                  <div className="h-4 w-32 rounded bg-scesi-grey-light-active/40" />
                </div>
                <div className="mt-auto flex items-center justify-between pt-8">
                  <div className="h-4 w-28 rounded bg-scesi-grey-light-active/50" />
                  <div className="h-5 w-5 rounded bg-scesi-grey-light-active/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
