import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./shared/database/prisma.js";
import { logger } from "./shared/utils/logger.js";

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(`API SCESI escuchando en http://localhost:${env.port} (api: /api/v1)`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "Cerrando servidor…");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
