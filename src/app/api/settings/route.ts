import { settingsSchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const updates = settingsSchema.partial().parse(await readJson(request));
    const settings = updateSettings(updates);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return apiError(error);
  }
}
