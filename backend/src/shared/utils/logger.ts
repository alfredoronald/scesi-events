import pino from "pino";
import { env } from "../../config/env.js";

export const logger = pino({
  level: env.nodeEnv === "test" ? "silent" : "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(env.nodeEnv === "development"
    ? { transport: { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } } }
    : {}),
});
