import { NextResponse } from "next/server";
import { isSameOrigin, SESSION_COOKIE } from "@/lib/auth";
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "strict", maxAge: 0, path: "/" });
  return response;
}
