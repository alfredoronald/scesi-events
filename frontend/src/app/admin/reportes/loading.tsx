export default function AdminReportsLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando reportes" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-3 w-28 rounded bg-scesi-grey-light" />
        <div className="mt-4 h-10 w-44 rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-lg rounded bg-scesi-grey-light" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((card) => (
            <div key={card} className="min-h-56 rounded-xl border border-scesi-grey-light-active/50 p-6">
              <div className="h-11 w-11 rounded-lg bg-scesi-grey-light" />
              <div className="mt-6 h-5 w-full rounded bg-scesi-grey-light" />
              <div className="mt-2 h-4 w-3/4 rounded bg-scesi-grey-light" />
              <div className="mt-8 h-4 w-28 rounded bg-scesi-grey-light" />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-scesi-grey-light-active/50 p-5 sm:p-6">
          <div className="h-5 w-full max-w-sm rounded bg-scesi-grey-light" />
          <div className="mt-6 h-9 w-28 rounded bg-scesi-grey-light" />
          <div className="mt-6 flex h-40 items-end gap-2 sm:h-48">
            {[20, 30, 40, 55, 45, 65, 60, 75, 90, 85, 100].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-sm bg-scesi-grey-light" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
