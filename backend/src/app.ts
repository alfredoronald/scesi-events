import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import { eventsRouter } from "./modules/events/events.routes.js";

export const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.use("/api/events", eventsRouter);

const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor." });
};

app.use(handleError);
