import { productSchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const occasion = searchParams.get("occasion");
    const search = searchParams.get("q")?.toLowerCase();
    const isFeatured = searchParams.get("featured");
    const includeAll = searchParams.get("includeAll") === "true";

    const isAdmin = isAdminRequest(request);
    const products = await getProducts(isAdmin && includeAll);

    let filtered = products;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (occasion) {
      filtered = filtered.filter((p) => p.occasions && p.occasions.includes(occasion));
    }

    if (isFeatured === "true") {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.categoryName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(filtered);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login no painel administrativo." },
        { status: 401 }
      );
    }

    const raw = await readJson(request);
    const normalized = raw && typeof raw === "object" && !Array.isArray(raw) ? { ...raw, ...("slug" in raw && raw.slug === "" ? { slug: undefined } : {}) } : raw;
    const input = productSchema.partial().extend({ name: productSchema.shape.name, category: productSchema.shape.category }).parse(normalized);
    const body = input;

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Nome e Categoria são obrigatórios." },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newProduct = await createProduct({
      name: body.name,
      slug: slug,
      category: body.category,
      categoryName: body.categoryName || body.category,
      occasions: body.occasions || ["geral"],
      description: body.description || "",
      details: body.details || [],
      price: body.price,
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished ?? false,
      images: body.images && body.images.length > 0 ? body.images : ["/images/products/caneca-personalizada-1.svg"],
      minQuantity: body.minQuantity ? Number(body.minQuantity) : 1,
      customizationOptions: body.customizationOptions || {
        allowNameOrPhrase: true,
        allowTheme: true,
        allowPhotoReference: true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
