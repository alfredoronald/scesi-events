import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { requestId } from "./shared/middlewares/request-id.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";
import { notFoundHandler } from "./shared/middlewares/not-found.js";
import { buildContainer, registrarSuscriptores } from "./container.js";
import { prisma } from "./shared/database/prisma.js";


export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(requestId);

  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", db: "up" });
    } catch {
      res.status(503).json({ status: "degraded", db: "down" });
    }
  });

  const container = buildContainer();
  registrarSuscriptores(container);

  const api = express.Router();
  api.use("/auth", container.modules.auth.router);
  api.use(container.modules.inscripciones.router); // incluye /eventos/:id/inscripciones
  api.use(container.modules.asistencia.router); // incluye /eventos/:id/asistencia
  api.use(container.modules.feedback.router); // incluye /eventos/:id/calificaciones
  api.use(container.modules.actividades.router); // incluye /eventos/:id/actividades
  api.use(container.modules.certificados.router); // incluye /eventos/:id/certificados/emitir
  api.use("/eventos", container.modules.eventos.router);
  api.use("/usuarios", container.modules.usuarios.router);
  api.use("/proyectos", container.modules.proyectos.router);
  api.use("/publicaciones", container.modules.publicaciones.router);
  api.use(container.modules.metricas.router);

  app.use("/api/v1", api);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
