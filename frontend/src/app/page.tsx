/**
 * Página de bienvenida pública — SCESI Events.
 *
 * Esta es la página raíz ("/"). Es un Server Component: intenta cargar los
 * eventos desde la API (con fallback a los datos mock de config/landing.ts
 * si el backend no está disponible) y pasa props a los componentes cliente.
 *
 * No se toca nada de /dashboard, /organizador, /staff ni /admin.
 */
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { UpcomingEventsSection } from "@/components/landing/upcoming-events-section";
import { PastEventsSection } from "@/components/landing/past-events-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { ProjectsSection } from "@/components/landing/projects-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { loadLandingEvents } from "@/lib/landing-events";
import { projects } from "@/config/landing";

// La portada depende de la API en cada solicitud; no se prerenderiza en build.
export const instant = false;

export default async function LandingPage() {
  const { upcoming, past } = await loadLandingEvents();

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Barra de navegación pública */}
      <LandingNavbar />

      {/* Hero: logo SCESI + descripción + CTA + mascota */}
      <HeroSection />

      {/* Próximos eventos (API con fallback a config/landing.ts) */}
      <UpcomingEventsSection events={upcoming} />

      {/* Eventos pasados (API con fallback a config/landing.ts) */}
      <PastEventsSection events={past} />

      {/* CTA rojo "Reserva tu lugar." */}
      <CtaBanner />

      {/* Proyectos SCESI */}
      <ProjectsSection projects={projects} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
