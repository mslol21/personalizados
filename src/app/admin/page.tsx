import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";
import {
  getProducts,
  getCategories,
  getOccasions,
  getServices,
  getGalleryItems,
  getFaqs,
  getCampaigns,
  getSettings,
} from "@/lib/storage";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const revalidate = 0;

export const metadata = {
  title: "Painel Administrativo | Criativo Artes Personalizados",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("criativo_admin_token")?.value;

  const isValidAdmin = verifyAdminToken(token);

  if (!isValidAdmin) {
    redirect("/admin/login");
  }

  // Admin gets all products, categories, services, etc. including drafts and unpublished
  const products = getProducts(true);
  const categories = getCategories(true);
  const occasions = getOccasions(true);
  const services = getServices(true);
  const gallery = getGalleryItems(true);
  const faqs = getFaqs(true);
  const campaigns = getCampaigns(true);
  const settings = getSettings();

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialCategories={categories}
      initialOccasions={occasions}
      initialServices={services}
      initialGallery={gallery}
      initialFaqs={faqs}
      initialCampaigns={campaigns}
      initialSettings={settings}
    />
  );
}
