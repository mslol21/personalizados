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
  const products = await getProducts(true);
  const categories = await getCategories(true);
  const occasions = await getOccasions(true);
  const services = await getServices(true);
  const gallery = await getGalleryItems(true);
  const faqs = await getFaqs(true);
  const campaigns = await getCampaigns(true);
  const settings = await getSettings();

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
