import "server-only";
import { ApiError } from "./api";

export function usesSupabase(): boolean {
  const backend = process.env.CATALOG_BACKEND || (process.env.VERCEL ? "supabase" : "file");
  if (!["file", "supabase"].includes(backend)) throw new ApiError(503, "CATALOG_BACKEND inválido.");
  return backend === "supabase";
}

function config() {
  const raw = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!raw || !key) throw new ApiError(503, "Configure SUPABASE_URL e SUPABASE_SECRET_KEY no servidor para salvar o catálogo.");
  let url: URL;
  try { url = new URL(raw); } catch { throw new ApiError(503, "URL do Supabase inválida."); }
  if (url.protocol !== "https:" || !/^[a-z0-9]+\.supabase\.co$/.test(url.hostname) || url.port || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new ApiError(503, "Use a URL HTTPS do seu projeto Supabase.");
  }
  // Only secret keys and legacy service_role JWTs may reach the private catalog.
  if (!key.startsWith("sb_secret_")) {
    try {
      const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
      if (payload.role !== "service_role") throw new Error();
    } catch { throw new ApiError(503, "Use a chave secreta do Supabase, nunca a chave anon/publishable."); }
  }
  return { origin: url.origin, key };
}

export async function supabaseRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const { origin, key } = config();
  const headers = new Headers(options.headers);
  headers.set("apikey", key);
  if (!key.startsWith("sb_secret_")) headers.set("Authorization", `Bearer ${key}`);
  if (typeof options.body === "string") headers.set("Content-Type", "application/json");
  try {
    const response = await fetch(origin + endpoint, { ...options, headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      // Never log credentials, response bodies or database connection details.
      console.error("Supabase operation failed", response.status, endpoint.split("?")[0]);
      throw new ApiError(503, "Não foi possível acessar o catálogo no Supabase. Confira a chave secreta, as tabelas e o armazenamento.");
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(503, "O Supabase não respondeu. Tente novamente.");
  }
}
