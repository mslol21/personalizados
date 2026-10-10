"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export function GallerySection({ galleryItems }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  const categories = [
    { id: "todos", label: "Todos os Trabalhos" },
    { id: "presentes", label: "Presentes Personalizados" },
    { id: "eventos", label: "Eventos & Festas" },
    { id: "brindes", label: "Brindes Corporativos" },
    { id: "comunicacao-visual", label: "Comunicação Visual" },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (!item.isPublished) return false;
    if (activeFilter === "todos") return true;
    return item.category === activeFilter;
  });

  return (
    <section className="py-16 bg-brand-surface border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
              <span>Portfólio Criativo Artes</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-graphite-900 tracking-tight">
              Trabalhos Realizados
            </h2>
            <p className="text-sm text-brand-graphite-600 mt-1 max-w-xl">
              Projetos reais confeccionados com carinho para nossos clientes e empresas parceiras.
            </p>
          </div>

          <Link
            href="/trabalhos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-gold-800 bg-brand-gold-50 hover:bg-brand-gold-100 border border-brand-gold-200 transition-colors group shrink-0"
          >
            <span>Ver galeria completa</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600 ${
                  isActive
                    ? "bg-brand-gold-700 text-white shadow-subtle"
                    : "bg-brand-bg text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-brand-bg rounded-2xl border border-brand-border hover:border-brand-gold-300 overflow-hidden shadow-subtle hover:shadow-card transition-all"
            >
              <div className="relative aspect-[4/3] w-full bg-brand-surface overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display text-base font-bold text-brand-graphite-900 leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-brand-graphite-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
