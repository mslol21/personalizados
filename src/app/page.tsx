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
  const products = getProducts(false);
  const categories = getCategories(false);
  const occasions = getOccasions(false);
  const services = getServices(false);
  const faqs = getFaqs(false);
  const campaigns = getCampaigns(false);
  const galleryItems = getGalleryItems(false);
  const settings = getSettings();

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
