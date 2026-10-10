import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors/index.js";
import { env } from "../../config/env.js";
import { logger } from "../utils/logger.js";
import type { Request } from "express";

function logError(error: unknown, req: Request): void {
  const l = req.log ?? logger;
  if (error instanceof AppError && error.statusCode < 500) {
    l.warn({ err: error.message, code: error.code }, "Error de cliente");
    return;
  }
  l.error({ err: error instanceof Error ? error.stack ?? error.message : String(error) }, "Error interno");
}


export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  logError(error, req);

  if (error instanceof ZodError) {
    const validation = new ValidationError(
      "Datos inválidos.",
      error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    );
    res.status(validation.statusCode).json({
      error: { code: validation.code, message: validation.message, details: validation.details },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: { code: "JSON_INVALIDO", message: "Cuerpo JSON inválido." } });
    return;
  }

  const fallback = env.isProd
    ? { code: "ERROR_INTERNO", message: "Error interno del servidor." }
    : {
        code: "ERROR_INTERNO",
        message: error instanceof Error ? error.message : "Error interno del servidor.",
        details: error instanceof Error ? { stack: error.stack?.split("\n").slice(0, 5) } : undefined,
      };
  res.status(500).json({ error: fallback });
};
