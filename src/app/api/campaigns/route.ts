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
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Erro ao buscar campanhas." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const campaigns = await request.json();
    if (!Array.isArray(campaigns)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveCampaigns(campaigns);
    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("Error updating campaigns:", error);
    return NextResponse.json({ error: "Erro ao salvar campanhas." }, { status: 500 });
  }
}
