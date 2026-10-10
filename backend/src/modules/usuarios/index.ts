import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { UsuariosRepository } from "./usuarios.repository.js";
import { UsuariosService } from "./usuarios.service.js";
import { UsuariosController } from "./usuarios.controller.js";
import { buildUsuariosRouter } from "./usuarios.routes.js";

export function createUsuariosModule(db: PrismaClient): { router: Router; service: UsuariosService } {
  const repository = new UsuariosRepository(db);
  const service = new UsuariosService(repository);
  const controller = new UsuariosController(service);
  return { router: buildUsuariosRouter(controller), service };
}

export { UsuariosService } from "./usuarios.service.js";
