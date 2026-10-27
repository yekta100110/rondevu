import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import process from "node:process";

function key() {
  const value = Buffer.from(process.env.RONDEVU_WEBHOOK_REPLAY_KEY ?? "", "base64");
  if (value.length !== 32) throw new Error("Webhook replay encryption key is not configured");
  return value;
}

export function encryptReplayBody(body: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64");
}

export function decryptReplayBody(encoded: string): string {
  const data = Buffer.from(encoded, "base64");
  if (data.length < 29) throw new Error("Invalid encrypted delivery");
  const decipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
  decipher.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8");
}
