import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { QuoteDrawer } from "@/components/QuoteDrawer";
import { getSettings } from "@/lib/storage";
import { SettingsProvider } from "@/lib/settings-context";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Criativo Artes — Brindes e Personalizados | Canecas, Brindes e Presentes em SP",
    template: "%s | Criativo Artes Personalizados",
  },
  description:
    "Catálogo e orçamento de canecas personalizadas, squeezes, copos térmicos, taças de gin, azulejos com fotos e brindes corporativos. Loja física no Jardim Arpoador, São Paulo - SP.",
  keywords: [
    "canecas personalizadas",
    "brindes personalizados são paulo",
    "criativo artes",
    "copos termicos personalizados",
    "tacas de gin personalizadas",
    "azulejos com foto",
    "presentes personalizados jardim arpoador",
    "brindes corporativos sp",
  ],
  authors: [{ name: "Criativo Artes Personalizados" }],
  creator: "Criativo Artes Personalizados",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "Criativo Artes — Brindes e Personalizados",
    description:
      "Seu presente, com a sua ideia e o nosso cuidado. Peça seu orçamento personalizado pelo WhatsApp.",
    siteName: "Criativo Artes Personalizados",
    images: [
      {
        url: "/images/brand/logo-original.png",
        width: 719,
        height: 586,
        alt: "Logo Criativo Artes Personalizados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Criativo Artes — Brindes e Personalizados",
    description: "Canecas, brindes e personalizados para presentear, celebrar e dar destaque à sua marca.",
    images: ["/images/brand/logo-original.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const STORE_INFO = await getSettings();
  // Schema.org LocalBusiness Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: STORE_INFO.companyName,
    alternateName: STORE_INFO.commercialName,
    image: `${siteUrl}/images/brand/logo-original.png`,
    telephone: `+${STORE_INFO.whatsapp}`,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${STORE_INFO.address.street}, ${STORE_INFO.address.number}`,
      addressLocality: STORE_INFO.address.city,
      addressRegion: STORE_INFO.address.state,
      addressCountry: "BR",
      neighborhood: STORE_INFO.address.neighborhood,
    },
    sameAs: [
      STORE_INFO.instagram,
      STORE_INFO.whatsappLink,
    ],
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-brand-bg text-brand-graphite-900 antialiased selection:bg-brand-primary-200 selection:text-brand-graphite-900">
        <SettingsProvider settings={STORE_INFO}><CartProvider>
          {children}
          <QuoteDrawer />
        </CartProvider></SettingsProvider>
      </body>
    </html>
  );
}
