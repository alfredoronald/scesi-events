import { Router } from "express";
import { findEventById, listEvents } from "./events.repository.js";
import type { EventListQuery } from "./events.types.js";

export const eventsRouter = Router();

function parseListQuery(query: Record<string, unknown>): EventListQuery | null {
  const period = query.period ?? "upcoming";
  const limit = query.limit ?? "12";
  const offset = query.offset ?? "0";

  if (period !== "upcoming" && period !== "past") return null;
  if (typeof limit !== "string" || !/^\d+$/.test(limit)) return null;
  if (typeof offset !== "string" || !/^\d+$/.test(offset)) return null;

  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);
  if (parsedLimit < 1 || parsedLimit > 50 || !Number.isSafeInteger(parsedOffset)) return null;

  return { period, limit: parsedLimit, offset: parsedOffset };
}

eventsRouter.get("/", async (req, res) => {
  const query = parseListQuery(req.query);
  if (!query) {
    res.status(400).json({ error: "Parámetros inválidos: period=upcoming|past, limit=1..50, offset>=0." });
    return;
  }

  res.json(await listEvents(query));
});

eventsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    res.status(400).json({ error: "El identificador del evento debe ser un UUID." });
    return;
  }

  const event = await findEventById(id);
  if (!event) {
    res.status(404).json({ error: "Evento no encontrado." });
    return;
  }

  res.json({ data: event });
});
