import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Não autorizado. Apenas administradores podem enviar imagens." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato de arquivo inválido. Permitido apenas PNG, JPG, WEBP e SVG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite máximo é de 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const extension = path.extname(file.name) || ".png";
    const cleanName = path
      .basename(file.name, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 30);

    const fileName = `${Date.now()}-${cleanName}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar upload." },
      { status: 500 }
    );
  }
}
