import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { ActividadesController } from "./actividades.controller.js";
import { actualizarActividadSchema, crearActividadSchema, crearParticipacionSchema } from "./actividades.schemas.js";

const eventoIdSchema = z.object({ eventoId: z.string().min(1).max(140) });
const idSchema = z.object({ id: z.string().uuid() });

export function buildActividadesRouter(controller: ActividadesController): Router {
  const router = Router();

  router.get("/eventos/:eventoId/actividades", optionalAuth, validate({ params: eventoIdSchema }), (req, res) =>
    controller.listarPorEvento(req, res),
  );
  router.post(
    "/eventos/:eventoId/actividades",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: eventoIdSchema, body: crearActividadSchema }),
    (req, res) => controller.crear(req, res),
  );
  router.patch(
    "/actividades/:id",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: idSchema, body: actualizarActividadSchema }),
    (req, res) => controller.actualizar(req, res),
  );
  router.delete("/actividades/:id", requireAuth, requireRole("ADMIN", "ORGANIZADOR"), validate({ params: idSchema }), (req, res) =>
    controller.eliminar(req, res),
  );
  router.post(
    "/actividades/:id/participaciones",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: idSchema, body: crearParticipacionSchema }),
    (req, res) => controller.registrarParticipacion(req, res),
  );

  return router;
}
