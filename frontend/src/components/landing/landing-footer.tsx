/**
 * Footer de la landing page.
 * Logo SCESI + copyright + links básicos.
 */
import Image from "next/image";

export function LandingFooter() {
  return (
    <footer className="bg-scesi-grey-normal py-10 px-5 sm:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="SCESI UMSS"
          width={70}
          height={46}
          className="h-10 w-auto brightness-0 invert"
        />

        {/* Centro */}
        <p className="text-xs text-scesi-grey-light-active text-center">
          © 2025 SCESI — Sociedad Científica de Estudiantes de Sistemas
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>
          Universidad Mayor de San Simón · Cochabamba, Bolivia
        </p>

        {/* Links */}
        <div className="flex gap-4 text-xs text-scesi-grey-light-active">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
