export default function AdminSettingsLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando configuración" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded bg-scesi-grey-light" />
        <div className="mt-4 h-10 w-64 max-w-full rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-lg rounded bg-scesi-grey-light" />
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2 rounded-xl border border-scesi-grey-light-active/50 p-3">
            {[1, 2, 3, 4, 5].map((section) => <div key={section} className="h-12 rounded-lg bg-scesi-grey-light" />)}
          </div>
          <div className="rounded-xl border border-scesi-grey-light-active/50 p-5 sm:p-7">
            <div className="h-7 w-56 max-w-full rounded bg-scesi-grey-light" />
            <div className="mt-3 h-4 w-full max-w-sm rounded bg-scesi-grey-light" />
            <div className="mt-7 space-y-5">
              {[1, 2, 3, 4].map((field) => (
                <div key={field}>
                  <div className="h-3 w-32 rounded bg-scesi-grey-light" />
                  <div className={`${field === 4 ? "h-28" : "h-11"} mt-3 rounded-lg bg-scesi-grey-light`} />
                </div>
              ))}
            </div>
            <div className="mt-5 h-10 w-36 rounded-lg bg-scesi-grey-light" />
          </div>
        </div>
      </div>
    </div>
  );
}
