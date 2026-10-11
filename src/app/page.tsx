import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { CampaignBannerSection } from "@/components/CampaignBanner";
import { CategoryNav } from "@/components/CategoryNav";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { OccasionFilter } from "@/components/OccasionFilter";
import { StepsSection } from "@/components/StepsSection";
import { CorporateSection } from "@/components/CorporateSection";
import { GallerySection } from "@/components/GallerySection";
import { LocationContactSection } from "@/components/LocationContactSection";
import { FAQSection } from "@/components/FAQSection";
import {
  getProducts,
  getCategories,
  getOccasions,
  getServices,
  getFaqs,
  getCampaigns,
  getGalleryItems,
  getSettings,
} from "@/lib/storage";

export const revalidate = 0; // Fresh on reload

export default async function HomePage() {
  const products = await getProducts(false);
  const categories = await getCategories(false);
  const occasions = await getOccasions(false);
  const services = await getServices(false);
  const faqs = await getFaqs(false);
  const campaigns = await getCampaigns(false);
  const galleryItems = await getGalleryItems(false);
  const settings = await getSettings();

  return (
    <>
      <Header notice={settings.bannerNoticeActive ? settings.bannerNotice : undefined} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Active Seasonal Campaign Banner */}
        <CampaignBannerSection campaigns={campaigns} />

        {/* Categories Navigation Grid */}
        <CategoryNav categories={categories} products={products} />

        {/* Featured Products */}
        <FeaturedProducts products={products} />

        {/* Occasion Selector */}
        <OccasionFilter occasions={occasions} />

        {/* 4 Steps Section */}
        <StepsSection />

        {/* Corporate Gifts & Visual Communication */}
        <CorporateSection services={services} />

        {/* Real Portfolio & Gallery */}
        <GallerySection galleryItems={galleryItems} />

        {/* Physical Store Location & Contacts */}
        <LocationContactSection settings={settings} />

        {/* Frequently Asked Questions */}
        <FAQSection faqs={faqs} />
      </main>

      <Footer />
    </>
  );
}
