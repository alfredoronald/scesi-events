
export type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export interface Mailer {
  send(payload: MailPayload): Promise<void>;
}
