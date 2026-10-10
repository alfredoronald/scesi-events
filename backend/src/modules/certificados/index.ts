import type { Router } from "express";
import type { PrismaClient } from "@prisma/client";
import { CertificadosRepository } from "./certificados.repository.js";
import { CertificadosService } from "./certificados.service.js";
import { CertificadosController } from "./certificados.controller.js";
import { buildCertificadosRouter } from "./certificados.routes.js";
import { PdfKitCertificateGenerator } from "../../infrastructure/pdf/certificate-pdf.js";
import type { EventosService, EventosPolicies } from "../eventos/index.js";

export function createCertificadosModule(
  db: PrismaClient,
  eventosService: EventosService,
  eventosPolicies: EventosPolicies,
): { router: Router; service: CertificadosService } {
  const repository = new CertificadosRepository(db);
  const service = new CertificadosService(
    repository,
    eventosService,
    eventosPolicies,
    new PdfKitCertificateGenerator(),
  );
  const controller = new CertificadosController(service);
  return { router: buildCertificadosRouter(controller), service };
}

export { CertificadosService } from "./certificados.service.js";
export { politicasPara } from "./certificado-eligibility.js";
