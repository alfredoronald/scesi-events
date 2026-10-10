import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { InscripcionesRepository } from "./inscripciones.repository.js";
import { InscripcionesService } from "./inscripciones.service.js";
import { InscripcionesController } from "./inscripciones.controller.js";
import { buildInscripcionesRouter } from "./inscripciones.routes.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";
import type { StorageProvider } from "../../infrastructure/storage/types.js";

export function createInscripcionesModule(
  db: PrismaClient,
  eventosService: EventosService,
  eventosPolicies: EventosPolicies,
  storage: StorageProvider,
): { router: Router; service: InscripcionesService } {
  const repository = new InscripcionesRepository(db);
  const service = new InscripcionesService(db, repository, eventosService, eventosPolicies, storage);
  const controller = new InscripcionesController(service);
  return { router: buildInscripcionesRouter(controller), service };
}

export { InscripcionesService } from "./inscripciones.service.js";
