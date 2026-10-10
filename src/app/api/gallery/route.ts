import { collection, gallerySchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
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
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const items = collection(gallerySchema, await readJson(request));
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveGalleryItems(items);
    return NextResponse.json({ success: true, gallery: items });
  } catch (error) {
    return apiError(error);
  }
}
