import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().url({ message: "DATABASE_URL debe ser una URL PostgreSQL válida" }),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET debe tener al menos 16 caracteres"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET debe tener al menos 16 caracteres"),
  JWT_ACCESS_TTL: z.string().regex(/^\d+[smh]$/, "JWT_ACCESS_TTL debe ser como 15m, 30s u 1h").default("15m"),
  JWT_REFRESH_TTL: z.string().regex(/^\d+[smhd]$/, "JWT_REFRESH_TTL debe ser como 7d").default("7d"),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  STORAGE_PROVIDER: z.enum(["local", "cloudinary"]).default("local"),
  STORAGE_LOCAL_DIR: z.string().default("storage"),
  CLOUDINARY_URL: z.string().optional(),
  MAIL_PROVIDER: z.enum(["console", "resend", "smtp"]).default("console"),
  MAIL_FROM: z.string().default("SCESI <no-reply@scesi.org>"),
  RESEND_API_KEY: z.string().optional(),
  APP_PUBLIC_URL: z.string().url().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const detalles = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(env)"}: ${issue.message}`)
    .join("\n");
  // La app no inicia si faltan variables de entorno (PRD §10).
  console.error(`Configuración de entorno inválida:\n${detalles}`);
  process.exit(1);
}

const raw = parsed.data;

export type Env = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseUrl: string;
  isProd: boolean;
  isTest: boolean;
  jwt: { accessSecret: string; refreshSecret: string; accessTtl: string; refreshTtl: string };
  corsOrigin: string;
  storage: { provider: "local" | "cloudinary"; localDir: string };
  mail: { provider: "console" | "resend" | "smtp"; from: string };
  appPublicUrl: string;
};

export const env: Env = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  databaseUrl: raw.DATABASE_URL,
  isProd: raw.NODE_ENV === "production",
  isTest: raw.NODE_ENV === "test",
  jwt: {
    accessSecret: raw.JWT_ACCESS_SECRET,
    refreshSecret: raw.JWT_REFRESH_SECRET,
    accessTtl: raw.JWT_ACCESS_TTL,
    refreshTtl: raw.JWT_REFRESH_TTL,
  },
  corsOrigin: raw.CORS_ORIGIN,
  storage: { provider: raw.STORAGE_PROVIDER, localDir: raw.STORAGE_LOCAL_DIR },
  mail: { provider: raw.MAIL_PROVIDER, from: raw.MAIL_FROM },
  appPublicUrl: raw.APP_PUBLIC_URL,
};
