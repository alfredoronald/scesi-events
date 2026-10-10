import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../errors/index.js";

export function apiRateLimit(options: { windowMs: number; max: number; message?: string }) {
  const limiter = rateLimit({
    windowMs: options.windowMs,
    limit: options.max,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) => {
      next(new TooManyRequestsError(options.message));
    },
  });
  return limiter;
}
