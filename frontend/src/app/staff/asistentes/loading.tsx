export default function StaffAttendeesLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando asistentes"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="max-w-2xl">
          <div className="h-9 w-44 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-56" />
          <div className="mt-3 h-5 w-80 rounded bg-scesi-grey-light-active/40" />
        </div>

        {/* Pestañas + buscador */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="h-9 w-24 rounded-lg bg-scesi-grey-normal/70" />
            <div className="h-9 w-36 rounded-lg bg-scesi-grey-light-active/40" />
            <div className="h-9 w-36 rounded-lg bg-scesi-grey-light-active/40" />
            <div className="h-9 w-44 rounded-lg bg-scesi-grey-light-active/40" />
          </div>
          <div className="h-9 w-full rounded-lg bg-scesi-grey-light-active/40 sm:w-64" />
        </div>

        {/* Filas de la tabla */}
        <div className="mt-6 overflow-hidden rounded-xl border border-scesi-grey-light-active">
          <div className="h-10 bg-scesi-grey-light" />
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center gap-6 border-t border-scesi-grey-light-active px-5 py-4"
            >
              <div className="h-4 w-44 rounded bg-scesi-grey-light-active/50" />
              <div className="h-4 w-28 rounded bg-scesi-grey-light-active/40" />
              <div className="h-4 w-24 rounded bg-scesi-grey-light-active/40" />
              <div className="h-4 w-16 rounded bg-scesi-grey-light-active/40" />
              <div className="h-5 w-28 rounded-full bg-scesi-grey-light-active/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
