import { PrismaClient } from "@prisma/client";
import { env } from "../../config/env.js";

export const prisma = new PrismaClient({
  log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
});

export type PrismaTx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export function withTransaction<T>(fn: (tx: PrismaTx) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn, { isolationLevel: "Serializable" });
}
