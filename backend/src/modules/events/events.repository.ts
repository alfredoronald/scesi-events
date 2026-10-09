import { pool } from "../../db/pool.js";
import type { Event, EventListQuery } from "./events.types.js";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  starts_at: Date;
  ends_at: Date;
  location: string;
  cover_image_url: string | null;
  participation_kind: Event["participationKind"];
  registration_url: string | null;
};

const eventColumns = `id, slug, title, summary, starts_at, ends_at, location,
  cover_image_url, participation_kind, registration_url`;

function toEvent(row: EventRow): Event {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    startsAt: row.starts_at.toISOString(),
    endsAt: row.ends_at.toISOString(),
    location: row.location,
    coverImageUrl: row.cover_image_url,
    participationKind: row.participation_kind,
    registrationUrl: row.registration_url,
  };
}

export async function listEvents({ period, limit, offset }: EventListQuery) {
  // period se valida antes de llegar aquí; solo selecciona fragmentos SQL fijos.
  const dateCondition = period === "past" ? "ends_at < now()" : "ends_at >= now()";
  const order = period === "past" ? "ends_at DESC" : "starts_at ASC";

  const [rows, count] = await Promise.all([
    pool.query<EventRow>(
      `SELECT ${eventColumns} FROM events
       WHERE status = 'published' AND ${dateCondition}
       ORDER BY ${order}, id ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM events
       WHERE status = 'published' AND ${dateCondition}`,
    ),
  ]);

  return {
    data: rows.rows.map(toEvent),
    pagination: { period, limit, offset, total: Number(count.rows[0].total) },
  };
}

export async function findEventById(id: string): Promise<Event | null> {
  const result = await pool.query<EventRow>(
    `SELECT ${eventColumns} FROM events WHERE id = $1 AND status = 'published'`,
    [id],
  );
  return result.rows[0] ? toEvent(result.rows[0]) : null;
}
