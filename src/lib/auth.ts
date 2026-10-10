import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const SESSION_SECONDS = 60 * 60 * 8;
export const SESSION_COOKIE = "criativo_admin_token";

export function authConfigured(): boolean {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;
  return Boolean(password && password.length >= 16 && secret && secret.length >= 32 &&
    password !== "criativo2026" && secret !== "criativo-artes-secret-key-2026-secure");
}

function signingKey(): Buffer {
  // Password rotation also invalidates existing sessions.
  return crypto.createHmac("sha256", process.env.JWT_SECRET!)
    .update(process.env.ADMIN_PASSWORD!).digest();
}

export function verifyAdminPassword(input: unknown): boolean {
  if (!authConfigured() || typeof input !== "string" || input.length > 1024) return false;
  const hash = (value: string) => crypto.createHash("sha256").update(value).digest();
  return crypto.timingSafeEqual(hash(input), hash(process.env.ADMIN_PASSWORD!));
}

export function createAdminToken(): string {
  if (!authConfigured()) throw new Error("Administrative authentication is not configured");
  return jwt.sign({ role: "admin" }, signingKey(), {
    algorithm: "HS256", expiresIn: SESSION_SECONDS,
    issuer: "criativo-artes", audience: "criativo-admin", jwtid: crypto.randomUUID(),
  });
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!authConfigured() || !token || token.length > 4096) return false;
  try {
    const payload = jwt.verify(token, signingKey(), {
      algorithms: ["HS256"], issuer: "criativo-artes", audience: "criativo-admin",
      maxAge: SESSION_SECONDS,
    });
    return typeof payload !== "string" && payload.role === "admin" &&
      typeof payload.exp === "number" && typeof payload.iat === "number" &&
      typeof payload.jti === "string";
  } catch { return false; }
}

export function parseCookies(header?: string | null): Record<string, string> {
  const result: Record<string, string> = Object.create(null);
  for (const part of (header || "").split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    try { result[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1)); }
    catch { /* Malformed cookies must not crash a public endpoint. */ }
  }
  return result;
}

export function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
    return origin === new URL(expected).origin;
  } catch { return false; }
}

export function isAdminRequest(request: Request): boolean {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !isSameOrigin(request)) return false;
  return verifyAdminToken(parseCookies(request.headers.get("cookie"))[SESSION_COOKIE]);
}
