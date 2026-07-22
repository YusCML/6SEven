import crypto from "crypto";

const COOKIE_NAME = "ruta_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;
const SESSION_SECRET =
  process.env.RUTA_SESSION_SECRET ?? "development-session-secret";

export type SessionUser = {
  name: string;
  email: string;
  issuedAt: number;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function createSignature(payload: string) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
}

export function createSessionCookie(user: Omit<SessionUser, "issuedAt">) {
  const payload = {
    name: user.name,
    email: user.email,
    issuedAt: Date.now(),
  } satisfies SessionUser;

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = createSignature(encodedPayload);
  const cookieValue = `${encodedPayload}.${signature}`;

  return `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS};`;
}

export function parseSessionCookie(cookieValue?: string) {
  if (!cookieValue) {
    return null;
  }

  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(encodedPayload);

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const decodedPayload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionUser;

      if (!decodedPayload.email || !decodedPayload.name) {
        return null;
      }

      return decodedPayload;
    } catch {
      return null;
    }
  }

  return null;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`;
}
