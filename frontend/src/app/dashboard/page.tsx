import Link from "next/link";
import { ArrowRight, Search, Star, Ticket } from "lucide-react";

const shortcuts = [
  {
    label: "Explorar eventos",
    description: "Encuentra talleres, charlas y actividades.",
    href: "/dashboard/explorar",
    icon: Search,
  },
  {
    label: "Mis entradas",
    description: "Consulta tus inscripciones y entradas.",
    href: "/dashboard/entradas",
    icon: Ticket,
  },
  {
    label: "Calificaciones",
    description: "Comparte tu opinión sobre los eventos.",
    href: "/dashboard/calificaciones",
    icon: Star,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium text-scesi-red-normal">
          SCESI Events
        </p>
        <h1 className="text-title text-scesi-grey-normal">Tu espacio SCESI</h1>
        <p className="mt-3 text-scesi-grey-normal/70">
          Descubre actividades, lleva tus entradas y vuelve a conectar con la
          comunidad.
        </p>
      </header>

      <section aria-labelledby="shortcuts-heading">
        <h2 id="shortcuts-heading" className="mb-3 text-lg text-scesi-grey-normal">
          ¿Qué quieres hacer?
        </h2>
        <div className="divide-y divide-scesi-grey-light-active border-y border-scesi-grey-light-active">
          {shortcuts.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-20 items-center gap-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-scesi-red-normal"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-scesi-red-normal">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-scesi-grey-normal">
                  {label}
                </span>
                <span className="mt-1 block text-sm text-scesi-grey-normal/70">
                  {description}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-scesi-grey-normal/50 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
