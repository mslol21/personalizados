"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { formatSingleProductWhatsAppMessage } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "/images/products/caneca-personalizada-1.svg";
  const { whatsappUrl } = formatSingleProductWhatsAppMessage(product, {
    quantity: product.minQuantity || 1,
  });

  return (
    <article className="group flex flex-col bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-gold-300 shadow-subtle hover:shadow-cardHover transition-all overflow-hidden">
      {/* Product Image Container */}
      <Link
        href={`/catalogo/${product.slug}`}
        className="relative aspect-square w-full bg-brand-muted/30 overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <Image
          src={mainImage}
          alt={`Foto de ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Tag */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-brand-graphite-900/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-subtle">
            <Sparkles className="w-3 h-3 text-brand-gold-400" />
            Destaque
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-brand-surface/90 backdrop-blur-sm text-brand-graphite-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-brand-border shadow-subtle">
          {product.categoryName}
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="mb-2">
          <Link
            href={`/catalogo/${product.slug}`}
            className="font-display text-lg font-bold text-brand-graphite-900 group-hover:text-brand-gold-700 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        <p className="text-xs text-brand-graphite-600 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Price or "Sob orçamento" */}
        <div className="mt-auto pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-graphite-600 block">
              Valor
            </span>
            {product.price ? (
              <span className="text-base font-bold text-brand-graphite-900">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            ) : (
              <span className="text-xs font-bold text-brand-gold-800 bg-brand-gold-50 px-2 py-0.5 rounded-md border border-brand-gold-200">
                Sob orçamento
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct WhatsApp Quick Quote */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Pedir orçamento direto no WhatsApp"
              aria-label={`Pedir orçamento de ${product.name} no WhatsApp`}
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* View & Customize Link */}
            <Link
              href={`/catalogo/${product.slug}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-colors shadow-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
            >
              <span>Personalizar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
