import { collection, campaignSchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getCampaigns, saveCampaigns } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const isAdmin = isAdminRequest(request);

    const campaigns = getCampaigns(isAdmin && includeInactive);
    return NextResponse.json(campaigns);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const campaigns = collection(campaignSchema, await readJson(request));
    if (!Array.isArray(campaigns)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveCampaigns(campaigns);
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    return apiError(error);
  }
}
