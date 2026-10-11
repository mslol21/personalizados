import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getStore } from "@/lib/storage";
import { usesSupabase, supabaseRequest } from "@/lib/supabase-server";
import { apiError } from "@/lib/api";

export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  try {
    const { fileName } = await params;
    if (!usesSupabase() || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.webp$/.test(fileName)) {
      return new NextResponse(null, { status: 404 });
    }
    if (!isAdminRequest(request)) {
      const image = `/uploads/${fileName}`;
      const store = await getStore();
      const published = store.products.some(p => p.isPublished && p.images.includes(image)) ||
        store.categories.some(c => c.isPublished && c.image === image) ||
        store.gallery.some(g => g.isPublished && g.image === image) ||
        store.services.some(s => s.status === "confirmado_publicado" && s.image === image);
      if (!published) return new NextResponse(null, { status: 404, headers: { "Cache-Control": "private, no-store" } });
    }
    const response = await supabaseRequest(`/storage/v1/object/authenticated/catalog-photos/${fileName}`);
    return new NextResponse(await response.arrayBuffer(), { headers: {
      "Content-Type": "image/webp", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch (error) { return apiError(error); }
}
