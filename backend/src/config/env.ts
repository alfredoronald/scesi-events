import "dotenv/config";

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entre 1 y 65535.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Copia backend/.env.example a backend/.env.");
}

export const env = {
  port,
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
};
