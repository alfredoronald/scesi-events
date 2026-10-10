export default function StaffScheduleLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando horario" className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-10 w-44 rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-md rounded bg-scesi-grey-light" />
        <div className="mt-2 h-11 rounded-lg bg-scesi-grey-light" />
        <div className="mt-6 flex gap-2"><div className="h-10 w-24 rounded-lg bg-scesi-grey-light" /><div className="h-10 w-24 rounded-lg bg-scesi-grey-light" /></div>
        <div className="mt-4 flex flex-col overflow-hidden rounded-xl border border-scesi-grey-light-active/30 sm:flex-row">
          <div className="flex items-center justify-center bg-scesi-grey-normal px-6 py-8 sm:w-36 sm:items-start"><div className="h-14 w-16 rounded bg-scesi-grey-light-active/30" /></div>
          <div className="flex-1 px-6 py-2">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center gap-4 border-b border-scesi-grey-light py-6">
                <div className="h-4 w-20 shrink-0 rounded bg-scesi-grey-light" />
                <div className="flex-1"><div className="h-4 w-full max-w-52 rounded bg-scesi-grey-light" /><div className="mt-2 h-3 w-28 rounded bg-scesi-grey-light" /></div>
                <div className="hidden h-8 w-24 rounded-md bg-scesi-grey-light sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
