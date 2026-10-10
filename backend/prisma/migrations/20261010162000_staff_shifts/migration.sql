CREATE TABLE "turnos_staff" (
  "id" UUID NOT NULL,
  "evento_id" UUID NOT NULL,
  "usuario_id" UUID NOT NULL,
  "titulo" VARCHAR(160) NOT NULL,
  "lugar" VARCHAR(200) NOT NULL,
  "inicio" TIMESTAMP(3) NOT NULL,
  "fin" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "turnos_staff_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "turnos_staff_evento_id_usuario_id_fkey" FOREIGN KEY ("evento_id", "usuario_id") REFERENCES "evento_staff"("evento_id", "usuario_id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "turnos_staff_usuario_id_inicio_idx" ON "turnos_staff"("usuario_id", "inicio");
