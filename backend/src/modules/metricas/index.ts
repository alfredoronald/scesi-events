import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { MetricasRepository } from "./metricas.repository.js";
import { MetricasService } from "./metricas.service.js";
import { MetricasController } from "./metricas.controller.js";
import { buildMetricasRouter } from "./metricas.routes.js";

export function createMetricasModule(db: PrismaClient): { router: Router; service: MetricasService } {
  const repository = new MetricasRepository(db);
  const service = new MetricasService(repository);
  const controller = new MetricasController(service);
  return { router: buildMetricasRouter(controller), service };
}

export { MetricasService } from "./metricas.service.js";
