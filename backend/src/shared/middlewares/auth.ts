import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ForbiddenError, UnauthorizedError } from "../errors/index.js";

export type RolUsuario = "ADMIN" | "ORGANIZADOR" | "STAFF" | "PARTICIPANTE";

export type AuthUser = {
  id: string;
  rol: RolUsuario;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    next(new UnauthorizedError());
    return;
  }
  const token = header.slice(7).trim();
  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as jwt.JwtPayload & { sub?: string; rol?: RolUsuario };
    if (!payload.sub || !payload.rol) {
      next(new UnauthorizedError("Token inválido."));
      return;
    }
    req.user = { id: payload.sub, rol: payload.rol };
    next();
  } catch {
    next(new UnauthorizedError("Token inválido o expirado."));
  }
}

/** Autenticación opcional: si hay Bearer válido deja el usuario; si no, sigue anónimo. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7).trim(), env.jwt.accessSecret) as jwt.JwtPayload & {
      sub?: string;
      rol?: RolUsuario;
    };
    if (payload.sub && payload.rol) {
      req.user = { id: payload.sub, rol: payload.rol };
    }
  } catch {
    // Token inválido en ruta pública → se continúa como anónimo.
  }
  next();
}

/** Guard por rol reutilizable (RF-AUTH-05). */
export function requireRole(...roles: RolUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (!roles.includes(req.user.rol)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
