import type { Request, Response } from "express";
import { created, noContent, ok, pageMeta } from "../../shared/http/responses.js";
import type { PublicacionesService } from "./publicaciones.service.js";
import type { ListarPublicacionesQuery } from "./publicaciones.schemas.js";

function clienteDe(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "desconocido";
}

export class PublicacionesController {
  constructor(private readonly service: PublicacionesService) {}

  async listar(req: Request, res: Response): Promise<void> {
    const query = req.validated.query as ListarPublicacionesQuery;
    const { data, total, page, pageSize } = await this.service.listar(query, req.user);
    ok(res, data, pageMeta(page, pageSize, total));
  }

  async detalle(req: Request, res: Response): Promise<void> {
    const { slug } = req.validated.params as { slug: string };
    ok(res, await this.service.detallePorSlug(slug, req.user, clienteDe(req)));
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

  async descargar(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const { pdfUrl } = await this.service.descargar(id, clienteDe(req));
    res.redirect(302, pdfUrl);
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.toggleLike(id, req.user!));
  }

  async comentarios(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    ok(res, await this.service.comentarios(id));
  }

  async comentar(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const { texto } = req.validated.body as { texto: string };
    created(res, await this.service.comentar(id, texto, req.user!));
  }

  async eliminarComentario(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    await this.service.eliminarComentario(id, req.user!);
    noContent(res);
  }
}
