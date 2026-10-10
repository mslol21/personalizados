"use client";

import React from "react";
import Link from "next/link";
import { CategoryItem, Product } from "@/types";
import { DynamicIcon } from "./DynamicIcon";
import { ArrowRight } from "lucide-react";

interface CategoryNavProps {
  categories: CategoryItem[];
  products: Product[];
}

export function CategoryNav({ categories, products }: CategoryNavProps) {
  // Count published products per category and filter out empty ones
  const categoriesWithProducts = categories
    .map((cat) => {
      const count = products.filter(
        (p) => p.isPublished && p.category === cat.slug
      ).length;
      return { ...cat, count };
    })
    .filter((cat) => cat.count > 0 && cat.isPublished);

  if (categoriesWithProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-brand-bg border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-gold-700 mb-1">
              Catálogo de Produtos
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-graphite-900 tracking-tight">
              Categorias em Destaque
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-700 hover:text-brand-gold-800 transition-colors group"
          >
            <span>Ver todos os produtos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {categoriesWithProducts.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?category=${category.slug}`}
              className="group flex flex-col p-4 rounded-2xl bg-brand-surface border border-brand-border/80 hover:border-brand-gold-400 hover:bg-brand-gold-50/30 transition-all shadow-subtle hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold-50 border border-brand-gold-200/80 flex items-center justify-center text-brand-gold-700 group-hover:bg-brand-gold-700 group-hover:text-white transition-colors mb-3">
                <DynamicIcon name={category.iconName} size={20} />
              </div>
              <h3 className="font-display text-base font-bold text-brand-graphite-900 group-hover:text-brand-gold-800 transition-colors leading-snug line-clamp-1">
                {category.name}
              </h3>
              <p className="text-xs text-brand-graphite-600 mt-1 line-clamp-2">
                {category.description}
              </p>
              <div className="mt-auto pt-3 flex items-center justify-between text-[11px] font-semibold text-brand-gold-700">
                <span>{category.count} {category.count === 1 ? "item" : "itens"}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  Ver <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
