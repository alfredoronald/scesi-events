export default function StaffAttendeesLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando asistentes" className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-10 w-44 rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-md rounded bg-scesi-grey-light" />
        <div className="mt-2 h-11 rounded-lg bg-scesi-grey-light" />
        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-wrap gap-2">{[1, 2, 3, 4].map((filter) => <div key={filter} className="h-10 w-24 rounded-lg bg-scesi-grey-light" />)}</div>
          <div className="h-10 w-full rounded-lg bg-scesi-grey-light sm:w-64" />
        </div>
        <div className="mt-5 rounded-xl border border-scesi-grey-light-active/50 p-4 sm:p-6">
          <div className="h-9 rounded bg-scesi-grey-light" />
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex gap-8 border-b border-scesi-grey-light px-4 py-5">
              <div className="h-4 w-1/3 rounded bg-scesi-grey-light" />
              <div className="h-4 w-1/4 rounded bg-scesi-grey-light" />
              <div className="h-4 w-1/4 rounded bg-scesi-grey-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
