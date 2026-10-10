import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { UnauthorizedError } from "../../shared/errors/index.js";
import { ok, created } from "../../shared/http/responses.js";
import type { AuthService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

export const REFRESH_COOKIE = "scesi_refresh";

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: refreshMaxAge(),
  });
}

function refreshMaxAge(): number {
  const match = /^(\d+)([smhd])$/.exec(env.jwt.refreshTtl);
  if (!match) return 7 * 24 * 3600 * 1000;
  const ms: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return Number(match[1]) * (ms[match[2] ?? "d"] ?? 86_400_000);
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/v1/auth" });
}

function readRefresh(req: Request): string | undefined {
  const cookie = req.cookies?.[REFRESH_COOKIE];
  if (typeof cookie === "string" && cookie.length > 0) return cookie;
  const body = req.validated?.body as { refreshToken?: string } | undefined;
  return body?.refreshToken;
}

export class AuthController {
  constructor(private readonly service: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    const input = req.validated.body as LoginInput;
    const { payload, refreshToken } = await this.service.login(input);
    setRefreshCookie(res, refreshToken);
    ok(res, payload);
  }

  async register(req: Request, res: Response): Promise<void> {
    const input = req.validated.body as RegisterInput;
    const { payload, refreshToken } = await this.service.register(input);
    setRefreshCookie(res, refreshToken);
    created(res, payload);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = readRefresh(req);
    if (!refreshToken) throw new UnauthorizedError("No hay sesión que renovar.");
    const { payload, refreshToken: nuevo } = await this.service.refresh(refreshToken);
    setRefreshCookie(res, nuevo);
    ok(res, payload);
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.service.logout(readRefresh(req));
    clearRefreshCookie(res);
    res.status(204).send();
  }

  async me(req: Request, res: Response): Promise<void> {
    const usuario = await this.service.me(req.user!.id);
    ok(res, usuario);
  }
}
