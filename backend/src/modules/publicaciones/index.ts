import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { PublicacionesRepository } from "./publicaciones.repository.js";
import { PublicacionesService } from "./publicaciones.service.js";
import { PublicacionesController } from "./publicaciones.controller.js";
import { buildPublicacionesRouter } from "./publicaciones.routes.js";

export function createPublicacionesModule(db: PrismaClient): { router: Router; service: PublicacionesService } {
  const repository = new PublicacionesRepository(db);
  const service = new PublicacionesService(repository);
  const controller = new PublicacionesController(service);
  return { router: buildPublicacionesRouter(controller), service };
}

export { PublicacionesService } from "./publicaciones.service.js";
