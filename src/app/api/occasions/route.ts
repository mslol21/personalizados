import { collection, occasionSchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getOccasions, saveOccasions } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const occasions = await getOccasions(isAdmin && includeAll);
    return NextResponse.json(occasions);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const occasions = collection(occasionSchema, await readJson(request));
    if (!Array.isArray(occasions)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    await saveOccasions(occasions);
    return NextResponse.json({ success: true, occasions });
  } catch (error) {
    return apiError(error);
  }
}
