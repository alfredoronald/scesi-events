import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { AsistenciaRepository } from "./asistencia.repository.js";
import { AsistenciaService, ManualCheckinStrategy, QrCheckinStrategy } from "./asistencia.service.js";
import { AsistenciaController } from "./asistencia.controller.js";
import { buildAsistenciaRouter } from "./asistencia.routes.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";

export function createAsistenciaModule(
  db: PrismaClient,
  eventosService: EventosService,
  eventosPolicies: EventosPolicies,
): { router: Router; service: AsistenciaService } {
  const repository = new AsistenciaRepository(db);
  const service = new AsistenciaService(repository, eventosService, eventosPolicies, {
    qr: new QrCheckinStrategy(repository, eventosService, eventosPolicies),
    manual: new ManualCheckinStrategy(repository, eventosService, eventosPolicies),
  });
  const controller = new AsistenciaController(service);
  return { router: buildAsistenciaRouter(controller), service };
}

export { AsistenciaService } from "./asistencia.service.js";
