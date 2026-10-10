/**
 * Sección Hero de la landing page.
 *
 * ─── IMÁGENES NECESARIAS ──────────────────────────────────────────────────────
 *
 *  public/landing/
 *  ├── hero-logo.png        ← Logo grande SCESI (con "UMSS" y el ratón)
 *  ├── hero-slide-1.jpg     ← 1ª foto del slideshow (ej. FLISoL / Tux)
 *  ├── hero-slide-2.jpg     ← 2ª foto del slideshow
 *  └── hero-slide-3.jpg     ← 3ª foto del slideshow
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "./auth-modal";

const slides = [
  {
    src: "/landing/hero-slide-1.jpg",
    alt: "Foto SCESI 1",
  },
  {
    src: "/landing/hero-slide-2.jpg",
    alt: "Foto SCESI 2",
  },
  {
    src: "/landing/hero-slide-3.jpg",
    alt: "Foto SCESI 3",
  },
];

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [],
  );

  /* Auto-avance silencioso cada 4 segundos (sin botones manuales) */
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      <section className="relative flex flex-col md:flex-row items-center justify-between min-h-[480px] lg:min-h-[540px] bg-white overflow-hidden py-8 md:py-12 pl-6 sm:pl-12 lg:pl-20 pr-0">

        {/* ── Lado izquierdo (centrado: logo, texto y botón rojo) ────── */}
        <div className="flex flex-1 flex-col items-center justify-center text-center py-6 pr-6 sm:pr-12 md:pr-10 gap-5 z-10 w-full">

          {/* Logo como imagen */}
          <div className="relative w-64 h-36 sm:w-80 sm:h-44 md:w-96 md:h-52">
            <Image
              src="/landing/hero-logo.png"
              alt="SCESI UMSS"
              fill
              sizes="(max-width: 768px) 320px, 384px"
              className="object-contain object-center"
              priority
            />
          </div>

          {/* Descripción */}
          <p className="text-base sm:text-lg font-medium text-gray-900 leading-snug max-w-sm">
            Sociedad Científica de Estudiantes
            <br />
            de Sistemas e Informática
          </p>

          {/* CTA rojo sólido con esquinas redondeadas */}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-scesi-red-normal px-6 py-2.5 text-sm font-semibold text-white hover:bg-scesi-red-normal-hover transition-colors"
          >
            Explorar eventos
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Lado derecho (slide automático pegado al borde derecho con esquinas izquierdas redondeadas) ── */}
        <div className="relative hidden md:block w-[46%] lg:w-[48%] h-[380px] sm:h-[420px] lg:h-[480px] rounded-l-[40px] lg:rounded-l-[48px] overflow-hidden flex-shrink-0">
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                sizes="50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </section>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
