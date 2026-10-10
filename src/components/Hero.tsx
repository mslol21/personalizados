"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, MapPin, MessageCircle, PenLine } from "lucide-react";
import { useStoreSettings } from "@/lib/settings-context";

export function Hero() {
  const settings = useStoreSettings();
  return (
    <section className="atelier-hero">
      <div className="atelier-container hero-grid">
        <div className="hero-copy">
          <p className="atelier-eyebrow"><span /> PRESENTES COM SIGNIFICADO</p>
          <h1>Uma ideia sua.<br />Um presente<br /><em>com história.</em></h1>
          <p className="hero-description">Nomes, fotos e momentos que merecem ficar por perto. Descubra os personalizados da Criativo Artes e dê forma à sua próxima ideia.</p>
          <div className="hero-actions">
            <Link href="/catalogo" className="atelier-button atelier-button-dark">Explorar personalizados <ArrowUpRight size={18} /></Link>
            <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="atelier-button atelier-button-outline"><MessageCircle size={18} /> Pedir orçamento</a>
          </div>
          <div className="hero-detail"><PenLine size={17} /><span>Do seu jeito, com nome, foto ou tema.</span></div>
          <a className="hero-location" href={settings.address.googleMapsSearchUrl} target="_blank" rel="noopener noreferrer"><MapPin size={15} /> {settings.address.neighborhood} · {settings.address.city}</a>
        </div>
        <div className="hero-showcase">
          <div className="hero-main-photo">
            <Image src="/images/real/caneca-foto.webp" alt="Caneca da Criativo Artes personalizada com fotos de pets" fill priority sizes="(max-width: 767px) 58vw, 340px" />
            <span className="photo-caption">AFETO EM CADA DETALHE</span>
          </div>
          <div className="hero-side-column">
            <div className="hero-small-photo"><Image src="/images/real/caneca-nome.webp" alt="Caneca personalizada com o nome Sheila e arte dourada" fill priority sizes="(max-width: 767px) 38vw, 230px" /></div>
            <div className="hero-brand-card"><Image src="/images/brand/logo-original.png" alt="Logo original Criativo Artes Personalizados" width={719} height={586} /><span>CRIATIVIDADE QUE VIRA PRESENTE</span></div>
          </div>
          <Link href="/catalogo?category=canecas" className="hero-showcase-link"><span>Canecas com a sua personalidade</span><ArrowRight size={18} /></Link>
        </div>
      </div>
      <div className="hero-bottom-strip atelier-container"><span>PARA PRESENTEAR.</span><span>PARA CELEBRAR.</span><span>PARA A SUA MARCA.</span></div>
    </section>
  );
}
