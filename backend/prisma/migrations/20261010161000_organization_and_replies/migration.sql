ALTER TABLE "calificaciones_evento" ADD COLUMN "respuesta" VARCHAR(2000);
CREATE TABLE "configuracion_organizacion" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "name" VARCHAR(160) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "location" VARCHAR(200) NOT NULL,
  "description" TEXT NOT NULL,
  CONSTRAINT "configuracion_organizacion_pkey" PRIMARY KEY ("id")
);
