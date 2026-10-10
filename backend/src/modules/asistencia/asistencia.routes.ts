import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import { apiRateLimit } from "../../shared/middlewares/rate-limit.js";
import type { AsistenciaController } from "./asistencia.controller.js";
import { buscarParaManualSchema, checkinManualSchema, checkinQrSchema, listarAsistenciaQuerySchema } from "./asistencia.schemas.js";

const eventoIdSchema = z.object({ eventoId: z.string().uuid() });

const checkinLimiter = apiRateLimit({ windowMs: 60 * 1000, max: 60, message: "Demasiados escaneos seguidos. Espera un momento." });

export function buildAsistenciaRouter(controller: AsistenciaController): Router {
  const router = Router();
  router.post("/asistencia/checkout", requireAuth, requireRole("ADMIN", "ORGANIZADOR", "STAFF"), validate({ body: checkinManualSchema }), (req, res) => controller.checkout(req, res));

  router.post(
    "/asistencia/checkin",
    checkinLimiter,
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR", "STAFF"),
    validate({ body: checkinQrSchema }),
    (req, res) => controller.checkinQr(req, res),
  );
  router.post(
    "/asistencia/checkin-manual",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR", "STAFF"),
    validate({ body: checkinManualSchema }),
    (req, res) => controller.checkinManual(req, res),
  );
  router.get(
    "/asistencia/buscar",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR", "STAFF"),
    validate({ query: buscarParaManualSchema }),
    (req, res) => controller.buscar(req, res),
  );
  router.get(
    "/eventos/:eventoId/asistencia",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR", "STAFF"),
    validate({ params: eventoIdSchema, query: listarAsistenciaQuerySchema }),
    (req, res) => controller.listarPorEvento(req, res),
  );

  return router;
}
