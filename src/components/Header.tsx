"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useStoreSettings } from "@/lib/settings-context";
import { BrandLogo } from "./BrandLogo";

export function Header({ notice }: { notice?: string }) {
  const settings = useStoreSettings();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalQuantity, setIsDrawerOpen } = useCart();
  const links = [{ name: "Início", href: "/" }, { name: "Personalizados", href: "/catalogo" }, { name: "Para empresas", href: "/empresas" }, { name: "Trabalhos", href: "/trabalhos" }, { name: "Contato", href: "/contato" }];
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="atelier-header">
      {notice && <div className="atelier-notice">{notice}</div>}
      <div className="atelier-container header-content">
        <Link href="/" aria-label="Criativo Artes Personalizados — início" className="header-brand"><BrandLogo priority /></Link>
        <nav className="desktop-nav" aria-label="Navegação principal">{links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}>{link.name}</Link>)}</nav>
        <div className="header-actions">
          <button type="button" className="header-bag" onClick={() => setIsDrawerOpen(true)} aria-label={`Lista de orçamento: ${totalQuantity} itens`}><ShoppingBag size={20} />{totalQuantity > 0 && <span>{totalQuantity}</span>}</button>
          <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="header-contact">Pedir orçamento <ArrowUpRight size={16} /></a>
          <button type="button" className="header-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegação no celular">{links.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined}>{link.name}<ArrowUpRight size={16} /></Link>)}<a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="atelier-button atelier-button-dark">Pedir orçamento <ArrowUpRight size={18} /></a></nav>}
    </header>
  );
}
