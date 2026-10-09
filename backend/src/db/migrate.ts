import { readFile } from "node:fs/promises";
import { pool } from "./pool.js";

try {
  const sql = await readFile(new URL("../../sql/001_create_events.sql", import.meta.url), "utf8");
  await pool.query(sql);
  console.log("Migración de eventos aplicada.");
} catch (error) {
  console.error("No se pudo aplicar la migración:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
