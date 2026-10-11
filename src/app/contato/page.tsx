import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocationContactSection } from "@/components/LocationContactSection";
import { FAQSection } from "@/components/FAQSection";
import { getSettings, getFaqs } from "@/lib/storage";

export const revalidate = 0;

export const metadata = {
  title: "Loja Física & Contato | Criativo Artes Personalizados",
  description:
    "Visite nossa loja na Avenida General Asdrúbal da Cunha, 1278 — Jardim Arpoador, São Paulo - SP ou entre em contato pelo WhatsApp (11) 98750-7750.",
};

export default async function ContatoPage() {
  const settings = await getSettings();
  const faqs = await getFaqs(false);

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <LocationContactSection settings={settings} />
        <FAQSection faqs={faqs} />
      </main>

      <Footer />
    </>
  );
}
