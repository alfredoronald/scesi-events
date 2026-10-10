export default function OrganizerActivitiesLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando actividades"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="h-9 w-52 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-64" />
            <div className="mt-3 h-5 w-80 rounded bg-scesi-grey-light-active/40" />
          </div>
          <div className="h-11 w-44 rounded-lg bg-scesi-grey-light-active/60" />
        </div>

        {/* Cronograma */}
        <div className="mt-8 overflow-hidden rounded-xl border border-scesi-grey-light-active">
          <div className="flex flex-col sm:flex-row">
            <div className="flex items-center justify-center gap-3 bg-scesi-grey-darker px-6 py-4 sm:w-36 sm:flex-col sm:py-10">
              <div className="h-10 w-12 rounded bg-white/20" />
              <div className="h-4 w-8 rounded bg-white/20" />
              <div className="h-3 w-16 rounded bg-white/10" />
            </div>
            <ul className="flex-1 divide-y divide-scesi-grey-light-active">
              {[0, 1, 2, 3, 4].map((row) => (
                <li
                  key={row}
                  className="flex items-center gap-6 border-l-4 border-transparent px-6 py-4"
                >
                  <div className="h-4 w-14 rounded bg-scesi-grey-light-active/50" />
                  <div className="flex-1">
                    <div className="h-4 w-64 rounded bg-scesi-grey-light-active/50" />
                    <div className="mt-2 h-4 w-36 rounded bg-scesi-grey-light-active/40" />
                  </div>
                  <div className="hidden h-4 w-32 rounded bg-scesi-grey-light-active/40 md:block" />
                  <div className="h-10 w-10 rounded-lg bg-scesi-grey-light-active/40" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
