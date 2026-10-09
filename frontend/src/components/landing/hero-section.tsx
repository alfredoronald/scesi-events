/**
 * Sección Hero de la landing page.
 * Imagen derecha: /public/landing/hero-mascot.png
 *   → Es la mascota/tux de SCESI que aparece en la esquina superior derecha.
 *     Sube el archivo con ese nombre exacto y aparecerá automáticamente.
 */
"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "./auth-modal";

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Texto */}
          <div className="flex-1 max-w-xl">
            {/* Logo SCESI grande */}
            <div className="flex flex-col mb-4">
              <Image
                src="/logo.svg"
                alt="SCESI UMSS"
                width={120}
                height={80}
                className="h-16 w-auto mb-1"
              />
              <p className="text-xs text-gray-500 max-w-[220px] leading-tight">
                Sociedad Científica de Estudiantes de Sistemas e Informática
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-scesi-red-normal px-5 py-2.5 text-sm font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
            >
              Explorar eventos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Imagen mascota — sube /public/landing/hero-mascot.png */}
          <div className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 relative rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src="/landing/hero-mascot.png"
              alt="Mascota SCESI"
              fill
              className="object-cover"
              priority
              // Si la imagen no existe aún, Next.js mostrará un espacio vacío
              // sin romper el build. Súbela como /public/landing/hero-mascot.png
            />
          </div>
        </div>
      </section>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
