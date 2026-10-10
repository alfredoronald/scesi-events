import type { Request, Response } from "express";
import { created, ok } from "../../shared/http/responses.js";
import type { CertificadosService } from "./certificados.service.js";

export class CertificadosController {
  constructor(private readonly service: CertificadosService) {}

  async elegibilidad(req: Request, res: Response): Promise<void> {
    ok(res, await this.service.elegibilidadUsuario(req.user!));
  }

  async emitir(req: Request, res: Response): Promise<void> {
    const body = req.validated.body as { inscripcionId: string };
    created(res, await this.service.emitirPorInscripcion(body.inscripcionId, req.user!));
  }

  async emitirMasivo(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    ok(res, await this.service.emitirMasivo(eventoId, req.user!));
  }

  async pdf(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const buffer = await this.service.pdf(id, req.user);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="certificado-scesi.pdf"');
    res.status(200).send(buffer);
  }

  async verificar(req: Request, res: Response): Promise<void> {
    const { codigo } = req.validated.params as { codigo: string };
    ok(res, await this.service.verificar(codigo));
  }
}
