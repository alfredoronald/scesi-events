import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { UsuariosController } from "./usuarios.controller.js";
import {
  actualizarPerfilSchema,
  actualizarUsuarioSchema,
  cambiarPasswordSchema,
  crearUsuarioSchema,
  listarUsuariosQuerySchema,
} from "./usuarios.schemas.js";

const idSchema = z.object({ id: z.string().uuid() });

export function buildUsuariosRouter(controller: UsuariosController): Router {
  const router = Router();
  router.get("/", requireAuth, requireRole("ADMIN"), validate({ query: listarUsuariosQuerySchema }), (req, res) =>
    controller.listar(req, res),
  );
  router.get("/conteos", requireAuth, requireRole("ADMIN"), (req, res) => controller.conteos(req, res));

  router.patch("/me", requireAuth, validate({ body: actualizarPerfilSchema }), (req, res) =>
    controller.actualizarPerfil(req, res),
  );
  router.patch("/me/password", requireAuth, validate({ body: cambiarPasswordSchema }), (req, res) =>
    controller.cambiarPassword(req, res),
  );

  router.post("/", requireAuth, requireRole("ADMIN"), validate({ body: crearUsuarioSchema }), (req, res) =>
    controller.crear(req, res),
  );
  router.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate({ params: idSchema, body: actualizarUsuarioSchema }),
    (req, res) => controller.actualizar(req, res),
  );

  return router;
}
