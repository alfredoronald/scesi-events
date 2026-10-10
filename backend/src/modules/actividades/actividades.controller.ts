import type { Request, Response } from "express";
import { created, noContent, ok } from "../../shared/http/responses.js";
import type { ActividadesService } from "./actividades.service.js";

export class ActividadesController {
  constructor(private readonly service: ActividadesService) {}

  async listarPorEvento(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    ok(res, await this.service.listarPorEvento(eventoId));
  }

  async crear(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    created(res, await this.service.crear(eventoId, req.validated.body as never, req.user!));
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.actualizar(id, req.validated.body as never, req.user!));
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    await this.service.eliminar(id, req.user!);
    noContent(res);
  }

  async registrarParticipacion(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    created(res, await this.service.registrarParticipacion(id, req.validated.body as never, req.user!));
  }
}
