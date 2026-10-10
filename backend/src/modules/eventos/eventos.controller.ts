import type { Request, Response } from "express";
import { created, noContent, ok, pageMeta } from "../../shared/http/responses.js";
import type { EventosService } from "./eventos.service.js";
import type { ListarEventosQuery } from "./eventos.schemas.js";

export class EventosController {
  constructor(private readonly service: EventosService) {}

  async listar(req: Request, res: Response): Promise<void> {
    const query = req.validated.query as ListarEventosQuery;
    const resultado = await this.service.listar(query, req.user);
    ok(res, resultado.data, pageMeta(resultado.page, resultado.pageSize, resultado.total));
  }

  async detalle(req: Request, res: Response): Promise<void> {
    const { idOrSlug } = req.validated.params as { idOrSlug: string };
    ok(res, await this.service.detalle(idOrSlug, req.user));
  }

  async crear(req: Request, res: Response): Promise<void> {
    created(res, await this.service.crear(req.validated.body as never, req.user!));
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { idOrSlug } = req.validated.params as { idOrSlug: string };
    ok(res, await this.service.actualizar(idOrSlug, req.validated.body as never, req.user!));
  }

  async cambiarEstado(req: Request, res: Response): Promise<void> {
    const { idOrSlug } = req.validated.params as { idOrSlug: string };
    const { estado } = req.validated.body as { estado: "borrador" | "publicado" | "en_curso" | "cerrado" };
    ok(res, await this.service.cambiarEstado(idOrSlug, estado, req.user!));
  }

  async eliminar(req: Request, res: Response): Promise<void> {
    const { idOrSlug } = req.validated.params as { idOrSlug: string };
    await this.service.eliminar(idOrSlug, req.user!);
    noContent(res);
  }

  async asignarStaff(req: Request, res: Response): Promise<void> {
    const { idOrSlug } = req.validated.params as { idOrSlug: string };
    const { staffIds } = req.validated.body as { staffIds: string[] };
    ok(res, await this.service.asignarStaff(idOrSlug, staffIds, req.user!));
  }
}
