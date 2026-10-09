export default function RatingsLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando calificaciones"
      className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
    >
      <div className="animate-pulse">
        {/* Cabecera */}
        <div className="h-9 w-56 rounded bg-scesi-grey-light-active/60 sm:h-12 sm:w-72" />
        <div className="mt-3 h-5 w-80 rounded bg-scesi-grey-light-active/40" />

        {/* Selector de evento */}
        <div className="mt-8 h-11 w-full rounded-lg bg-scesi-grey-light-active/50" />

        {/* Dos tarjetas: formulario y valoraciones enviadas */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {[0, 1].map((card) => (
            <div
              key={card}
              className="rounded-xl border border-scesi-grey-light-active bg-white p-6 sm:p-8"
            >
              <div className="h-7 w-56 rounded bg-scesi-grey-light-active/60" />
              <div className="mt-3 h-4 w-72 rounded bg-scesi-grey-light-active/40" />
              <div className="mt-5 flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="h-7 w-7 rounded-md bg-scesi-grey-light-active/40"
                  />
                ))}
              </div>
              <div className="mt-5 h-32 w-full rounded-lg bg-scesi-grey-light-active/40" />
              <div className="mt-5 h-11 w-full rounded-lg bg-scesi-grey-light-active/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
