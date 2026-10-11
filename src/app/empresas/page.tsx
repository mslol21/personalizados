import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CorporateSection } from "@/components/CorporateSection";
import { getServices, getSettings } from "@/lib/storage";

export const revalidate = 0;

export const metadata = {
  title: "Para Empresas & Comunicação Visual | Criativo Artes",
  description:
    "Brindes corporativos, kits personalizados para colaboradores e clientes, e serviços de comunicação visual comercial: fachadas em ACM, letras luminosas, banners e adesivos.",
};

export default async function EmpresasPage() {
  const services = await getServices(false);
  const settings = await getSettings();

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <CorporateSection services={services} />
      </main>

      <Footer />
    </>
  );
}
