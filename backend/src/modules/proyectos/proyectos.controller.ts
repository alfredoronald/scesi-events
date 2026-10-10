import type { Request, Response } from "express";
import { created, noContent, ok, pageMeta } from "../../shared/http/responses.js";
import type { ProyectosService } from "./proyectos.service.js";
import type { ListarProyectosQuery } from "./proyectos.schemas.js";

export class ProyectosController {
  constructor(private readonly service: ProyectosService) {}

  async listar(req: Request, res: Response): Promise<void> {
    const query = req.validated.query as ListarProyectosQuery;
    const { data, total, page, pageSize } = await this.service.listar(query, req.user);
    ok(res, data, pageMeta(page, pageSize, total));
  }

  async detalle(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.detalle(id, req.user));
  }

  async crear(req: Request, res: Response): Promise<void> {
    created(res, await this.service.crear(req.validated.body as never, req.user!));
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
}
