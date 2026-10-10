import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { ProyectosController } from "./proyectos.controller.js";
import { actualizarProyectoSchema, crearProyectoSchema, listarProyectosQuerySchema } from "./proyectos.schemas.js";

const idSchema = z.object({ id: z.string().uuid() });

export function buildProyectosRouter(controller: ProyectosController): Router {
  const router = Router();

  router.get("/", validate({ query: listarProyectosQuerySchema }), (req, res) => controller.listar(req, res));
  router.get("/:id", validate({ params: idSchema }), (req, res) => controller.detalle(req, res));
  router.post("/", requireAuth, requireRole("ADMIN"), validate({ body: crearProyectoSchema }), (req, res) =>
    controller.crear(req, res),
  );
  router.patch("/:id", requireAuth, requireRole("ADMIN"), validate({ params: idSchema, body: actualizarProyectoSchema }), (req, res) =>
    controller.actualizar(req, res),
  );
  router.delete("/:id", requireAuth, requireRole("ADMIN"), validate({ params: idSchema }), (req, res) =>
    controller.eliminar(req, res),
  );

  return router;
}
