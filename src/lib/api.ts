import { NextResponse } from "next/server";
import { z } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function readBytes(request: Request, maxBytes: number): Promise<Uint8Array> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBytes) throw new ApiError(413, "Requisição muito grande.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "Corpo da requisição obrigatório.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new ApiError(413, "Requisição muito grande."); }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}

export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new ApiError(415, "Envie dados no formato JSON.");
  }
  const bytes = await readBytes(request, 1024 * 1024);
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new ApiError(400, "JSON inválido."); }
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: "Dados inválidos. Confira os campos e formatos." }, { status: 400 });
  }
  console.error("API operation failed", error instanceof Error ? error.message : "unknown error");
  return NextResponse.json({ error: "Não foi possível concluir a operação." }, { status: 500 });
}
