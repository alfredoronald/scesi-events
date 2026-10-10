CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'ORGANIZADOR', 'STAFF', 'PARTICIPANTE');

CREATE TYPE "TipoEvento" AS ENUM ('CHARLA', 'TALLER', 'HACKATHON', 'CONGRESO', 'CTF');

CREATE TYPE "ModalidadEvento" AS ENUM ('PRESENCIAL', 'VIRTUAL', 'MIXTO');

CREATE TYPE "EstadoEvento" AS ENUM ('BORRADOR', 'PUBLICADO', 'EN_CURSO', 'CERRADO');

CREATE TYPE "ParticipacionScesi" AS ENUM ('ORGANIZED', 'INVITED', 'STAFF');

CREATE TYPE "CertificadoA" AS ENUM ('TODOS', 'SOLO_PONENTES');

CREATE TYPE "EstadoPago" AS ENUM ('NO_APLICA', 'PENDIENTE', 'CONFIRMADO', 'RECHAZADO');

CREATE TYPE "RolParticipacion" AS ENUM ('ASISTENTE', 'PONENTE', 'COMPETIDOR');

CREATE TYPE "TipoPublicacion" AS ENUM ('BLOG', 'PAPER');

CREATE TYPE "EstadoPublicacion" AS ENUM ('BORRADOR', 'PUBLICADO');

CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "celular" VARCHAR(30),
    "carrera" VARCHAR(120),
    "universidad" VARCHAR(160),
    "rol" "RolUsuario" NOT NULL DEFAULT 'PARTICIPANTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "revocado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "eventos" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "titulo" VARCHAR(160) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "modalidad" "ModalidadEvento" NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "lugar" VARCHAR(200) NOT NULL,
    "enlace_virtual" VARCHAR(500),
    "imagen_url" VARCHAR(500),
    "es_pago" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2),
    "cupo_maximo" INTEGER,
    "estado" "EstadoEvento" NOT NULL DEFAULT 'BORRADOR',
    "organizador_id" UUID NOT NULL,
    "participacion_scesi" "ParticipacionScesi" NOT NULL DEFAULT 'ORGANIZED',
    "entrega_certificado" BOOLEAN NOT NULL DEFAULT false,
    "certificado_a" "CertificadoA" NOT NULL DEFAULT 'TODOS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evento_staff" (
    "evento_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_staff_pkey" PRIMARY KEY ("evento_id","usuario_id")
);

