export default function AdminEventsLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando eventos" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-3 w-24 bg-scesi-grey-light" />
        <div className="mt-4 h-10 w-full max-w-xs bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-md bg-scesi-grey-light" />
        <div className="mt-8 flex flex-wrap justify-between gap-3 rounded-xl border border-scesi-grey-light-active/50 p-3"><div className="h-10 w-full max-w-sm rounded-lg bg-scesi-grey-light" /><div className="h-10 w-full max-w-64 rounded-lg bg-scesi-grey-light" /></div>
        <div className="mt-4 overflow-hidden rounded-xl border border-scesi-grey-light-active/50 p-4 sm:p-6">
          <div className="h-9 bg-scesi-grey-light" />
          {[1, 2, 3, 4].map((row) => <div key={row} className="flex gap-8 border-b border-scesi-grey-light px-4 py-5"><div className="h-4 w-1/3 bg-scesi-grey-light" /><div className="h-4 w-1/4 bg-scesi-grey-light" /><div className="h-4 w-1/4 bg-scesi-grey-light" /></div>)}
        </div>
      </div>
    </div>
  );
}
