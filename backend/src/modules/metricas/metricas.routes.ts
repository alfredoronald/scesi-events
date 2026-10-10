import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../shared/middlewares/auth.js";
import { validate } from "../../shared/middlewares/validate.js";
import type { MetricasController } from "./metricas.controller.js";

export function buildMetricasRouter(controller: MetricasController): Router {
  const router = Router();
  const guard = [requireAuth, requireRole("ADMIN", "ORGANIZADOR")] as const;

  router.get("/metricas/eventos", ...guard, (req, res) => controller.resumenEventos(req, res));
  router.get("/metricas/embudo", ...guard, (req, res) => controller.embudo(req, res));
  router.get("/metricas/afluencia", ...guard, (req, res) => controller.afluencia(req, res));
  router.get("/metricas/actividades", ...guard, (req, res) => controller.actividades(req, res));
  router.get("/metricas/satisfaccion", ...guard, (req, res) => controller.satisfaccion(req, res));
  router.get("/metricas/recurrencia", ...guard, (req, res) => controller.recurrencia(req, res));
  router.get("/metricas/perfil", ...guard, (req, res) => controller.perfil(req, res));
  router.get("/metricas/comparacion", ...guard, validate({ query: z.object({ ids: z.string().min(1) }) }), (req, res) =>
    controller.comparacion(req, res),
  );
  router.get("/metricas/tipos", ...guard, (req, res) => controller.porTipo(req, res));
  router.get("/metricas/contenido", ...guard, (req, res) => controller.contenido(req, res));
  router.get("/metricas/asistencias-mensuales", ...guard, (req, res) => controller.asistenciasPorMes(req, res));

  return router;
}
