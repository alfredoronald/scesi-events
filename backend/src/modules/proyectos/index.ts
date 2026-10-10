import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { ProyectosRepository } from "./proyectos.repository.js";
import { ProyectosService } from "./proyectos.service.js";
import { ProyectosController } from "./proyectos.controller.js";
import { buildProyectosRouter } from "./proyectos.routes.js";

export function createProyectosModule(db: PrismaClient): { router: Router; service: ProyectosService } {
  const repository = new ProyectosRepository(db);
  const service = new ProyectosService(repository);
  const controller = new ProyectosController(service);
  return { router: buildProyectosRouter(controller), service };
}

export { ProyectosService } from "./proyectos.service.js";
