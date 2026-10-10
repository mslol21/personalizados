import { NextResponse } from "next/server";
import { getGalleryItems, saveGalleryItems } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const gallery = getGalleryItems(isAdmin && includeAll);
    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json({ error: "Erro ao buscar galeria." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const items = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveGalleryItems(items);
    return NextResponse.json({ success: true, gallery: items });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json({ error: "Erro ao salvar galeria." }, { status: 500 });
  }
}
