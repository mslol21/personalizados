"use client";

import React, { useState } from "react";
import { FAQItem } from "@/types";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/lib/settings-context";

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const STORE_INFO = useStoreSettings();
  const publishedFaqs = faqs.filter((f) => f.isPublished);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (publishedFaqs.length === 0) return null;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-brand-surface border-b border-brand-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold-50 border border-brand-gold-200 text-brand-gold-800 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-graphite-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-brand-graphite-600 mt-2">
            Esclarecimentos rápidos sobre pedidos, personalização e orçamentos na Criativo Artes.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {publishedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "bg-brand-gold-50/40 border-brand-gold-300 shadow-subtle"
                    : "bg-brand-bg border-brand-border hover:border-brand-gold-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600 rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg font-bold text-brand-graphite-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-brand-gold-600 text-white rotate-180"
                        : "bg-brand-surface text-brand-graphite-600 border border-brand-border"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-graphite-700 leading-relaxed border-t border-brand-border/40 animate-in fade-in-50 duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 rounded-2xl bg-brand-bg border border-brand-border text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-display text-base font-bold text-brand-graphite-900">
              Ainda tem alguma dúvida sobre seu projeto?
            </h4>
            <p className="text-xs text-brand-graphite-600 mt-0.5">
              Fale diretamente com nossa equipe no WhatsApp para tirar dúvidas sobre arte, prazos e quantidades.
            </p>
          </div>
          <a
            href={STORE_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0 shadow-subtle"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
