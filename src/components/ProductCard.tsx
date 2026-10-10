"use client";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { formatSingleProductWhatsAppMessage } from "@/lib/whatsapp";
import { useStoreSettings } from "@/lib/settings-context";
export function ProductCard({ product }: { product: Product }) {
  const settings = useStoreSettings();
  const mainImage = product.images?.[0] || "/images/products/caneca-personalizada-1.svg";
  const { whatsappUrl } = formatSingleProductWhatsAppMessage(product, { quantity: product.minQuantity || 1 }, undefined, settings.whatsapp);
  const realPhoto = mainImage.endsWith(".webp") || /\.(?:png|jpe?g)$/i.test(mainImage);
  return <article className="atelier-product">
    <Link href={`/catalogo/${product.slug}`} className="product-photo" aria-label={`Ver detalhes de ${product.name}`}><Image src={mainImage} alt={product.name} fill sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 300px" className={realPhoto ? "product-image-cover" : "product-image-illustration"} />{product.isFeatured && <span className="product-highlight">SELEÇÃO CRIATIVO ARTES</span>}<span className="product-photo-arrow"><ArrowUpRight size={19} /></span></Link>
    <div className="product-info"><p className="product-category">{product.categoryName}</p><h3><Link href={`/catalogo/${product.slug}`}>{product.name}</Link></h3><p className="product-description">{product.description}</p><div className="product-bottom"><span className="product-price">{product.price !== undefined ? product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Sob orçamento"}</span><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Pedir orçamento de ${product.name} no WhatsApp`} className="product-whatsapp"><MessageCircle size={17} /></a></div><Link href={`/catalogo/${product.slug}`} className="product-personalize">Personalizar este produto <ArrowUpRight size={16} /></Link></div>
  </article>;
}
