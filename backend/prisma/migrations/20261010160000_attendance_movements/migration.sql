ALTER TABLE "asistencias" ADD COLUMN "hora_checkout" TIMESTAMP(3), ADD COLUMN "punto_control" VARCHAR(120);
CREATE TABLE "movimientos_asistencia" (
  "id" UUID NOT NULL,
  "asistencia_id" UUID NOT NULL,
  "tipo" VARCHAR(10) NOT NULL,
  "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "punto_control" VARCHAR(120) NOT NULL,
  "registrado_por_id" UUID NOT NULL,
  CONSTRAINT "movimientos_asistencia_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "movimientos_asistencia_asistencia_id_fkey" FOREIGN KEY ("asistencia_id") REFERENCES "asistencias"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "movimientos_asistencia_asistencia_id_fecha_idx" ON "movimientos_asistencia"("asistencia_id", "fecha");
