"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.filter((p) => p.isFeatured && p.isPublished);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 bg-brand-surface border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
              <span>Destaques da Criativo Artes</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-graphite-900 tracking-tight">
              Mais Pedidos &amp; Recomendados
            </h2>
            <p className="text-sm text-brand-graphite-600 mt-1 max-w-xl">
              Confira os produtos favoritos de nossos clientes para presentear, comemorar datas especiais e equipar equipes.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-gold-800 bg-brand-gold-50 hover:bg-brand-gold-100 border border-brand-gold-200 transition-colors group shrink-0"
          >
            <span>Ver todo o catálogo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
