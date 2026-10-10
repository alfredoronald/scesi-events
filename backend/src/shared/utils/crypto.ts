import { randomBytes, randomInt, createHash } from "node:crypto";

export function generateQrToken(): string {
  return randomBytes(24).toString("base64url");
}

export function generateInscriptionCode(): string {
  return `SC-${String(randomInt(1, 10000)).padStart(4, "0")}`;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateVerificationCode(): string {
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return `SCESI-${code.slice(0, 4)}-${code.slice(4)}`;
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
