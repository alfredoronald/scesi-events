import type { NextFunction, Request, Response } from "express";
import { z, type ZodTypeAny } from "zod";
import { ValidationError } from "../errors/index.js";

type Part = "body" | "query" | "params";


export function validate(schemas: Partial<Record<Part, ZodTypeAny>>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validated: Record<string, unknown> = {};
      for (const part of ["body", "query", "params"] as const) {
        const schema = schemas[part];
        if (schema) {
          const source = part === "query" ? flattenQuery(req.query) : req[part];
          validated[part] = schema.parse(source);
        }
      }
      Object.assign(req, { validated });
      next();
    } catch (error) {
      next(translate(error));
    }
  };
}

function flattenQuery(query: Request["query"]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    result[key] = Array.isArray(value) ? value[value.length - 1] : value;
  }
  return result;
}

function translate(error: unknown): unknown {
  if (error instanceof z.ZodError) {
    return new ValidationError(
      "Datos inválidos.",
      error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    );
  }
  return error;
}

declare module "express-serve-static-core" {
  interface Request {
    validated: {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };
  }
}
