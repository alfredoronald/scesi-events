import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { PublicacionesController } from "./publicaciones.controller.js";
import {
  actualizarPublicacionSchema,
  comentarSchema,
  crearPublicacionSchema,
  listarPublicacionesQuerySchema,
} from "./publicaciones.schemas.js";

const idSchema = z.object({ id: z.string().min(1).max(220) });
const slugSchema = z.object({ slug: z.string().min(1).max(220) });

export function buildPublicacionesRouter(controller: PublicacionesController): Router {
  const router = Router();

  router.get("/", validate({ query: listarPublicacionesQuerySchema }), (req, res) => controller.listar(req, res));
  router.get("/:slug", validate({ params: slugSchema }), (req, res) => controller.detalle(req, res));
  router.post("/", requireAuth, validate({ body: crearPublicacionSchema }), (req, res) => controller.crear(req, res));
  router.patch("/:id", requireAuth, validate({ params: idSchema, body: actualizarPublicacionSchema }), (req, res) =>
    controller.actualizar(req, res),
  );
  router.delete("/:id", requireAuth, validate({ params: idSchema }), (req, res) => controller.eliminar(req, res));
  router.get("/:id/descarga", validate({ params: idSchema }), (req, res) => controller.descargar(req, res));
  router.post("/:id/like", requireAuth, validate({ params: idSchema }), (req, res) => controller.toggleLike(req, res));
  router.get("/:id/comentarios", validate({ params: idSchema }), (req, res) => controller.comentarios(req, res));
  router.post("/:id/comentarios", requireAuth, validate({ params: idSchema, body: comentarSchema }), (req, res) =>
    controller.comentar(req, res),
  );
  router.delete("/comentarios/:id", requireAuth, validate({ params: idSchema }), (req, res) =>
    controller.eliminarComentario(req, res),
  );

  return router;
}
