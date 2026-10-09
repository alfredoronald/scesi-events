import { readFile } from "node:fs/promises";
import { pool } from "./pool.js";

try {
  const sql = await readFile(new URL("../../sql/seed.demo.sql", import.meta.url), "utf8");
  await pool.query(sql);
  console.log("Datos de demostración insertados.");
} catch (error) {
  console.error("No se pudieron insertar los datos de demostración:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
