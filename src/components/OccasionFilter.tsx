"use client";

import React from "react";
import Link from "next/link";
import { OccasionItem } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface OccasionFilterProps {
  occasions: OccasionItem[];
  selectedOccasion?: string;
}

export function OccasionFilter({ occasions, selectedOccasion }: OccasionFilterProps) {
  const publishedOccasions = occasions.filter((o) => o.isPublished);

  if (publishedOccasions.length === 0) return null;

  return (
    <section className="py-14 bg-brand-bg border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Inspiração Sob Medida</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-graphite-900 tracking-tight">
            Escolha pela Ocasião
          </h2>
          <p className="text-sm text-brand-graphite-600 mt-1">
            Encontre a lembrança perfeita para o momento exato que você deseja celebrar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publishedOccasions.map((occasion) => {
            const isSelected = selectedOccasion === occasion.slug;
            return (
              <Link
                key={occasion.id}
                href={`/catalogo?occasion=${occasion.slug}`}
                className={`group flex items-start p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-brand-gold-50 border-brand-gold-400 ring-2 ring-brand-gold-400/20"
                    : "bg-brand-surface border-brand-border hover:border-brand-gold-300 hover:shadow-card"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${occasion.colorBadge || "bg-brand-gold-50 text-brand-gold-800 border-brand-gold-200"}`}
                    >
                      {occasion.name}
                    </span>
                  </div>
                  {occasion.description && (
                    <p className="text-xs text-brand-graphite-600 line-clamp-2 leading-relaxed">
                      {occasion.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-gold-700 group-hover:text-brand-gold-800">
                    <span>Ver personalizados</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
