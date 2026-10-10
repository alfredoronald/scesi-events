import { logger } from "../../shared/utils/logger.js";
import type { MailPayload, Mailer } from "./types.js";

export class ConsoleMailer implements Mailer {
  async send(payload: MailPayload): Promise<void> {
    logger.info({ to: payload.to, subject: payload.subject }, "Correo enviado (console)");
    logger.debug({ text: payload.text ?? payload.html }, "Contenido del correo");
  }
}
