export default function StaffAccessControlLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando control de acceso" className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <div className="animate-pulse">
        <div className="h-10 w-64 max-w-full rounded bg-scesi-grey-light" />
        <div className="mt-3 h-5 w-full max-w-md rounded bg-scesi-grey-light" />
        <div className="mt-2 h-11 rounded-lg bg-scesi-grey-light" />
        <div className="mt-7 grid min-h-[420px] items-center gap-8 rounded-xl bg-scesi-grey-normal px-6 py-10 md:grid-cols-2 md:px-12 md:py-16">
          <div className="mx-auto aspect-square w-full max-w-64 rounded-xl border-2 border-scesi-grey-light-active/30" />
          <div>
            <div className="h-3 w-28 rounded bg-scesi-grey-light-active/30" />
            <div className="mt-4 h-9 w-full max-w-72 rounded bg-scesi-grey-light-active/30" />
            <div className="mt-3 h-4 w-full rounded bg-scesi-grey-light-active/20" />
            <div className="mt-6 h-12 rounded-lg bg-scesi-grey-light-active/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
