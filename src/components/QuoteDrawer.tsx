"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCartWhatsAppMessage } from "@/lib/whatsapp";
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function QuoteDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalQuantity,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  const [copied, setCopied] = useState(false);

  if (!isDrawerOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { whatsappUrl, plainTextMessage } = formatCartWhatsAppMessage(items, origin);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(plainTextMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Lista de Orçamento">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-graphite-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface border-l border-brand-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-border bg-brand-bg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-gold-100 text-brand-gold-800 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-brand-graphite-900 leading-none">
                  Lista de Orçamento
                </h2>
                <span className="text-xs text-brand-graphite-600">
                  {totalQuantity} {totalQuantity === 1 ? "item selecionado" : "itens selecionados"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-xl text-brand-graphite-500 hover:text-brand-graphite-800 hover:bg-brand-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
              aria-label="Fechar lista"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-brand-graphite-900">
                  Sua lista de orçamento está vazia
                </h3>
                <p className="text-xs text-brand-graphite-600 max-w-xs mx-auto">
                  Navegue pelo nosso catálogo e adicione os personalizados que deseja solicitar orçamento.
                </p>
                <Link
                  href="/catalogo"
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-colors shadow-subtle"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="p-3.5 rounded-xl bg-brand-bg border border-brand-border flex gap-3 relative group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-brand-surface border border-brand-border overflow-hidden relative shrink-0">
                      <Image
                        src={item.image || "/images/products/caneca-personalizada-1.svg"}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-display text-sm font-bold text-brand-graphite-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-brand-gold-700 font-medium truncate">
                        {item.categoryName}
                      </p>

                      {/* Customization Details */}
                      {(item.customNamePhrase || item.customTheme || item.customObservations) && (
                        <div className="mt-1.5 p-1.5 rounded bg-brand-surface/90 border border-brand-border/60 text-[10px] text-brand-graphite-700 space-y-0.5">
                          {item.customNamePhrase && (
                            <p className="truncate">
                              <strong>Frase:</strong> {item.customNamePhrase}
                            </p>
                          )}
                          {item.customTheme && (
                            <p className="truncate">
                              <strong>Tema:</strong> {item.customTheme}
                            </p>
                          )}
                          {item.customObservations && (
                            <p className="truncate">
                              <strong>Obs:</strong> {item.customObservations}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-brand-surface border border-brand-border rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-brand-graphite-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-brand-graphite-700 hover:bg-brand-muted"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {item.price ? (
                          <span className="text-xs font-bold text-brand-graphite-900">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-brand-gold-800">
                            Sob orçamento
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartId)}
                      className="absolute top-2.5 right-2.5 text-brand-graphite-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      aria-label="Remover item da lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-rose-700 hover:underline pt-1 block ml-auto"
                >
                  Limpar toda a lista
                </button>
              </div>
            )}
          </div>

          {/* Footer & WhatsApp Sender Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-bg space-y-3">
              <div className="p-3 rounded-xl bg-brand-gold-50 border border-brand-gold-200 text-[11px] text-brand-gold-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                <span>
                  Fotos e arquivos para a arte podem ser enviados diretamente no WhatsApp após o envio da lista.
                </span>
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-subtle hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Lista no WhatsApp</span>
              </a>

              {/* Copy Summary Button for long messages / fail-safe */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-brand-graphite-800 bg-brand-surface hover:bg-brand-muted border border-brand-border transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Resumo copiado com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-brand-gold-700" />
                    <span>Copiar resumo do pedido</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-brand-graphite-600">
                Esta lista é uma solicitação de orçamento sem cobrança automática.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
