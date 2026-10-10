import type { Request, Response } from "express";
import { created, ok, pageMeta } from "../../shared/http/responses.js";
import type { AsistenciaService } from "./asistencia.service.js";
import type { ListarAsistenciaQuery } from "./asistencia.schemas.js";

export class AsistenciaController {
  constructor(private readonly service: AsistenciaService) {}

  async checkinQr(req: Request, res: Response): Promise<void> {
    created(res, await this.service.checkinPorQr(req.validated.body as never, req.user!));
  }

  async checkinManual(req: Request, res: Response): Promise<void> {
    created(res, await this.service.checkinManual(req.validated.body as never, req.user!));
  }

  async buscar(req: Request, res: Response): Promise<void> {
    const { eventoId, buscar } = req.validated.query as { eventoId: string; buscar: string };
    ok(res, await this.service.buscar(eventoId, buscar, req.user!));
  }

  async listarPorEvento(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    const query = req.validated.query as ListarAsistenciaQuery;
    const { data, total, page, pageSize } = await this.service.listarPorEvento(eventoId, query, req.user!);
    ok(res, data, pageMeta(page, pageSize, total));
  }
}
