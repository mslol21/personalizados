import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogClient } from "@/components/CatalogClient";
import { getProducts, getCategories, getOccasions, getSettings } from "@/lib/storage";

export const revalidate = 0;

export const metadata = {
  title: "Catálogo de Personalizados e Brindes | Criativo Artes",
  description:
    "Explore nossa linha completa de canecas de cerâmica, taças de gin, copos térmicos, azulejos com fotos e brindes para empresas. Personalize e solicite seu orçamento no WhatsApp.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; occasion?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = getProducts(false);
  const categories = getCategories(false);
  const occasions = getOccasions(false);
  const settings = getSettings();

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Page Title & Breadcrumb */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-700">
              Produtos &amp; Lembranças
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-graphite-900 tracking-tight mt-1">
              Catálogo de Personalizados
            </h1>
            <p className="text-sm text-brand-graphite-600 mt-1 max-w-2xl">
              Escolha seus itens favoritos, informe seus detalhes de personalização e monte sua lista para enviar diretamente pelo WhatsApp.
            </p>
          </div>

          {/* Interactive Catalog Filter & Grid */}
          <CatalogClient
            initialProducts={products}
            categories={categories}
            occasions={occasions}
            initialCategory={params.category || "todas"}
            initialOccasion={params.occasion || "todas"}
            initialQuery={params.q || ""}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
