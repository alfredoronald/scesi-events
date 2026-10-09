/**
 * Navbar pública de la landing page.
 * Botón "Iniciar sesión" dispara el modal de auth.
 */
"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthModal } from "./auth-modal";

const navLinks = [
  { label: "Eventos", href: "#proximos-eventos" },
  { label: "Tus Tickets", href: "#" },
  { label: "Proyectos", href: "#proyectos" },
];

export function LandingNavbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-scesi-grey-normal">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="SCESI UMSS"
              width={60}
              height={40}
              className="h-9 w-auto"
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm font-medium text-scesi-grey-light hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="hidden md:inline-flex items-center rounded-lg bg-scesi-red-normal px-5 py-2 text-sm font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
            >
              Iniciar sesión
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-scesi-grey-dark px-5 py-4 flex flex-col gap-4 bg-scesi-grey-normal">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-scesi-grey-light hover:text-white"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setModalOpen(true); }}
              className="mt-1 w-full rounded-lg bg-scesi-red-normal py-2.5 text-sm font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </header>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
