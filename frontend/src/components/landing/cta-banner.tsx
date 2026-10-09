/**
 * Banner CTA "Reserva tu lugar."
 * Fondo rojo SCESI con botón de acción que abre el modal de auth.
 */
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthModal } from "./auth-modal";

export function CtaBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="bg-scesi-red-normal py-16 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center text-center gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Reserva tu lugar.
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Iniciar sesión
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
