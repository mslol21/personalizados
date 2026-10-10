"use client";
import Link from "next/link";
import type { CategoryItem, Product } from "@/types";
import { DynamicIcon } from "./DynamicIcon";
import { ArrowUpRight } from "lucide-react";
export function CategoryNav({ categories, products }: { categories: CategoryItem[]; products: Product[] }) {
  const populated = categories.filter(category => category.isPublished && products.some(product => product.isPublished && product.category === category.slug));
  if (!populated.length) return null;
  return <section className="atelier-section category-section"><div className="atelier-container">
    <div className="atelier-section-heading"><div><p className="atelier-eyebrow">ESCOLHA O SEU PERSONALIZADO</p><h2>Pequenos detalhes.<br /><em>Infinitas possibilidades.</em></h2></div><Link href="/catalogo" className="atelier-text-link">Ver todo o catálogo <ArrowUpRight size={18} /></Link></div>
    <div className="category-grid">{populated.map(category => <Link key={category.id} href={`/catalogo?category=${category.slug}`} className="atelier-category"><div className="category-icon"><DynamicIcon name={category.iconName} size={29} strokeWidth={1.4} /></div><h3>{category.name}</h3><span>Explorar <ArrowUpRight size={14} /></span></Link>)}</div>
  </div></section>;
}
