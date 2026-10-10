export default function AdminUsersLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando usuarios" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-md">
            <div className="h-3 w-28 rounded bg-scesi-grey-light" />
            <div className="mt-4 h-10 w-64 max-w-full rounded bg-scesi-grey-light" />
            <div className="mt-3 h-5 w-full rounded bg-scesi-grey-light" />
          </div>
          <div className="h-11 w-40 shrink-0 rounded-lg bg-scesi-grey-light" />
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((card) => (
            <div key={card} className="rounded-xl border border-scesi-grey-light-active/50 p-5">
              <div className="flex justify-between gap-3">
                <div className="h-4 w-24 rounded bg-scesi-grey-light" />
                <div className="h-5 w-5 rounded bg-scesi-grey-light" />
              </div>
              <div className="mt-4 h-9 w-20 rounded bg-scesi-grey-light" />
              <div className="mt-2 h-4 w-32 rounded bg-scesi-grey-light" />
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-scesi-grey-light-active/50 p-4 sm:p-6">
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
