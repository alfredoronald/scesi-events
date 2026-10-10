import { Router, raw, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import { apiRateLimit } from "../../shared/middlewares/rate-limit.js";
import type { InscripcionesController } from "./inscripciones.controller.js";
import { accesoSchema, confirmarPagoSchema, crearInscripcionSchema, listarInscripcionesQuerySchema } from "./inscripciones.schemas.js";

declare module "express-serve-static-core" {
  interface Request {
    file?: { buffer: Buffer; mimeType: string; size: number };
  }
}

const eventoIdSchema = z.object({ eventoId: z.string().min(1).max(140) });
const idSchema = z.object({ id: z.string().uuid() });

const inscribirLimiter = apiRateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: "Demasiadas inscripciones desde esta IP. Intenta más tarde." });

function singleFile(req: Request, _res: Response, next: NextFunction): void {
  raw({ type: ["application/pdf", "image/png", "image/jpeg", "image/webp"], limit: "6mb" })(req, _res, (err) => {
    if (err) {
      next(err);
      return;
    }
    if (Buffer.isBuffer(req.body)) {
      const mimeType = req.headers["content-type"] ?? "application/octet-stream";
      const size = req.body.byteLength;
      req.file = { buffer: req.body, mimeType, size };
    }
    next();
  });
}

export function buildInscripcionesRouter(controller: InscripcionesController): Router {
  const router = Router();

  // Inscripción pública (sin cuenta obligatoria)
  router.post(
    "/eventos/:eventoId/inscripciones",
    inscribirLimiter,
    validate({ params: eventoIdSchema, body: crearInscripcionSchema }),
    (req, res) => controller.inscribir(req, res),
  );

  // Inscritos de un evento (admin/organizador/staff — validación de recurso en servicio)
  router.get(
    "/eventos/:eventoId/inscripciones",
    requireAuth,
    validate({ params: eventoIdSchema, query: listarInscripcionesQuerySchema }),
    (req, res) => controller.listarPorEvento(req, res),
  );
  router.get("/eventos/:eventoId/inscripciones/export", requireAuth, validate({ params: eventoIdSchema }), (req, res) =>
    controller.exportarCsv(req, res),
  );

  // Mis entradas
  router.get("/inscripciones/me", requireAuth, (req, res) => controller.misInscripciones(req, res));

  // Detalle / comprobante / pago / QR de una inscripción
  router.get("/inscripciones/:id", optionalAuth, validate({ params: idSchema, query: accesoSchema }), (req, res) => controller.detalle(req, res));
  router.post("/inscripciones/:id/comprobante", singleFile, optionalAuth, validate({ params: idSchema, query: accesoSchema }), (req, res) =>
    controller.subirComprobante(req, res),
  );
  router.patch("/inscripciones/:id/pago", requireAuth, validate({ params: idSchema, body: confirmarPagoSchema }), (req, res) =>
    controller.decidirPago(req, res),
  );
  router.get("/inscripciones/:id/qr", optionalAuth, validate({ params: idSchema, query: accesoSchema }), (req, res) => controller.qr(req, res));

  return router;
}
