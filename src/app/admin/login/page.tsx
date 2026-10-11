"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Senha inválida. Tente novamente.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Erro de conexão ao tentar fazer login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-brand-primary-800 hover:text-brand-primary-900 font-semibold mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar ao site público</span>
          </Link>

          <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-primary-300 p-1 mx-auto shadow-subtle mb-3">
            <Image
              src="/images/brand/monogram-original.png"
              alt="Logo CA"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-graphite-900">
            Painel Administrativo
          </h1>
          <p className="text-xs text-brand-graphite-600 mt-1">
            Criativo Artes — Gerenciador de Catálogo &amp; Conteúdo
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-brand-surface py-8 px-6 sm:px-10 shadow-card rounded-3xl border border-brand-border">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-graphite-800 block">
                  Senha de Acesso:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-graphite-400" />
                  <input
                    type="password"
                    required
                    placeholder="Digite a senha administrativa"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary-500 focus:bg-white text-sm text-brand-graphite-900 transition-colors"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-primary-50/70 border border-brand-primary-200 text-[11px] text-brand-primary-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-primary-700 shrink-0 mt-0.5" />
                <span>
                  Área restrita à proprietária da Criativo Artes para atualização de produtos e fotos.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-primary-700 hover:bg-brand-primary-800 disabled:opacity-60 transition-all shadow-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600"
              >
                <span>{loading ? "Entrando..." : "Acessar Painel"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
