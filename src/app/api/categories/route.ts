import { collection, categorySchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const categories = await getCategories(isAdmin && includeAll);
    return NextResponse.json(categories);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const categories = collection(categorySchema, await readJson(request));
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    await saveCategories(categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return apiError(error);
  }
}
