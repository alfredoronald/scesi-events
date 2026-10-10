import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { CertificadosController } from "./certificados.controller.js";

const eventoIdSchema = z.object({ eventoId: z.string().min(1).max(140) });
const idSchema = z.object({ id: z.string().uuid() });
const emitirSchema = z.object({ inscripcionId: z.string().uuid() });
const codigoSchema = z.object({ codigo: z.string().min(6).max(32) });

export function buildCertificadosRouter(controller: CertificadosController): Router {
  const router = Router();

  router.get("/certificados/elegibilidad", requireAuth, (req, res) => controller.elegibilidad(req, res));
  router.post("/certificados", requireAuth, validate({ body: emitirSchema }), (req, res) => controller.emitir(req, res));
  router.post("/eventos/:eventoId/certificados/emitir", requireAuth, validate({ params: eventoIdSchema }), (req, res) =>
    controller.emitirMasivo(req, res),
  );
  router.get("/certificados/:id/pdf", optionalAuth, validate({ params: idSchema }), (req, res) => controller.pdf(req, res));
  router.get("/certificados/verificar/:codigo", validate({ params: codigoSchema }), (req, res) => controller.verificar(req, res));

  return router;
}
