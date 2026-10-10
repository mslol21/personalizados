import { NextResponse } from "next/server";
import { authConfigured, verifyAdminPassword, createAdminToken, isSameOrigin, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/auth";
import { readJson, apiError } from "@/lib/api";

// Bounded process-wide throttle: no untrusted forwarding header can bypass it.
// A multi-instance deployment requires a shared limiter at the reverse proxy.
let windowStart = 0;
let attempts = 0;
export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
    if (!authConfigured()) return NextResponse.json({ error: "Acesso administrativo não configurado no servidor." }, { status: 503 });
    const now = Date.now();
    if (now - windowStart > 5 * 60 * 1000) { windowStart = now; attempts = 0; }
    if (++attempts > 30) return NextResponse.json({ error: "Muitas tentativas. Aguarde cinco minutos." },
      { status: 429, headers: { "Retry-After": "300" } });
    const body = await readJson(request);
    const password = typeof body === "object" && body !== null && "password" in body ? body.password : undefined;
    if (!verifyAdminPassword(password)) return NextResponse.json({ error: "Senha incorreta. Tente novamente." }, { status: 401 });
    const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, createAdminToken(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      maxAge: SESSION_SECONDS, path: "/",
    });
    return response;
  } catch (error) { return apiError(error); }
}
