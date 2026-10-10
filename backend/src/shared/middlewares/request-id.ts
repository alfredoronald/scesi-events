import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    log: typeof logger;
  }
}

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = req.header("x-request-id") ?? randomUUID();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  req.log = logger.child({ requestId: id });
  next();
}
