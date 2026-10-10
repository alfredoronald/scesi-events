import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { EventosRepository } from "./eventos.repository.js";
import { EventosPolicies } from "./eventos.policies.js";
import { EventosService } from "./eventos.service.js";
import { EventosController } from "./eventos.controller.js";
import { buildEventosRouter } from "./eventos.routes.js";

export function createEventosModule(db: PrismaClient): { router: Router; service: EventosService; policies: EventosPolicies } {
  const repository = new EventosRepository(db);
  const policies = new EventosPolicies();
  const service = new EventosService(repository, policies);
  const controller = new EventosController(service);
  return { router: buildEventosRouter(controller), service, policies };
}

export { EventosService } from "./eventos.service.js";
export { EventosPolicies } from "./eventos.policies.js";
export type { EventoDto } from "./eventos.types.js";
