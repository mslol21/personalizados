import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductBySlug, getSettings } from "@/lib/storage";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug, false);

  if (!product) {
    return {
      title: "Produto Não Encontrado | Criativo Artes",
    };
  }

  return {
    title: `${product.name} | Criativo Artes Personalizados`,
    description: `${product.description} Solicite seu orçamento personalizado pelo WhatsApp.`,
    openGraph: {
      title: `${product.name} | Criativo Artes Personalizados`,
      description: product.description,
      images: [product.images?.[0] || "/images/brand/logo-original.png"],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, false);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }

  // Schema.org Product structured data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0] || "/images/brand/logo-original.png",
    category: product.categoryName,
    ...(product.price !== undefined ? { offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "BRL",
      seller: { "@type": "Organization", name: settings.companyName },
    } } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />

      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailClient product={product} />
        </div>
      </main>

      <Footer />
    </>
  );
}
