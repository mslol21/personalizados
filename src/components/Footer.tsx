"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useStoreSettings } from "@/lib/settings-context";
import {
  MapPin,
  MessageCircle,
  Navigation,
  Lock,
  Heart,
  Phone,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export function Footer() {
  const STORE_INFO = useStoreSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-graphite-900 text-brand-graphite-300 border-t border-brand-graphite-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-400 rounded-lg group"
            >
              <span className="rounded-md bg-white p-3 inline-flex"><BrandLogo /></span>
            </Link>

            <p className="text-xs sm:text-sm text-brand-graphite-400 leading-relaxed">
              Presentes afetivos, lembrancinhas e brindes personalizados com a sua ideia e o nosso cuidado. Atendimento dedicado no Jardim Arpoador, São Paulo.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={STORE_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-graphite-800 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center border border-brand-graphite-700"
                aria-label="WhatsApp Criativo Artes"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-graphite-800 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center border border-brand-graphite-700"
                aria-label="Instagram Criativo Artes"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={STORE_INFO.address.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-brand-graphite-800 text-brand-gold-400 hover:bg-brand-gold-600 hover:text-white transition-colors flex items-center justify-center border border-brand-graphite-700"
                aria-label="Localização no Google Maps"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold-300">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo de Personalizados
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="hover:text-white transition-colors">
                  Para Empresas &amp; Comunicação Visual
                </Link>
              </li>
              <li>
                <Link href="/trabalhos" className="hover:text-white transition-colors">
                  Galeria de Trabalhos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Loja Física &amp; Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold-300">
              Personalizados
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-graphite-400">
              <li>
                <Link href="/catalogo?category=canecas" className="hover:text-white transition-colors">
                  Canecas
                </Link>
              </li>
              <li>
                <Link href="/catalogo?category=garrafas-copos" className="hover:text-white transition-colors">
                  Garrafas &amp; Copos
                </Link>
              </li>
              <li>
                <Link href="/catalogo?category=tacas-long-drinks" className="hover:text-white transition-colors">
                  Taças &amp; Drinks
                </Link>
              </li>
              <li>
                <Link href="/catalogo?category=azulejos" className="hover:text-white transition-colors">
                  Azulejos Decorativos
                </Link>
              </li>
              <li>
                <Link href="/catalogo?category=cestas-presentes" className="hover:text-white transition-colors">
                  Kits &amp; Cestas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold-300">
              Loja &amp; Atendimento
            </h4>
            <div className="space-y-2.5 text-xs text-brand-graphite-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold-400 shrink-0 mt-0.5" />
                <span>
                  {STORE_INFO.address.fullAddress}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={STORE_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-medium text-emerald-300"
                >
                  {STORE_INFO.whatsappFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-rose-400 shrink-0" size={16} />
                <a
                  href={STORE_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {STORE_INFO.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-graphite-800 bg-brand-graphite-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-brand-graphite-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span>© {currentYear} {STORE_INFO.companyName}. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px] text-brand-graphite-400">
              Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> para você
            </span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] text-brand-graphite-400 hover:text-brand-gold-300 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Acesso Restrito</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
