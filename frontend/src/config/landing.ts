/**
 * Datos mock para la página de bienvenida (landing pública).
 * Cuando exista la API se sustituye por fetches en los Server Components.
 *
 * ─── IMÁGENES ────────────────────────────────────────────────────────────────
 * Todas las imágenes se sirven desde /public. Estructura de carpetas:
 *
 *  public/
 *  ├── landing/
 *  │   ├── hero-mascot.png          ← Mascota/tux de SCESI (esquina superior derecha del hero)
 *  │   └── hero-bg.jpg              ← (Opcional) fondo del hero si se usa imagen
 *  ├── events/
 *  │   ├── feria-internacional-libro.jpg   ← Foto de la Feria Internacional del Libro
 *  │   ├── hackathon-scesi.jpg             ← Foto del Hackathon SCESI
 *  │   ├── scesi-noel.jpg                  ← Foto del SCESI Noel
 *  │   ├── semana-tecnologica.jpg          ← Foto de la Semana Tecnológica
 *  │   ├── aws-community-day.jpg           ← Foto del AWS Community Day
 *  │   └── flisol.jpg                      ← Foto del FLISoL
 *  └── projects/
 *      ├── proyecto-feria-libro.jpg        ← Imagen del proyecto Feria del Libro
 *      ├── proyecto-scesi-noel.jpg         ← Imagen del proyecto SCESI Noel
 *      └── proyecto-semana-tec.jpg         ← Imagen del proyecto Semana Tecnológica
 *
 * Una vez subas las imágenes con esos nombres exactos, aparecerán automáticamente.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type LandingEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  /** Badge de categoría visible en la card */
  category: string;
  image: string;
  /** "upcoming" | "past" */
  status: "upcoming" | "past";
  href: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  /** Texto de estado visible en la lista, ej. "En desarrollo", "Activo". */
  status: string;
};

// ── Próximos eventos ──────────────────────────────────────────────────────────
export const upcomingEvents: LandingEvent[] = [
  {
    id: "feria-internacional-libro",
    title: "Feria Internacional del Libro",
    description:
      "Tendremos un stand abierto para conversar sobre tecnología, comunidad y las oportunidades que construimos desde SCESI. Súmate y conecta con otras personas de la carrera.",
    date: "05 – 15 SEP",
    location: "FECO, Cochabamba",
    category: "Comunidad invitada",
    image: "/events/feria-internacional-libro.jpg",
    status: "upcoming",
    href: "#",
  },
  {
    id: "scesi-noel",
    title: "Scesi Noel",
    description:
      "El tradicional festejo navideño de la comunidad SCESI con intercambio de regalos, música y actividades en un ambiente especial para cerrar el año académico.",
    date: "20 DIC",
    location: "FCyT — UMSS",
    category: "Organizado por SCESI",
    image: "/events/scesi-noel.jpg",
    status: "upcoming",
    href: "#",
  },
  {
    id: "semana-tecnologica",
    title: "Semana tecnológica",
    description:
      "Una semana repleta de charlas, talleres y networking con expertos de la industria. Aprende sobre las últimas tendencias y conecta con profesionales del área.",
    date: "15 – 19 NOV",
    location: "Auditorio FCyT",
    category: "Organizado por SCESI",
    image: "/events/semana-tecnologica.jpg",
    status: "upcoming",
    href: "#",
  },
];

// ── Eventos pasados ───────────────────────────────────────────────────────────
export const pastEvents: LandingEvent[] = [
  {
    id: "flisol",
    title: "FLISoL",
    description:
      "Festival Latinoamericano de Instalación de Software Libre organizado junto a la comunidad de software libre de Bolivia.",
    date: "27 ABR",
    location: "FCyT — UMSS",
    category: "Comunidad invitada",
    image: "/events/flisol.jpg",
    status: "past",
    href: "#",
  },
  {
    id: "aws-community-day",
    title: "AWS Community Day",
    description:
      "Evento de la comunidad AWS Bolivia donde se compartieron experiencias y casos de uso de la nube en el contexto local.",
    date: "14 JUN",
    location: "Hotel Diplomat, Cochabamba",
    category: "Comunidad invitada",
    image: "/events/aws-community-day.jpg",
    status: "past",
    href: "#",
  },
];

// ── Proyectos SCESI ───────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: "postulatte",
    title: "Postulatte",
    description: "Plataforma de gestión de postulaciones a la sociedad",
    status: "En desarrollo",
  },
  {
    id: "scesiapp",
    title: "ScesiApp",
    description: "—",
    status: "En desarrollo",
  },
];
