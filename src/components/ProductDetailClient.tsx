"use client";
import { useStoreSettings } from "@/lib/settings-context";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatSingleProductWhatsAppMessage } from "@/lib/whatsapp";
import {
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  Info,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const settings = useStoreSettings();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(product.minQuantity || 1);
  const [customNamePhrase, setCustomNamePhrase] = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [customObservations, setCustomObservations] = useState("");
  const [addedToast, setAddedToast] = useState(false);

  const { addItem } = useCart();

  const images = product.images && product.images.length > 0
    ? product.images
    : ["/images/products/caneca-personalizada-1.svg"];

  const currentImage = images[selectedImageIndex] || images[0];

  const originUrl = typeof window !== "undefined" ? window.location.href : "";

  const { whatsappUrl } = formatSingleProductWhatsAppMessage(
    product,
    {
      quantity,
      customNamePhrase,
      customTheme,
      customObservations,
    },
    originUrl,
    settings.whatsapp
  );

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      categoryName: product.categoryName,
      image: currentImage,
      price: product.price,
      quantity,
      customNamePhrase: customNamePhrase.trim() || undefined,
      customTheme: customTheme.trim() || undefined,
      customObservations: customObservations.trim() || undefined,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Return to Catalog Navigation Link */}
      <div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-primary-800 hover:text-brand-primary-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Voltar para o catálogo</span>
        </Link>
      </div>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-brand-surface border border-brand-border shadow-card overflow-hidden">
            <Image
              src={currentImage}
              alt={`Foto de ${product.name}`}
              fill
              priority
              className="object-contain p-6 sm:p-10"
            />

            {product.isFeatured && (
              <div className="absolute top-4 left-4 bg-brand-graphite-900/85 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-subtle">
                <Sparkles className="w-3.5 h-3.5 text-brand-primary-400" />
                Destaque
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl bg-brand-surface border overflow-hidden shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? "border-brand-primary-600 ring-2 ring-brand-primary-400/30"
                      : "border-brand-border opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Visualizar imagem ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Highlights Box */}
          <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-subtle space-y-3">
            <h3 className="font-display text-base font-bold text-brand-graphite-900">
              Detalhes do Produto &amp; Acabamento
            </h3>
            <ul className="space-y-2 text-xs text-brand-graphite-700">
              {product.details && product.details.length > 0 ? (
                product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Impressão de alta definição com cores vivas e excelente durabilidade.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Customization Form & Order Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
            {/* Category & Name */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary-700">
                {product.categoryName}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-graphite-900 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Price or Sob Orçamento */}
              <div className="mt-3 flex items-baseline gap-3">
                {product.price ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-bold text-brand-graphite-900">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-brand-graphite-600">
                      por unidade (estimativa)
                    </span>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-800 text-sm font-bold">
                    Sob orçamento personalizado
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-brand-graphite-700 leading-relaxed pt-2 border-t border-brand-border/60">
              <p>{product.description}</p>
            </div>

            {/* Customization Form */}
            <form onSubmit={handleAddToCart} className="space-y-4 pt-4 border-t border-brand-border/60">
              <h3 className="font-display text-base font-bold text-brand-graphite-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary-600" />
                <span>Personalize o seu item</span>
              </h3>

              {/* Quantity Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-graphite-800 block">
                  Quantidade desejada:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-brand-bg border border-brand-border rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center text-sm font-bold text-brand-graphite-900 bg-transparent border-none focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-brand-graphite-600">
                    {product.minQuantity && product.minQuantity > 1 ? `(Mínimo sugerido: ${product.minQuantity} un)` : "Peça a quantidade que precisar"}
                  </span>
                </div>
              </div>

              {/* Name or Phrase */}
              {product.customizationOptions?.allowNameOrPhrase !== false && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-graphite-800 block">
                    Nome ou frase para estampar:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 'Melhor Mãe do Mundo', 'Lucas 15 anos'..."
                    value={customNamePhrase}
                    onChange={(e) => setCustomNamePhrase(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary-500 focus:bg-white text-xs sm:text-sm text-brand-graphite-900 placeholder-brand-graphite-400 transition-colors"
                  />
                </div>
              )}

              {/* Theme / Occasion */}
              {product.customizationOptions?.allowTheme !== false && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brand-graphite-800 block">
                    Tema, estilo ou cores preferidas:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 'Floral dourado', 'Aniversário infantil Safari', 'Logo da Empresa'..."
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary-500 focus:bg-white text-xs sm:text-sm text-brand-graphite-900 placeholder-brand-graphite-400 transition-colors"
                  />
                </div>
              )}

              {/* Observations */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-graphite-800 block">
                  Observações adicionais (opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Algum detalhe especial ou dúvida sobre este item?"
                  value={customObservations}
                  onChange={(e) => setCustomObservations(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border focus:border-brand-primary-500 focus:bg-white text-xs sm:text-sm text-brand-graphite-900 placeholder-brand-graphite-400 transition-colors resize-none"
                />
              </div>

              {/* Callout about Photos & Logos */}
              <div className="p-3.5 rounded-xl bg-brand-primary-50 border border-brand-primary-200 text-xs text-brand-primary-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-primary-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Fotos e arquivos da arte:</strong> Você poderá anexar e enviar fotos em alta definição diretamente na nossa conversa do WhatsApp após a solicitação.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* Add to Quote Cart Button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-brand-primary-700 hover:bg-brand-primary-800 transition-all shadow-card hover:shadow-cardHover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Adicionar à Lista de Orçamento</span>
                </button>

                {/* Direct Single Item WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200/90 border border-emerald-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Pedir Orçamento Deste Produto no WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
