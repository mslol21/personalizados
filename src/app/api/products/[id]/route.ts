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

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produto." },
      { status: 500 }
    );
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
    const updates = await request.json();

    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Produto não encontrado para atualização." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto." },
      { status: 500 }
    );
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
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Erro ao excluir produto." },
      { status: 500 }
    );
  }
}
