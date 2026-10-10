import type { Request, Response } from "express";
import { created, ok } from "../../shared/http/responses.js";
import type { FeedbackService } from "./feedback.service.js";

export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  async calificarEvento(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    created(res, await this.service.calificarEvento(eventoId, req.validated.body as never, req.user!));
  }

  async calificarActividad(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    created(res, await this.service.calificarActividad(id, req.validated.body as never, req.user!));
  }

  async resumenEvento(req: Request, res: Response): Promise<void> {
    const { eventoId } = req.validated.params as { eventoId: string };
    ok(res, await this.service.resumenEvento(eventoId, req.user!));
  }
}
