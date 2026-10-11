import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuotePageClient } from "@/components/QuotePageClient";
import { getSettings } from "@/lib/storage";

export const revalidate = 0;

export const metadata = {
  title: "Sua Lista de Orçamento | Criativo Artes Personalizados",
  description:
    "Revise os produtos selecionados, detalhes de personalização e solicite seu orçamento completo via WhatsApp com um clique.",
};

export default async function OrcamentoPage() {
  const settings = getSettings();

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary-700">
              Solicitação de Orçamento
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-graphite-900 tracking-tight mt-1">
              Sua Lista de Personalizados
            </h1>
            <p className="text-sm text-brand-graphite-600 mt-1 max-w-2xl">
              Confira os itens, ajuste quantidades e envie a lista formatada para a equipe da Criativo Artes no WhatsApp.
            </p>
          </div>

          <QuotePageClient />
        </div>
      </main>

      <Footer />
    </>
  );
}
