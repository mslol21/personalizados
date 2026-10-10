"use client";

import React, { useState, useMemo } from "react";
import { Product, CategoryItem, OccasionItem } from "@/types";
import { ProductCard } from "./ProductCard";
import { Search, Filter, X, Sparkles, MessageCircle, ArrowUpDown } from "lucide-react";
import { STORE_INFO } from "@/lib/constants";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: CategoryItem[];
  occasions: OccasionItem[];
  initialCategory?: string;
  initialOccasion?: string;
  initialQuery?: string;
}

export function CatalogClient({
  initialProducts,
  categories,
  occasions,
  initialCategory = "todas",
  initialOccasion = "todas",
  initialQuery = "",
}: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [sortBy, setSortBy] = useState<"featured" | "name-asc" | "price-asc" | "price-desc">("featured");

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (!product.isPublished) return false;

      // Category filter
      if (selectedCategory !== "todas" && product.category !== selectedCategory) {
        return false;
      }

      // Occasion filter
      if (
        selectedOccasion !== "todas" &&
        (!product.occasions || !product.occasions.includes(selectedOccasion))
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "price-asc") {
        const priceA = a.price ?? 999999;
        const priceB = b.price ?? 999999;
        return priceA - priceB;
      }
      if (sortBy === "price-desc") {
        const priceA = a.price ?? 0;
        const priceB = b.price ?? 0;
        return priceB - priceA;
      }
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [initialProducts, selectedCategory, selectedOccasion, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("todas");
    setSelectedOccasion("todas");
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "todas" ||
    selectedOccasion !== "todas";

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-subtle space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-graphite-400" />
            <input
              type="text"
              placeholder="Buscar por caneca, garrafa, taça, azulejo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-gold-500 focus:bg-white text-sm text-brand-graphite-900 placeholder-brand-graphite-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-graphite-400 hover:text-brand-graphite-700 p-1"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-graphite-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-8 py-3 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-gold-500 focus:bg-white text-sm text-brand-graphite-900 font-medium transition-colors appearance-none cursor-pointer"
              aria-label="Ordenar produtos por"
            >
              <option value="featured">Destaques Primeiro</option>
              <option value="name-asc">Nome (A - Z)</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-brand-border/60">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-brand-gold-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-graphite-600">
              Categorias:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("todas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "todas"
                  ? "bg-brand-gold-700 text-white shadow-subtle"
                  : "bg-brand-bg text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
              }`}
            >
              Todas as Categorias
            </button>

            {categories
              .filter((c) => c.isPublished)
              .map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-brand-gold-700 text-white shadow-subtle"
                      : "bg-brand-bg text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>

        {/* Occasions Pills */}
        <div className="pt-2 border-t border-brand-border/60">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-graphite-600">
              Ocasiões:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedOccasion("todas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedOccasion === "todas"
                  ? "bg-brand-graphite-800 text-white shadow-subtle"
                  : "bg-brand-bg text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
              }`}
            >
              Todas as Ocasiões
            </button>

            {occasions
              .filter((o) => o.isPublished)
              .map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setSelectedOccasion(occ.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedOccasion === occ.slug
                      ? "bg-brand-graphite-800 text-white shadow-subtle"
                      : "bg-brand-bg text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
                  }`}
                >
                  {occ.name}
                </button>
              ))}
          </div>
        </div>

        {/* Active Filter Tags Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/60 text-xs">
            <span className="text-brand-graphite-600">
              Exibindo <strong>{filteredProducts.length}</strong> de {initialProducts.length} produtos
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-semibold text-brand-gold-800 hover:text-brand-gold-900 underline"
            >
              <X className="w-3.5 h-3.5" />
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-brand-surface rounded-3xl border border-brand-border shadow-subtle space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-700 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-brand-graphite-900">
            Nenhum produto encontrado com os filtros selecionados
          </h3>
          <p className="text-xs sm:text-sm text-brand-graphite-600 leading-relaxed">
            Não encontrou o que procura? Você pode limpar os filtros ou chamar nossa equipe no WhatsApp para criarmos um personalizado sob medida com a sua ideia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-brand-graphite-900 bg-brand-muted hover:bg-brand-border transition-colors"
            >
              Ver Todos os Produtos
            </button>
            <a
              href={`${STORE_INFO.whatsappLink}?text=${encodeURIComponent(`Olá! Procurei por "${searchQuery}" no site e gostaria de saber se vocês fazem esse personalizado.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-subtle"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar Personalização Sob Medida</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
