import { productSchema } from "@/lib/validation";
import { readJson, apiError } from "@/lib/api";
import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/storage";
import { isAdminRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product || (!product.isPublished && !isAdminRequest(request))) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updates = productSchema.partial().parse(await readJson(request));

    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Produto não encontrado para atualização." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = isAdminRequest(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const success = deleteProduct(id);

    if (!success) {
      return NextResponse.json(
        { error: "Produto não encontrado para exclusão." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Produto excluído com sucesso." });
  } catch (error) {
    return apiError(error);
  }
}
