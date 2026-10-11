"use client";

import React from "react";
import Image from "next/image";
import { StoreSettings } from "@/types";
import {
  MapPin,
  MessageCircle,
  Navigation,
  Clock,
  ExternalLink,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

interface LocationContactSectionProps {
  settings: StoreSettings;
}

export function LocationContactSection({ settings }: LocationContactSectionProps) {
  return (
    <section className="py-16 bg-brand-bg border-b border-brand-border/40" id="contato">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Information Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-800 text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5 text-brand-primary-600" />
                <span>Nossa Localização &amp; Atendimento</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-graphite-900 tracking-tight">
                Uma loja perto de você.
              </h2>
              <p className="text-sm sm:text-base text-brand-graphite-600 mt-2 leading-relaxed">
                Visite a Criativo Artes no Jardim Arpoador, em São Paulo. Converse com a equipe sobre a sua ideia e combine os detalhes do seu personalizado.
              </p>
            </div>

            {/* Address Card */}
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-brand-graphite-900">
                    Endereço da Loja
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-graphite-700 mt-0.5 font-medium">
                    {settings.address.fullAddress}
                  </p>
                  <p className="text-xs text-brand-graphite-600 mt-0.5">
                    Jardim Arpoador • São Paulo - SP
                  </p>
                </div>
              </div>

              <a
                href={settings.address.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-brand-graphite-900 bg-brand-muted/80 hover:bg-brand-muted border border-brand-border transition-colors shrink-0"
              >
                <Navigation className="w-4 h-4 text-brand-primary-700" />
                <span>Como Chegar (Google Maps)</span>
              </a>
            </div>

            {/* Business Hours (Real only when registered) */}
            <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-subtle flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary-50 border border-brand-primary-200 text-brand-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-brand-graphite-900">
                  Horário de Atendimento
                </h3>
                {settings.businessHours && settings.businessHours.trim() ? (
                  <p className="text-xs sm:text-sm text-brand-graphite-700 mt-0.5 font-medium">
                    {settings.businessHours}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-brand-graphite-600 mt-0.5">
                    Consulte os horários de funcionamento e agendamento de retiradas diretamente com a nossa equipe no WhatsApp.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <a
                href={settings.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex items-center gap-3.5 group shadow-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    WhatsApp Principal
                  </span>
                  <span className="text-sm font-bold text-emerald-950 block">
                    {settings.whatsappFormatted}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Clique para iniciar conversa
                  </span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-rose-300 hover:bg-rose-50/30 transition-all flex items-center gap-3.5 group shadow-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <InstagramIcon size={20} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-brand-graphite-600 tracking-wider block">
                    Instagram Oficial
                  </span>
                  <span className="text-sm font-bold text-brand-graphite-900 block truncate">
                    {settings.instagramHandle}
                  </span>
                  <span className="text-[11px] text-rose-700 font-medium">
                    Acompanhe novidades
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Interactive Directions & Fast Quote Box Column */}
          <div className="lg:col-span-6 bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-card space-y-6">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image src="/images/real/loja-criativo-artes.webp" alt="Fachada da loja Criativo Artes no Jardim Arpoador" fill sizes="(max-width: 1023px) 90vw, 560px" className="object-cover" />
            </div>
            <div className="border-b border-brand-border pb-4">
              <h3 className="font-display text-xl font-bold text-brand-graphite-900">
                Atendimento Rápido no WhatsApp
              </h3>
              <p className="text-xs text-brand-graphite-600 mt-1">
                Tire dúvidas, envie sua arte ou peça um orçamento sem compromisso.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wide block">
                Escolha o assunto para conversar:
              </label>
              {[
                {
                  title: "Orçamento de Canecas e Presentes Individuais",
                  msg: "Olá! Gostaria de um orçamento para canecas/presentes personalizados.",
                },
                {
                  title: "Lembrancinhas para Casamento, Aniversário ou Batizado",
                  msg: "Olá! Gostaria de consultar opções e orçamento de lembrancinhas para evento.",
                },
                {
                  title: "Brindes Corporativos com Logotipo de Empresa",
                  msg: "Olá! Gostaria de uma cotação de brindes personalizados para minha empresa.",
                },
                {
                  title: "Comunicação Visual (Fachadas, Banners, Letreiros)",
                  msg: "Olá! Gostaria de informações e orçamento sobre serviços de comunicação visual.",
                },
              ].map((opt, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(opt.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-brand-bg hover:bg-brand-primary-50 border border-brand-border hover:border-brand-primary-300 transition-all text-xs font-semibold text-brand-graphite-800 group"
                >
                  <span className="line-clamp-1">{opt.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-primary-700 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-primary-50/60 border border-brand-primary-200 text-xs text-brand-primary-900">
              <MapPin className="inline-block w-4 h-4 mr-2" aria-hidden="true" /><strong>Visite nossa loja:</strong> {settings.address.fullAddress}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
