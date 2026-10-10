"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  Gift,
  PartyPopper,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { STORE_INFO } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-gold-50/40 via-brand-bg to-brand-bg pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-brand-border/40">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-gold-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-brand-gold-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            {/* Tagline / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-100/80 border border-brand-gold-200 text-brand-gold-800 text-xs sm:text-sm font-semibold self-center lg:self-start shadow-subtle">
              <Sparkles className="w-4 h-4 text-brand-gold-600" />
              <span>Personalização artesanal com alta definição</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-brand-graphite-900 leading-[1.15] tracking-tight">
              Seu presente, com a{" "}
              <span className="relative inline-block text-brand-gold-700">
                sua ideia
                <svg
                  className="absolute left-0 -bottom-1 w-full h-2 text-brand-gold-400/60"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="currentColor"
                >
                  <path d="M0,0 Q50,12 100,0 L100,6 Q50,18 0,6 Z" />
                </svg>
              </span>{" "}
              e o nosso cuidado.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-brand-graphite-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Canecas, brindes e personalizados para presentear, celebrar momentos inesquecíveis e dar destaque à sua marca com qualidade que impressiona.
            </p>

            {/* Benefit Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-brand-graphite-800 font-medium">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Foto, nome ou tema</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Orçamento rápido WhatsApp</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Loja física no Arpoador</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
              <Link
                href="/catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-brand-gold-700 hover:bg-brand-gold-800 shadow-card hover:shadow-cardHover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600 active:scale-[0.98]"
              >
                <span>Explorar personalizados</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={STORE_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-300 shadow-subtle transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 text-emerald-700" />
                <span>Pedir orçamento no WhatsApp</span>
              </a>
            </div>

            {/* Quick Access Pills */}
            <div className="pt-4 border-t border-brand-border/60">
              <p className="text-xs font-semibold text-brand-graphite-600 uppercase tracking-wider mb-3">
                Acessos rápidos por ocasião:
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <Link
                  href="/catalogo?category=cestas-presentes"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-gold-50 border border-brand-border hover:border-brand-gold-300 text-xs font-semibold text-brand-graphite-800 transition-colors shadow-subtle"
                >
                  <Gift className="w-3.5 h-3.5 text-brand-gold-600" />
                  Presentes Criativos
                </Link>
                <Link
                  href="/catalogo?occasion=casamentos-noivados"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-gold-50 border border-brand-border hover:border-brand-gold-300 text-xs font-semibold text-brand-graphite-800 transition-colors shadow-subtle"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-rose-600" />
                  Festas e Eventos
                </Link>
                <Link
                  href="/empresas"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-gold-50 border border-brand-border hover:border-brand-gold-300 text-xs font-semibold text-brand-graphite-800 transition-colors shadow-subtle"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Para Empresas &amp; Brindes
                </Link>
              </div>
            </div>
          </div>

          {/* Visual Showcase Composition Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Featured Showcase Card */}
              <div className="relative rounded-3xl p-3 bg-brand-surface border border-brand-gold-200/80 shadow-card hover:shadow-cardHover transition-all">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-muted/40 border border-brand-border/60">
                  <Image
                    src="/images/products/caneca-personalizada-1.svg"
                    alt="Caneca personalizada em destaque"
                    fill
                    priority
                    className="object-contain p-4"
                  />
                  <div className="absolute top-3 left-3 bg-brand-graphite-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-gold-400" />
                    Foto e Nome Real
                  </div>
                </div>

                <div className="p-3 pt-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-brand-graphite-900 leading-tight">
                        Canecas &amp; Presentes Exclusivos
                      </h3>
                      <p className="text-xs text-brand-graphite-600 mt-0.5">
                        Cerâmica resinada de alta definição com cores vivas
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-md bg-brand-gold-50 text-brand-gold-800 border border-brand-gold-200">
                      Sob orçamento
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Mini Badge 1 (Tile) */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 bg-brand-surface p-2.5 sm:p-3 rounded-2xl border border-brand-border shadow-card flex items-center gap-3 animate-in fade-in zoom-in-75 duration-300">
                <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-brand-gold-50 shrink-0 border border-brand-gold-200">
                  <Image
                    src="/images/products/azulejo-personalizado.svg"
                    alt="Azulejo com foto"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left pr-2">
                  <p className="text-xs font-bold text-brand-graphite-900">Azulejos com Suporte</p>
                  <p className="text-[11px] text-brand-graphite-600">Para fotos de família e pets</p>
                </div>
              </div>

              {/* Floating Mini Badge 2 (Tumbler/Gin) */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-brand-surface p-2.5 rounded-2xl border border-brand-border shadow-card flex items-center gap-2.5">
                <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-brand-gold-50 shrink-0 border border-brand-gold-200">
                  <Image
                    src="/images/products/taca-gin.svg"
                    alt="Taças de gin"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    Eventos
                  </span>
                  <p className="text-xs font-bold text-brand-graphite-900 mt-0.5">Taças Degradê</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
