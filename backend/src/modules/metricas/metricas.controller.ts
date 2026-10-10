import type { Request, Response } from "express";
import { ok } from "../../shared/http/responses.js";
import type { MetricasService } from "./metricas.service.js";

export class MetricasController {
  constructor(private readonly service: MetricasService) {}

  resumenEventos = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.resumenEventos(req.user!));
  embudo = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.embudo(req.user!));
  afluencia = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.afluencia(req.user!));
  actividades = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.actividades(req.user!));
  satisfaccion = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.satisfaccion(req.user!));
  recurrencia = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.recurrencia(req.user!));
  perfil = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.perfil(req.user!));
  contenido = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.contenido(req.user!));
  asistenciasPorMes = async (req: Request, res: Response): Promise<void> => ok(res, await this.service.asistenciasPorMes(req.user!));

  async comparacion(req: Request, res: Response): Promise<void> {
    const { ids } = req.validated.query as { ids: string };
    const lista = ids.split(",").map((id) => id.trim()).filter((id) => /^[0-9a-f-]{36}$/i.test(id));
    ok(res, await this.service.comparacion(req.user!, lista));
  }

  async porTipo(req: Request, res: Response): Promise<void> {
    ok(res, await this.service.porTipo(req.user!));
  }
}
