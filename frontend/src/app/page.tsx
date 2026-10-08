import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-scesi-grey-normal px-6 py-8 text-scesi-grey-light sm:px-12 lg:px-20">
      <Link href="/dashboard" className="w-fit outline-none focus-visible:ring-2 focus-visible:ring-scesi-red-light">
        <span className="text-lg font-semibold tracking-tight">SCESI Events</span>
        <span className="mt-1 block text-sm text-scesi-grey-light-active">
          UMSS · Sociedad Científica de Estudiantes de Sistemas
        </span>
      </Link>

      <section className="max-w-3xl py-20">
        <p className="mb-5 text-sm font-medium text-scesi-red-light">
          Comunidad SCESI
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Ideas que se encuentran en un evento.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-scesi-grey-light-active sm:text-lg">
          Explora actividades, gestiona tus entradas y comparte lo que
          aprendiste en la comunidad de Sistemas.
        </p>
        <Link
          href="/dashboard"
          className="mt-9 inline-flex h-12 items-center gap-3 rounded-lg bg-scesi-red-normal px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-scesi-red-normal-hover focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal"
        >
          Entrar al panel
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <p className="text-sm text-scesi-grey-light-active">
        Universidad Mayor de San Simón · Cochabamba, Bolivia
      </p>
    </main>
  );
}
