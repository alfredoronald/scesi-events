export type EventPeriod = "upcoming" | "past";

export type Event = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  startsAt: string;
  endsAt: string;
  location: string;
  coverImageUrl: string | null;
  participationKind: "organized" | "invited" | "staff";
  registrationUrl: string | null;
};

export type EventListQuery = {
  period: EventPeriod;
  limit: number;
  offset: number;
};
