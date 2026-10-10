import { NextResponse } from "next/server";
import { getOccasions, saveOccasions } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const occasions = getOccasions(isAdmin && includeAll);
    return NextResponse.json(occasions);
  } catch (error) {
    console.error("Error fetching occasions:", error);
    return NextResponse.json({ error: "Erro ao buscar ocasiões." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const occasions = await request.json();
    if (!Array.isArray(occasions)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveOccasions(occasions);
    return NextResponse.json({ success: true, occasions });
  } catch (error) {
    console.error("Error updating occasions:", error);
    return NextResponse.json({ error: "Erro ao salvar ocasiões." }, { status: 500 });
  }
}
