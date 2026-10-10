export type OrganizationSettings = {
  name: string;
  email: string;
  location: string;
  description: string;
};

export const defaultOrganizationSettings: OrganizationSettings = {
  name: "Sociedad Científica de Estudiantes de Sistemas e Informática",
  email: "contacto@scesi.org",
  location: "Cochabamba, Bolivia",
  description: "Comunidad científica dedicada a promover la tecnología, la investigación y el aprendizaje colaborativo.",
};

export const settingsSections = [
  { id: "general", label: "Información general" },
  { id: "notifications", label: "Notificaciones" },
  { id: "registrations", label: "Inscripciones" },
  { id: "privacy", label: "Privacidad y seguridad" },
  { id: "integrations", label: "Integraciones" },
] as const;

export type SettingsSection = typeof settingsSections[number]["id"];
