import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be configured in production.");
  return value || "development-only-secret-change-me-before-deployment";
}
function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}
export function createSessionToken(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!Number.isInteger(user.exp) || user.exp <= Math.floor(Date.now() / 1000) || typeof user.id !== "string" || !user.id || typeof user.name !== "string" || typeof user.email !== "string" || !["customer", "staff", "admin"].includes(user.role)) return null;
    const { exp, ...safeUser } = user;
    return safeUser;
  } catch { return null; }
}
