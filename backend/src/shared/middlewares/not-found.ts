import type { RequestHandler } from "express";
import { NotFoundError } from "../errors/index.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Ruta ${req.method} ${req.originalUrl}`));
};