CREATE TABLE "actividades" (
    "id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "titulo" VARCHAR(160) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ponente" VARCHAR(160) NOT NULL,
    "lugar" VARCHAR(200),
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,
    "tipo" VARCHAR(60) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inscripciones" (
    "id" UUID NOT NULL,
    "evento_id" UUID NOT NULL,
    "usuario_id" UUID,
    "nombre_completo" VARCHAR(160) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "celular" VARCHAR(30) NOT NULL,
    "carrera" VARCHAR(120),
    "universidad" VARCHAR(160),
    "consentimiento_datos" BOOLEAN NOT NULL,
    "acepta_comunicaciones" BOOLEAN NOT NULL DEFAULT false,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'NO_APLICA',
    "comprobante_url" VARCHAR(500),
    "codigo" VARCHAR(20) NOT NULL,
    "qr_token" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "asistencias" (
    "id" UUID NOT NULL,
    "inscripcion_id" UUID NOT NULL,
    "hora_checkin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrado_por_id" UUID NOT NULL,

    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "participaciones" (
    "id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "inscripcion_id" UUID NOT NULL,
    "rol" "RolParticipacion" NOT NULL DEFAULT 'ASISTENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participaciones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "calificaciones_evento" (
    "id" UUID NOT NULL,
    "inscripcion_id" UUID NOT NULL,
    "organizacion" INTEGER NOT NULL,
    "contenido" INTEGER NOT NULL,
    "general" INTEGER NOT NULL,
    "nps" INTEGER,
    "comentario" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_evento_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "calificaciones_actividad" (
    "id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "inscripcion_id" UUID NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_actividad_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "certificados" (
    "id" UUID NOT NULL,
    "inscripcion_id" UUID NOT NULL,
    "codigo_verificacion" VARCHAR(32) NOT NULL,
    "emitido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdf_url" VARCHAR(500),

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "proyectos" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(160) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen_url" VARCHAR(500),
    "github_url" VARCHAR(500),
    "categoria" VARCHAR(80),
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "creado_por" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "proyecto_colaboradores" (
    "id" UUID NOT NULL,
    "proyecto_id" UUID NOT NULL,
    "nombre" VARCHAR(160) NOT NULL,
    "usuario_id" UUID,

    CONSTRAINT "proyecto_colaboradores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "publicaciones" (
    "id" UUID NOT NULL,
    "tipo" "TipoPublicacion" NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "resumen" VARCHAR(500) NOT NULL,
    "contenido" TEXT,
    "pdf_url" VARCHAR(500),
    "autor_id" UUID NOT NULL,
    "autores_texto" VARCHAR(500),
    "doi" VARCHAR(120),
    "estado" "EstadoPublicacion" NOT NULL DEFAULT 'BORRADOR',
    "publicado_en" TIMESTAMP(3),
    "vistas" INTEGER NOT NULL DEFAULT 0,
    "descargas" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categorias" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "publicacion_categorias" (
    "publicacion_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,

    CONSTRAINT "publicacion_categorias_pkey" PRIMARY KEY ("publicacion_id","categoria_id")
);

CREATE TABLE "publicacion_likes" (
    "publicacion_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicacion_likes_pkey" PRIMARY KEY ("publicacion_id","usuario_id")
);

CREATE TABLE "publicacion_comentarios" (
    "id" UUID NOT NULL,
    "publicacion_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "texto" VARCHAR(2000) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publicacion_comentarios_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

CREATE INDEX "usuarios_rol_activo_idx" ON "usuarios"("rol", "activo");

CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

CREATE INDEX "refresh_tokens_usuario_id_idx" ON "refresh_tokens"("usuario_id");

CREATE UNIQUE INDEX "eventos_slug_key" ON "eventos"("slug");

CREATE INDEX "eventos_estado_fecha_inicio_idx" ON "eventos"("estado", "fecha_inicio");

CREATE INDEX "eventos_organizador_id_idx" ON "eventos"("organizador_id");

CREATE INDEX "evento_staff_usuario_id_idx" ON "evento_staff"("usuario_id");

CREATE INDEX "actividades_evento_id_hora_inicio_idx" ON "actividades"("evento_id", "hora_inicio");

CREATE UNIQUE INDEX "inscripciones_codigo_key" ON "inscripciones"("codigo");

CREATE UNIQUE INDEX "inscripciones_qr_token_key" ON "inscripciones"("qr_token");

CREATE INDEX "inscripciones_evento_id_idx" ON "inscripciones"("evento_id");

CREATE INDEX "inscripciones_email_idx" ON "inscripciones"("email");

CREATE INDEX "inscripciones_qr_token_idx" ON "inscripciones"("qr_token");

CREATE INDEX "inscripciones_usuario_id_idx" ON "inscripciones"("usuario_id");

CREATE UNIQUE INDEX "inscripciones_evento_id_email_key" ON "inscripciones"("evento_id", "email");

CREATE UNIQUE INDEX "asistencias_inscripcion_id_key" ON "asistencias"("inscripcion_id");

CREATE INDEX "asistencias_hora_checkin_idx" ON "asistencias"("hora_checkin");

CREATE INDEX "asistencias_registrado_por_id_idx" ON "asistencias"("registrado_por_id");

CREATE INDEX "participaciones_inscripcion_id_idx" ON "participaciones"("inscripcion_id");

CREATE UNIQUE INDEX "participaciones_actividad_id_inscripcion_id_key" ON "participaciones"("actividad_id", "inscripcion_id");

CREATE UNIQUE INDEX "calificaciones_evento_inscripcion_id_key" ON "calificaciones_evento"("inscripcion_id");

CREATE UNIQUE INDEX "calificaciones_actividad_actividad_id_inscripcion_id_key" ON "calificaciones_actividad"("actividad_id", "inscripcion_id");

CREATE UNIQUE INDEX "certificados_inscripcion_id_key" ON "certificados"("inscripcion_id");

CREATE UNIQUE INDEX "certificados_codigo_verificacion_key" ON "certificados"("codigo_verificacion");

CREATE INDEX "certificados_codigo_verificacion_idx" ON "certificados"("codigo_verificacion");

CREATE INDEX "proyectos_publicado_created_at_idx" ON "proyectos"("publicado", "created_at");

CREATE INDEX "proyecto_colaboradores_proyecto_id_idx" ON "proyecto_colaboradores"("proyecto_id");

CREATE UNIQUE INDEX "publicaciones_slug_key" ON "publicaciones"("slug");

CREATE INDEX "publicaciones_estado_tipo_publicado_en_idx" ON "publicaciones"("estado", "tipo", "publicado_en");

CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

CREATE INDEX "publicacion_categorias_categoria_id_idx" ON "publicacion_categorias"("categoria_id");

CREATE INDEX "publicacion_likes_usuario_id_idx" ON "publicacion_likes"("usuario_id");

CREATE INDEX "publicacion_comentarios_publicacion_id_created_at_idx" ON "publicacion_comentarios"("publicacion_id", "created_at");

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "eventos" ADD CONSTRAINT "eventos_organizador_id_fkey" FOREIGN KEY ("organizador_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "evento_staff" ADD CONSTRAINT "evento_staff_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "evento_staff" ADD CONSTRAINT "evento_staff_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "actividades" ADD CONSTRAINT "actividades_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "participaciones" ADD CONSTRAINT "participaciones_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "participaciones" ADD CONSTRAINT "participaciones_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calificaciones_evento" ADD CONSTRAINT "calificaciones_evento_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calificaciones_actividad" ADD CONSTRAINT "calificaciones_actividad_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calificaciones_actividad" ADD CONSTRAINT "calificaciones_actividad_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certificados" ADD CONSTRAINT "certificados_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "proyecto_colaboradores" ADD CONSTRAINT "proyecto_colaboradores_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proyecto_colaboradores" ADD CONSTRAINT "proyecto_colaboradores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "publicacion_categorias" ADD CONSTRAINT "publicacion_categorias_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "publicacion_categorias" ADD CONSTRAINT "publicacion_categorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "publicacion_likes" ADD CONSTRAINT "publicacion_likes_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "publicacion_likes" ADD CONSTRAINT "publicacion_likes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "publicacion_comentarios" ADD CONSTRAINT "publicacion_comentarios_publicacion_id_fkey" FOREIGN KEY ("publicacion_id") REFERENCES "publicaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "publicacion_comentarios" ADD CONSTRAINT "publicacion_comentarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
