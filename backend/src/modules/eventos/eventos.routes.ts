import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { EventosController } from "./eventos.controller.js";
import {
  actualizarEventoSchema,
  asignarStaffSchema,
  cambiarEstadoSchema,
  crearEventoSchema,
  listarEventosQuerySchema,
} from "./eventos.schemas.js";

const idOrSlugSchema = z.object({ idOrSlug: z.string().min(1).max(140) });

export function buildEventosRouter(controller: EventosController): Router {
  const router = Router();

  router.get("/", optionalAuth, validate({ query: listarEventosQuerySchema }), (req, res) => controller.listar(req, res));
  router.get("/:idOrSlug", optionalAuth, validate({ params: idOrSlugSchema }), (req, res) => controller.detalle(req, res));

  router.post(
    "/",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ body: crearEventoSchema }),
    (req, res) => controller.crear(req, res),
  );
  router.patch(
    "/:idOrSlug",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: idOrSlugSchema, body: actualizarEventoSchema }),
    (req, res) => controller.actualizar(req, res),
  );
  router.patch(
    "/:idOrSlug/estado",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: idOrSlugSchema, body: cambiarEstadoSchema }),
    (req, res) => controller.cambiarEstado(req, res),
  );
  router.delete("/:idOrSlug", requireAuth, requireRole("ADMIN"), validate({ params: idOrSlugSchema }), (req, res) =>
    controller.eliminar(req, res),
  );
  router.put(
    "/:idOrSlug/staff",
    requireAuth,
    requireRole("ADMIN", "ORGANIZADOR"),
    validate({ params: idOrSlugSchema, body: asignarStaffSchema }),
    (req, res) => controller.asignarStaff(req, res),
  );

  return router;
}
