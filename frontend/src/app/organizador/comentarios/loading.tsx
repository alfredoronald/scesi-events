export default function OrganizerCommentsLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando comentarios" className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-10 w-60 rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-md rounded bg-scesi-grey-light" />
        <div className="mt-8 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-xl border border-scesi-grey-light-active/50 p-6">
            <div className="mx-auto h-16 w-24 rounded bg-scesi-grey-light" />
            <div className="mx-auto mt-6 h-5 w-28 rounded bg-scesi-grey-light" />
            <div className="mt-8 space-y-4">{[1, 2, 3, 4, 5].map((row) => <div key={row} className="h-4 rounded bg-scesi-grey-light" />)}</div>
          </div>
          <div className="grid gap-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="rounded-xl border border-scesi-grey-light-active/50 p-6">
                <div className="flex gap-3"><div className="h-10 w-10 rounded-full bg-scesi-grey-light" /><div className="h-5 w-32 rounded bg-scesi-grey-light" /></div>
                <div className="mt-6 h-4 w-full rounded bg-scesi-grey-light" />
                <div className="mt-7 h-3 w-16 rounded bg-scesi-grey-light" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
