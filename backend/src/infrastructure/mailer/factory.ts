import { env } from "../../config/env.js";
import type { Mailer } from "./types.js";
import { ConsoleMailer } from "./console-mailer.js";

export function createMailer(): Mailer {
  switch (env.mail.provider) {
    case "resend":
    case "smtp":
      return new ConsoleMailer();
    case "console":
    default:
      return new ConsoleMailer();
  }
}
