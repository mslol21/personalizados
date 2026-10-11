import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { ApiError, apiError, readBytes } from "@/lib/api";
import { usesSupabase, supabaseRequest } from "@/lib/supabase-server";
import { assertWritableStore } from "@/lib/storage";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_SIZE = 5 * 1024 * 1024;
export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    assertWritableStore();
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data;")) throw new ApiError(415, "Use multipart/form-data.");
    const bytes = await readBytes(request, MAX_SIZE + 64 * 1024);
    const form = await new Response(Buffer.from(bytes), { headers: { "Content-Type": contentType } }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) throw new ApiError(400, "Envie uma imagem válida.");
    if (file.size > MAX_SIZE) throw new ApiError(413, "Limite de 5 MB por imagem.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new ApiError(400, "Use PNG, JPEG ou WebP. SVG não é permitido.");
    const buffer = Buffer.from(await file.arrayBuffer());
    let sanitized: Buffer;
    try {
      const image = sharp(buffer, { limitInputPixels: 25000000 });
      const meta = await image.metadata();
      const mime = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
      if (!(meta.format! in mime) || mime[meta.format as keyof typeof mime] !== file.type || (meta.pages || 1) > 1) {
        throw new Error("Invalid raster format");
      }
      sanitized = await image.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85 }).toBuffer();
    } catch { throw new ApiError(400, "Imagem inválida, animada ou com dimensões excessivas."); }
    if (sanitized.length > MAX_SIZE) throw new ApiError(413, "A imagem convertida excede 5 MB.");
    const fileName = `${randomUUID()}.webp`;
    if (usesSupabase()) {
      await supabaseRequest(`/storage/v1/object/catalog-photos/${fileName}`, {
        method: "POST", body: new Uint8Array(sanitized),
        headers: { "Content-Type": "image/webp", "x-upsert": "false", "cache-control": "0" },
      });
    } else {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(path.join(uploadsDir, fileName), sanitized, { flag: "wx" });
    }
    return NextResponse.json({ success: true, url: `/uploads/${fileName}`, fileName });
  } catch (error) { return apiError(error); }
}
