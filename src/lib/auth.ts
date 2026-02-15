import { createHmac, createHash } from "crypto";

// Precomputed SHA-256 hash of the admin password
const PASSWORD_HASH =
  "229f65961ece079cbbe9cc7c6583857b31a0cf1775a85eb1c5d2d12044411828";

const TOKEN_EXPIRY_MS = 4 * 60 * 60 * 1000; // 4 hours

function getSecret(): string {
  // Use the password hash itself as HMAC secret — no extra env var needed
  return PASSWORD_HASH;
}

export async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function verifyPasswordHash(hash: string): boolean {
  return hash === PASSWORD_HASH;
}

export function createToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac("sha256", getSecret())
    .update(timestamp)
    .digest("hex");
  return `${timestamp}:${hmac}`;
}

export function verifyToken(token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  const [timestamp, hmac] = parts;
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts)) return false;
  if (Date.now() - ts > TOKEN_EXPIRY_MS) return false;
  const expected = createHmac("sha256", getSecret())
    .update(timestamp)
    .digest("hex");
  return hmac === expected;
}
