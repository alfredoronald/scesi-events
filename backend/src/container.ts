import type { Router } from "express";
import { prisma } from "./shared/database/prisma.js";
import { eventBus } from "./shared/events/event-bus.js";
import { createMailer } from "./infrastructure/mailer/factory.js";
import { createStorageProvider } from "./infrastructure/storage/factory.js";
import { generateQrDataUrl } from "./infrastructure/qr/qr-generator.js";
import { env } from "./config/env.js";
import { createAuthModule } from "./modules/auth/index.js";
import { createUsuariosModule } from "./modules/usuarios/index.js";
import { createEventosModule } from "./modules/eventos/index.js";
import { createInscripcionesModule } from "./modules/inscripciones/index.js";
import { createAsistenciaModule } from "./modules/asistencia/index.js";
import { createActividadesModule } from "./modules/actividades/index.js";
import { createFeedbackModule } from "./modules/feedback/index.js";
import { createCertificadosModule } from "./modules/certificados/index.js";
import { createProyectosModule } from "./modules/proyectos/index.js";
import { createPublicacionesModule } from "./modules/publicaciones/index.js";
import { createMetricasModule } from "./modules/metricas/index.js";


export function buildContainer() {
  const mailer = createMailer();
  const storage = createStorageProvider();

  const auth = createAuthModule(prisma);
  const usuarios = createUsuariosModule(prisma);
  const eventos = createEventosModule(prisma);
  const inscripciones = createInscripcionesModule(prisma, eventos.service, eventos.policies, storage);
  const asistencia = createAsistenciaModule(prisma, eventos.service, eventos.policies);
  const actividades = createActividadesModule(prisma, eventos.service, eventos.policies);
  const feedback = createFeedbackModule(prisma, eventos.service, eventos.policies);
  const certificados = createCertificadosModule(prisma, eventos.service, eventos.policies);
  const proyectos = createProyectosModule(prisma);
  const publicaciones = createPublicacionesModule(prisma);
  const metricas = createMetricasModule(prisma);

  return {
    prisma,
    mailer,
    storage,
    modules: { auth, usuarios, eventos, inscripciones, asistencia, actividades, feedback, certificados, proyectos, publicaciones, metricas },
  };
}

export type Container = ReturnType<typeof buildContainer>;


export function registrarSuscriptores(container: Container): void {
  const { mailer } = container;

  eventBus.on("InscripcionConfirmada", async (evento) => {
    try {
      const qrTag = evento.qrToken
        ? `<p>Tu código de acceso es <strong>${evento.codigo}</strong>. Presenta tu QR al ingresar:</p>`
        : "";
      await mailer.send({
        to: evento.email,
        subject: `Inscripción confirmada — ${evento.eventoTitulo}`,
        html: `<h2>¡Nos vemos en ${evento.eventoTitulo}!</h2>${qrTag}<p>Gestiona tu entrada en ${env.appPublicUrl}/dashboard/entradas con el código <strong>${evento.codigo}</strong>.</p>`,
        text: `Inscripción confirmada en ${evento.eventoTitulo}. Código: ${evento.codigo}.`,
      });
    } catch (error) {
      console.error("Correo de inscripción falló (no bloquea el flujo):", error);
    }
  });

  eventBus.on("PagoConfirmado", async (evento) => {
    try {
      await mailer.send({
        to: evento.email,
        subject: `Pago confirmado — ${evento.eventoTitulo}`,
        html: `<h2>¡Pago confirmado!</h2><p>Tu inscripción a <strong>${evento.eventoTitulo}</strong> quedó confirmada. Tu código es <strong>${evento.codigo}</strong> y tu QR ya está disponible.</p>`,
        text: `Pago confirmado para ${evento.eventoTitulo}. Código: ${evento.codigo}.`,
      });
    } catch (error) {
      console.error("Correo de pago falló (no bloquea el flujo):", error);
    }
  });
}

export { generateQrDataUrl };
export type { Router };
