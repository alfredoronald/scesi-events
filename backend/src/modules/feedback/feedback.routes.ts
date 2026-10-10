import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { FeedbackController } from "./feedback.controller.js";
import { calificarActividadSchema, calificarEventoSchema } from "./feedback.schemas.js";

const eventoIdSchema = z.object({ eventoId: z.string().min(1).max(140) });
const idSchema = z.object({ id: z.string().uuid() });

export function buildFeedbackRouter(controller: FeedbackController): Router {
  const router = Router();

  router.post("/eventos/:eventoId/calificaciones", requireAuth, validate({ params: eventoIdSchema, body: calificarEventoSchema }), (req, res) =>
    controller.calificarEvento(req, res),
  );
  router.post("/actividades/:id/calificaciones", requireAuth, validate({ params: idSchema, body: calificarActividadSchema }), (req, res) =>
    controller.calificarActividad(req, res),
  );
  router.get("/eventos/:eventoId/calificaciones/resumen", requireAuth, validate({ params: eventoIdSchema }), (req, res) =>
    controller.resumenEvento(req, res),
  );

  return router;
}
