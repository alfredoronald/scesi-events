/**
 * Página de bienvenida pública — SCESI Events.
 *
 * Esta es la página raíz ("/"). Es un Server Component: importa los datos mock
 * y pasa props a los componentes cliente cuando los necesitan.
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
import { upcomingEvents, pastEvents, projects } from "@/config/landing";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      {/* Barra de navegación pública */}
      <LandingNavbar />

      {/* Hero: logo SCESI + descripción + CTA + mascota */}
      <HeroSection />

      {/* Próximos eventos */}
      <UpcomingEventsSection events={upcomingEvents} />

      {/* Eventos pasados */}
      <PastEventsSection events={pastEvents} />

      {/* CTA rojo "Reserva tu lugar." */}
      <CtaBanner />

      {/* Proyectos SCESI */}
      <ProjectsSection projects={projects} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
