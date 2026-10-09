export type OrganizerKind = "scesi" | "guest";

export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  /** Etiqueta del badge: "Organizado por SCESI" / "Comunidad invitada". */
  organizer: string;
  organizerKind: OrganizerKind;
  /** Ruta bajo /public; cadena vacía cuando aún no hay foto del evento. */
  image: string;
  /** ¿Pertenece al semestre en curso? (filtro "Este semestre"). */
  thisSemester: boolean;
  /** ¿Aparece en "Eventos recomendados" del Resumen? */
  recommended: boolean;
  // TODO: sustituir por /dashboard/eventos/[slug] cuando exista el detalle.
  href: string;
};

/**
 * Catálogo tipado de eventos (fuente única de datos del dashboard).
 * Cuando exista la API se sustituye por un fetch en el Server Component,
 * manteniendo los mismos tipos.
 */
export const events: EventRecord[] = [
  {
    id: "feria-internacional-del-libro",
    title: "Feria Internacional del Libro",
    description:
      "Tendremos un stand abierto para conversar sobre tecnología, comunidad y las oportunidades que construimos desde SCESI.",
    date: "05–15 SEP",
    location: "FECO, Cochabamba",
    organizer: "Comunidad invitada",
    organizerKind: "guest",
    image: "/feria-internacional-libro.jpg",
    thisSemester: false,
    recommended: false,
    href: "/dashboard/explorar",
  },
  {
    id: "hackathon-scesi",
    title: "Hackathon SCESI",
    description:
      "24 horas para convertir ideas en soluciones. Forma tu equipo, elige un reto y construye algo que importe.",
    date: "28 SEP",
    location: "FCyT — UMSS",
    organizer: "Organizado por SCESI",
    organizerKind: "scesi",
    image: "/events/hackathon-scesi.jpg",
    thisSemester: true,
    recommended: true,
    href: "/dashboard/explorar",
  },
  {
    id: "devtalks-ia-sin-humo",
    title: "DevTalks: IA sin humo",
    description:
      "Una conversación directa sobre inteligencia artificial, sus posibilidades reales y cómo empezar a crear con ella.",
    date: "12 OCT",
    location: "Auditorio MEMI",
    organizer: "Organizado por SCESI",
    organizerKind: "scesi",
    image: "/events/devtalks-ia-sin-humo.jpg",
    thisSemester: true,
    recommended: true,
    href: "/dashboard/explorar",
  },
  {
    id: "taller-git-github",
    title: "Taller de Git & GitHub",
    description:
      "Controla tus proyectos sin miedo: flujo de trabajo, ramas, pull requests y colaboración en equipo, desde cero.",
    date: "26 OCT",
    location: "Laboratorio 3 — FCyT",
    organizer: "Organizado por SCESI",
    organizerKind: "scesi",
    image: "",
    thisSemester: true,
    recommended: false,
    href: "/dashboard/explorar",
  },
];
