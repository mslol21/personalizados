"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  ShoppingBag,
  Menu,
  X,
  MapPin,
  Sparkles,
  Phone,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useStoreSettings } from "@/lib/settings-context";

export function Header({ notice }: { notice?: string }) {
  const STORE_INFO = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalQuantity, setIsDrawerOpen } = useCart();

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Personalizados", href: "/catalogo" },
    { name: "Para Empresas", href: "/empresas" },
    { name: "Trabalhos", href: "/trabalhos" },
    { name: "Contato", href: "/contato" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-surface/95 backdrop-blur-md border-b border-brand-border/60 transition-all duration-200">
      {/* Top Announcement Bar */}
      {notice && (
        <div className="bg-brand-gold-700 text-white text-xs py-1.5 px-4 font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold-200 shrink-0" />
              <span className="truncate">{notice}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-brand-gold-100 shrink-0 text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Jardim Arpoador, SP
              </span>
              <a
                href={STORE_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                <Phone className="w-3.5 h-3.5" />
                {STORE_INFO.whatsappFormatted}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600 rounded-lg group"
            aria-label="Criativo Artes Personalizados - Página Inicial"
          >
            <div className="relative w-12 h-12 shrink-0 rounded-full border border-brand-gold-300/80 bg-brand-gold-50/50 p-0.5 shadow-subtle group-hover:border-brand-gold-500 transition-colors">
              <Image
                src="/images/brand/logo-mark.svg"
                alt="Logo CA"
                width={48}
                height={48}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brand-graphite-900 leading-none">
                Criativo <span className="text-brand-gold-600">Artes</span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-brand-gold-700 uppercase mt-0.5">
                Brindes &amp; Personalizados
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Navegação Principal"
            className="hidden md:flex items-center gap-1 lg:gap-2"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-gold-700 bg-brand-gold-50 font-semibold"
                      : "text-brand-graphite-700 hover:text-brand-graphite-900 hover:bg-brand-muted/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quote Cart / List Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-brand-graphite-800 bg-brand-muted/70 hover:bg-brand-muted transition-all border border-brand-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
              aria-label={`Lista de orçamento: ${totalQuantity} itens`}
              title="Ver lista de orçamento"
            >
              <ShoppingBag className="w-5 h-5 text-brand-gold-700" />
              <span className="hidden sm:inline text-xs font-semibold text-brand-graphite-800">
                Lista
              </span>
              {totalQuantity > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-brand-gold-600 rounded-full animate-in zoom-in-50">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={STORE_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-subtle hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir Orçamento</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-brand-graphite-800 bg-brand-muted/60 hover:bg-brand-muted border border-brand-border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-border bg-brand-surface px-4 pt-3 pb-6 space-y-3 shadow-card animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "bg-brand-gold-50 text-brand-gold-700 font-semibold"
                      : "text-brand-graphite-700 hover:bg-brand-muted/60 hover:text-brand-graphite-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-brand-border flex flex-col gap-2">
            <a
              href={STORE_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Pedir Orçamento no WhatsApp
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-brand-graphite-900 bg-brand-muted/80 hover:bg-brand-muted transition-colors text-sm border border-brand-border"
            >
              <ShoppingBag className="w-5 h-5 text-brand-gold-700" />
              Ver Minha Lista ({totalQuantity})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
