/**
 * Página de bienvenida pública — SCESI Events.
 *
 * Server Component que carga los eventos y proyectos publicados de la API.
 */
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { UpcomingEventsSection } from "@/components/landing/upcoming-events-section";
import { PastEventsSection } from "@/components/landing/past-events-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { ProjectsSection } from "@/components/landing/projects-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { loadLandingEvents } from "@/lib/landing-events";
import { loadLandingProjects } from "@/lib/landing-projects";

// La portada depende de la API en cada solicitud; no se prerenderiza en build.
export const instant = false;

export default async function LandingPage() {
  const [{ upcoming, past }, projects] = await Promise.all([loadLandingEvents(), loadLandingProjects()]);

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Barra de navegación pública */}
      <LandingNavbar />

      {/* Hero: logo SCESI + descripción + CTA + mascota */}
      <HeroSection />

      {/* Próximos eventos */}
      <UpcomingEventsSection events={upcoming} />

      {/* Eventos pasados */}
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
