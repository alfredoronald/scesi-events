import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { FeedbackRepository } from "./feedback.repository.js";
import { FeedbackService } from "./feedback.service.js";
import { FeedbackController } from "./feedback.controller.js";
import { buildFeedbackRouter } from "./feedback.routes.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";

export function createFeedbackModule(
  db: PrismaClient,
  eventosService: EventosService,
  eventosPolicies: EventosPolicies,
): { router: Router; service: FeedbackService } {
  const repository = new FeedbackRepository(db);
  const service = new FeedbackService(repository, eventosService, eventosPolicies);
  const controller = new FeedbackController(service);
  return { router: buildFeedbackRouter(controller), service };
}

export { FeedbackService } from "./feedback.service.js";
export { calcularNps } from "./feedback.repository.js";
