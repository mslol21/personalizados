import { NextResponse } from "next/server";
import { verifyAdminPassword, createAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Senha incorreta. Tente novamente." },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Autenticado com sucesso",
    });

    // Set secure cookie
    response.cookies.set("criativo_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao realizar login." },
      { status: 500 }
    );
  }
}
