export type OrganizerComment = {
  id: string;
  author: string;
  initials: string;
  dateLabel: string;
  score: number;
  text: string;
};

/** Todas las calificaciones; solo algunas incluyen una opinión escrita. */
export const ratingDistribution = [
  { score: 5, count: 144 },
  { score: 4, count: 31 },
  { score: 3, count: 7 },
  { score: 2, count: 2 },
  { score: 1, count: 0 },
];

export const totalRatings = ratingDistribution.reduce((sum, row) => sum + row.count, 0);
export const averageRating = totalRatings > 0
  ? ratingDistribution.reduce((sum, row) => sum + row.score * row.count, 0) / totalRatings
  : 0;

export const organizerComments: OrganizerComment[] = [
  {
    id: "andrea-mendoza",
    author: "Andrea Mendoza",
    initials: "AM",
    dateLabel: "Hace 2 horas",
    score: 5,
    text: "Excelente organización y muy buenas mentorías. La charla de IA fue mi favorita.",
  },
  {
    id: "diego-salazar",
    author: "Diego Salazar",
    initials: "DS",
    dateLabel: "Ayer",
    score: 4,
    text: "Los retos estuvieron muy bien planteados. Mejoraría los tiempos del almuerzo.",
  },
  {
    id: "maria-rojas",
    author: "María Rojas",
    initials: "MR",
    dateLabel: "Ayer",
    score: 5,
    text: "Fue mi primer hackathon y el staff siempre estuvo disponible para ayudar.",
  },
];
