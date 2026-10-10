import { NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const categories = getCategories(isAdmin && includeAll);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Erro ao buscar categorias." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const categories = await request.json();
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveCategories(categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json({ error: "Erro ao salvar categorias." }, { status: 500 });
  }
}
