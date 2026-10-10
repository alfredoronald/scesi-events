import type { Router } from "express";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { buildAuthRouter } from "./auth.routes.js";
import type { PrismaClient } from "@prisma/client";

export function createAuthModule(db: PrismaClient): { router: Router; service: AuthService } {
  const repository = new AuthRepository(db);
  const service = new AuthService(repository);
  const controller = new AuthController(service);
  return { router: buildAuthRouter(controller), service };
}

export { AuthService, toUsuarioDto } from "./auth.service.js";
export type { UsuarioDto, AuthPayload } from "./auth.types.js";
