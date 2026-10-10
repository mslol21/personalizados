import { NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";
    const isAdmin = isAdminRequest(request);

    // Only admins or explicit draft request can see drafts; public visitors only see confirmed & published
    const services = getServices(isAdmin && includeDrafts);
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Erro ao buscar serviços." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const services = await request.json();
    if (!Array.isArray(services)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveServices(services);
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Error updating services:", error);
    return NextResponse.json({ error: "Erro ao salvar serviços." }, { status: 500 });
  }
}
