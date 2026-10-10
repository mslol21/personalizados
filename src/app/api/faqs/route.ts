import { NextResponse } from "next/server";
import { getFaqs, saveFaqs } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const isAdmin = isAdminRequest(request);

    const faqs = getFaqs(isAdmin && includeAll);
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Erro ao buscar perguntas frequentes." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const faqs = await request.json();
    if (!Array.isArray(faqs)) {
      return NextResponse.json({ error: "Formato inválido. Esperado array." }, { status: 400 });
    }

    saveFaqs(faqs);
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return NextResponse.json({ error: "Erro ao salvar perguntas frequentes." }, { status: 500 });
  }
}
