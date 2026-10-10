import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { getGalleryItems, getSettings } from "@/lib/storage";

export const revalidate = 0;

export const metadata = {
  title: "Galeria de Trabalhos Realizados | Criativo Artes",
  description:
    "Confira fotos e projetos de presentes personalizados, taças para eventos, kits corporativos e projetos de comunicação visual executados pela Criativo Artes.",
};

export default async function TrabalhosPage() {
  const galleryItems = getGalleryItems(false);
  const settings = getSettings();

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1 py-10 bg-brand-bg">
        <GallerySection galleryItems={galleryItems} />
      </main>

      <Footer />
    </>
  );
}
