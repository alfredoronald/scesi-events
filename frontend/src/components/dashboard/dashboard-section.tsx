import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DashboardSection({
  title,
  description,
  emptyMessage,
}: {
  title: string;
  description: string;
  emptyMessage: string;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-title text-scesi-grey-normal">{title}</h1>
        <p className="mt-3 text-scesi-grey-normal/70">{description}</p>
      </header>
      <section
        aria-label={title}
        className="border-y border-scesi-grey-light-active py-8"
      >
        <p className="text-scesi-grey-normal/70">{emptyMessage}</p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-scesi-red-normal outline-none hover:text-scesi-red-normal-hover focus-visible:ring-2 focus-visible:ring-scesi-red-normal"
        >
          Volver al resumen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
