export type ActivityRecord = {
  id: string;
  /** Hora de inicio en24 h, p. ej. "08:00". */
  time: string;
  title: string;
  location: string;
  responsible: string;
};

export type ActivityDay = {
  day: number;
  /** Mes en mayúsculas, p. ej. "SEP". */
  month: string;
  /** Día de la semana en mayúsculas, p. ej. "DOMINGO". */
  weekday: string;
  activities: ActivityRecord[];
};

/** Cronograma de actividades del organizador. */
export const activitySchedule: ActivityDay[] = [
  {
    day: 28,
    month: "SEP",
    weekday: "DOMINGO",
    activities: [
      {
        id: "registro-acreditacion",
        time: "08:00",
        title: "Registro y acreditación",
        location: "Acceso principal",
        responsible: "Staff de registro",
      },
      {
        id: "ceremonia-apertura",
        time: "09:30",
        title: "Ceremonia de apertura",
        location: "Auditorio A",
        responsible: "Directiva SCESI",
      },
      {
        id: "ia-aplicada",
        time: "10:15",
        title: "IA aplicada: de la idea al prototipo",
        location: "Auditorio A",
        responsible: "Valeria Pinto",
      },
      {
        id: "almuerzo-networking",
        time: "12:00",
        title: "Almuerzo y networking",
        location: "Patio central",
        responsible: "Staff logístico",
      },
      {
        id: "inicio-retos",
        time: "14:00",
        title: "Inicio de retos",
        location: "Laboratorios 1-4",
        responsible: "Mentores",
      },
    ],
  },
];
