"use client";

import React from "react";
import {
  Sparkles,
  Lightbulb,
  Search,
  PenTool,
  MessageCircle,
  CheckCircle,
} from "lucide-react";

export function StepsSection() {
  const steps = [
    {
      number: "01",
      title: "Escolha um produto",
      description: "Navegue pelo nosso catálogo e selecione as canecas, taças, copos, azulejos ou brindes de seu interesse.",
      icon: Search,
    },
    {
      number: "02",
      title: "Conte sua ideia",
      description: "Informe o nome, frase ou tema desejado no formulário do produto para incluirmos na sua lista.",
      icon: PenTool,
    },
    {
      number: "03",
      title: "Solicite o orçamento no WhatsApp",
      description: "Envie sua lista com um clique direto para o nosso WhatsApp para receber valores e prazos.",
      icon: MessageCircle,
    },
    {
      number: "04",
      title: "Combine os detalhes com a equipe",
      description: "Envie suas fotos e logos pelo WhatsApp, alinhe os detalhes da arte e combine a retirada ou envio.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 bg-brand-surface border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary-600" />
            <span>Processo Simples e Direto</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-graphite-900 tracking-tight">
            Da ideia ao seu personalizado.
          </h2>
          <p className="text-sm sm:text-base text-brand-graphite-600 mt-2">
            Em apenas quatro etapas você transforma sua ideia em um presente único ou brinde marcante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col p-6 rounded-lg bg-brand-bg border border-brand-border hover:border-brand-primary-300 transition-all shadow-subtle group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-2xl font-bold text-brand-primary-600 group-hover:text-brand-primary-700 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary-700 shadow-subtle">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-brand-graphite-900 mb-2 leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-graphite-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative connecting arrow on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-brand-surface border border-brand-border text-brand-primary-600 flex items-center justify-center text-xs font-bold shadow-subtle">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Helpful Info Callout */}
        <div className="mt-8 p-4 rounded-xl bg-brand-primary-50/80 border border-brand-primary-200/80 max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-brand-primary-900 font-medium">
            <Lightbulb className="inline-block w-4 h-4 mr-2" aria-hidden="true" /><strong>Sua referência faz a diferença.</strong> Você pode enviar fotos em alta resolução, referências de arte ou logos da sua empresa diretamente na nossa conversa do WhatsApp após solicitar o orçamento!
          </p>
        </div>
      </div>
    </section>
  );
}
