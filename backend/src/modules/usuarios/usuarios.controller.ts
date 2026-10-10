import type { Request, Response } from "express";
import { created, ok, pageMeta, noContent } from "../../shared/http/responses.js";
import type { UsuariosService } from "./usuarios.service.js";
import type { ListarUsuariosQuery } from "./usuarios.schemas.js";
import { toUsuarioDto } from "../auth/index.js";

export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  async listar(req: Request, res: Response): Promise<void> {
    const query = req.validated.query as ListarUsuariosQuery;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { data, total } = await this.service.listar(query, page, pageSize);
    ok(res, data, pageMeta(page, pageSize, total));
  }

  async conteos(_req: Request, res: Response): Promise<void> {
    ok(res, await this.service.conteosPorRol());
  }

  async crear(req: Request, res: Response): Promise<void> {
    const usuario = await this.service.crear(req.validated.body as never);
    created(res, toUsuarioDto(usuario));
  }

  async actualizar(req: Request, res: Response): Promise<void> {
    const { id } = req.validated.params as { id: string };
    const usuario = await this.service.actualizar(id, req.validated.body as never);
    ok(res, toUsuarioDto(usuario));
  }

  async perfil(req: Request, res: Response): Promise<void> {
    ok(res, await this.service.perfil(req.user!.id));
  }

  async actualizarPerfil(req: Request, res: Response): Promise<void> {
    const usuario = await this.service.actualizarPerfil(req.user!.id, req.validated.body as never);
    ok(res, toUsuarioDto(usuario));
  }

  async cambiarPassword(req: Request, res: Response): Promise<void> {
    await this.service.cambiarPassword(req.user!.id, req.validated.body as never);
    noContent(res);
  }
}
