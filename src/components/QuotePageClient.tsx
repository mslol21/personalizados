"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCartWhatsAppMessage } from "@/lib/whatsapp";
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

export function QuotePageClient() {
  const { items, removeItem, updateQuantity, clearCart, totalQuantity } = useCart();
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { whatsappUrl, plainTextMessage } = formatCartWhatsAppMessage(items, origin);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(plainTextMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 bg-brand-surface rounded-3xl border border-brand-border shadow-subtle space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-700 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-graphite-900">
          Sua lista de orçamento está vazia
        </h2>
        <p className="text-xs sm:text-sm text-brand-graphite-600 max-w-md mx-auto leading-relaxed">
          Navegue pelo nosso catálogo de personalizados, selecione seus produtos favoritos e adicione-os aqui para solicitar um orçamento completo pelo WhatsApp.
        </p>
        <div className="pt-2">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-all shadow-subtle"
          >
            <span>Ver Catálogo de Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List Column */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-border">
          <span className="text-sm font-bold text-brand-graphite-900">
            {totalQuantity} {totalQuantity === 1 ? "item selecionado" : "itens selecionados"}
          </span>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            Limpar lista inteira
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.cartId}
              className="p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-subtle flex flex-col sm:flex-row gap-4 relative"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-brand-bg border border-brand-border overflow-hidden relative shrink-0">
                <Image
                  src={item.image || "/images/products/caneca-personalizada-1.svg"}
                  alt={item.productName}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Product Info & Controls */}
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-brand-graphite-900">
                      {item.productName}
                    </h3>
                    <span className="text-xs font-semibold text-brand-gold-700">
                      {item.categoryName}
                    </span>
                  </div>

                  {item.price && (
                    <span className="text-sm font-bold text-brand-graphite-900">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>

                {/* Customizations Tag Box */}
                {(item.customNamePhrase || item.customTheme || item.customObservations) && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-brand-graphite-800 space-y-1">
                    {item.customNamePhrase && (
                      <p>
                        <strong>Nome / Frase:</strong> {item.customNamePhrase}
                      </p>
                    )}
                    {item.customTheme && (
                      <p>
                        <strong>Tema / Ocasião:</strong> {item.customTheme}
                      </p>
                    )}
                    {item.customObservations && (
                      <p>
                        <strong>Obs:</strong> {item.customObservations}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity Editor */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-brand-bg border border-brand-border rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-brand-graphite-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeItem(item.cartId)}
                className="absolute top-4 right-4 text-brand-graphite-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                aria-label="Remover item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary & WhatsApp Sending Card */}
      <div className="lg:col-span-4 space-y-4 sticky top-28">
        <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border shadow-card space-y-4">
          <h2 className="font-display text-xl font-bold text-brand-graphite-900 border-b border-brand-border pb-3">
            Resumo do Orçamento
          </h2>

          <div className="space-y-2 text-xs sm:text-sm text-brand-graphite-700">
            <div className="flex items-center justify-between">
              <span>Total de produtos:</span>
              <span className="font-bold text-brand-graphite-900">{totalQuantity} unidade(s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Valores e Prazos:</span>
              <span className="font-bold text-brand-gold-800">Confirmados no WhatsApp</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-brand-gold-50 border border-brand-gold-200 text-xs text-brand-gold-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-gold-700 shrink-0 mt-0.5" />
            <span>
              Você poderá enviar as imagens e logotipos diretamente na nossa conversa do WhatsApp após enviar a lista!
            </span>
          </div>

          {/* Primary Action: Send to WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-subtle hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar Lista no WhatsApp</span>
          </a>

          {/* Copy Plain Text Summary */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-brand-graphite-800 bg-brand-bg hover:bg-brand-muted border border-brand-border transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Resumo copiado com sucesso!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-gold-700" />
                <span>Copiar texto do pedido</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
