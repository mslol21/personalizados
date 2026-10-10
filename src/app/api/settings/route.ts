import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Erro ao buscar configurações." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const updates = await request.json();
    const settings = updateSettings(updates);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Erro ao salvar configurações." }, { status: 500 });
  }
}
