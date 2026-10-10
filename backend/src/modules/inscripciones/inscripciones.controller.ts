import type { Request, Response } from "express";
import { created, ok, pageMeta } from "../../shared/http/responses.js";
import { ValidationError } from "../../shared/errors/index.js";
import type { InscripcionesService } from "./inscripciones.service.js";
import type { ListarInscripcionesQuery } from "./inscripciones.schemas.js";

function accesoDe(req: Request): { token?: string; user?: typeof req.user } {
  const token = (req.validated?.query as { token?: string } | undefined)?.token ?? (req.query.token as string | undefined);
  return { token, user: req.user };
}

export class InscripcionesController {
  constructor(private readonly service: InscripcionesService) {}

  async inscribir(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    created(res, await this.service.inscribir(eventoId, req.validated.body as never, req.user));
  }

  async listarPorEvento(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    const query = req.validated.query as ListarInscripcionesQuery;
    const { data, total, page, pageSize } = await this.service.listarPorEvento(eventoId, query, req.user!);
    ok(res, data, pageMeta(page, pageSize, total));
  }

  async exportarCsv(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    const { csv, filename } = await this.service.exportarCsv(eventoId, req.user!);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  }

  async misInscripciones(req: Request, res: Response): Promise<void> {
    ok(res, await this.service.misInscripciones(req.user!));
  }

  async detalle(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.detalle(id, accesoDe(req)));
  }

  async subirComprobante(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const file = req.file;
    if (!file) throw new ValidationError("Adjunta un archivo PDF.");
    ok(res, await this.service.subirComprobante(id, { buffer: file.buffer, mimeType: file.mimeType, size: file.size }, accesoDe(req)));
  }

  async decidirPago(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const { estado } = req.validated.body as { estado: "confirmado" | "rechazado" };
    ok(res, await this.service.decidirPago(id, estado, req.user!));
  }

  async qr(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.qr(id, accesoDe(req)));
  }
}
