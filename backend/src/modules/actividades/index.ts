import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { ActividadesRepository } from "./actividades.repository.js";
import { ActividadesService } from "./actividades.service.js";
import { ActividadesController } from "./actividades.controller.js";
import { buildActividadesRouter } from "./actividades.routes.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";

export function createActividadesModule(
  db: PrismaClient,
  eventosService: EventosService,
  eventosPolicies: EventosPolicies,
): { router: Router; service: ActividadesService } {
  const repository = new ActividadesRepository(db);
  const service = new ActividadesService(repository, eventosService, eventosPolicies);
  const controller = new ActividadesController(service);
  return { router: buildActividadesRouter(controller), service };
}

export { ActividadesService } from "./actividades.service.js";
