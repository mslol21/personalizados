"use client";

import React from "react";
import Link from "next/link";
import { VisualCommunicationService } from "@/types";
import { useStoreSettings } from "@/lib/settings-context";
import {
  Building2,
  Sparkles,
  MessageCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface CorporateSectionProps {
  services: VisualCommunicationService[];
}

export function CorporateSection({ services }: CorporateSectionProps) {
  const STORE_INFO = useStoreSettings();
  // Show services that are confirmed_publicado (or draft with disclaimer)
  const displayServices = services.filter(
    (s) => s.status === "confirmado_publicado"
  );

  return (
    <section className="py-16 bg-brand-bg border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-800 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-brand-primary-600" />
            <span>Soluções para Negócios &amp; Eventos</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-graphite-900 tracking-tight">
            Para Empresas &amp; Comunicação Visual
          </h2>
          <p className="text-sm sm:text-base text-brand-graphite-600 mt-2">
            Fortaleça a identidade da sua marca com brindes corporativos marcantes e projetos sob medida de comunicação visual comercial.
          </p>
        </div>

        {/* Corporate Gifts Highlight Box */}
        <div className="bg-gradient-to-r from-brand-graphite-900 to-[#2a0a1a] rounded-3xl p-8 sm:p-10 text-white shadow-card mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-primary-500/20 text-brand-accent-lime text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Brindes &amp; Kits Corporativos
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
                Canecas, Copos Térmicos e Kits Promocionais com o Logotipo da sua Empresa
              </h3>
              <p className="text-sm text-white/85 leading-relaxed max-w-2xl">
                Atendemos eventos de integração, presentes de final de ano, congressos e ações de marketing com gravação de alta fidelidade e atendimento ágil.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Kits de Boas-Vindas", "Copos Térmicos Inox", "Squeezes de Alumínio", "Chaveiros Resinados", "Camisetas de Equipe"].map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-md border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={`${STORE_INFO.whatsappLink}?text=${encodeURIComponent("Olá! Gostaria de cotar brindes corporativos para a minha empresa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-brand-graphite-900 bg-white hover:bg-brand-primary-50 transition-all text-sm shadow-subtle"
              >
                <MessageCircle className="w-4 h-4 text-brand-primary-700" />
                <span>Cotar Brindes no WhatsApp</span>
              </a>
              <Link
                href="/empresas"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm"
              >
                <span>Conhecer Todos os Serviços</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Visual Communication Section */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-primary-700">
                <Layers className="w-3.5 h-3.5" />
                Fachada e Identidade Visual
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900 mt-1">
                Serviços de Comunicação Visual
              </h3>
            </div>
            <p className="text-xs text-brand-graphite-600 max-w-md">
              Projetos sob medida para fachadas comerciais, letreiros e sinalização com atendimento no Jardim Arpoador e região.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary-300 transition-all shadow-subtle"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-display text-base sm:text-lg font-bold text-brand-graphite-900">
                    {service.title || service.name || "Serviço"}
                  </h4>
                  {service.status === "rascunho_pendente" && (
                    <span className="shrink-0 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200" title="Serviço identificado na fachada comercial sob confirmação">
                      Sob Consulta
                    </span>
                  )}
                </div>

                <p className="text-xs text-brand-graphite-600 leading-relaxed mb-4 flex-1">
                  {service.shortDescription}
                </p>

                {service.materials && service.materials.length > 0 && (
                  <div className="mb-4 pt-3 border-t border-brand-border/60">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-graphite-600 block mb-1.5">
                      Materiais &amp; Aplicações:
                    </span>
                    <ul className="text-xs text-brand-graphite-700 space-y-1">
                      {service.materials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary-600 shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-brand-border/60">
                  <a
                    href={`${STORE_INFO.whatsappLink}?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o serviço de ${service.title || service.name || "comunicação visual"}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-brand-primary-800 bg-brand-primary-50 hover:bg-brand-primary-100 border border-brand-primary-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Solicitar Avaliação Técnica</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
