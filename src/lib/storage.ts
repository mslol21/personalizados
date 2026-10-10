import fs from "fs";
import { randomUUID } from "node:crypto";
import { ApiError } from "./api";
import { productSchema, settingsSchema, categorySchema, occasionSchema, serviceSchema, gallerySchema, faqSchema, campaignSchema, collection } from "./validation";
import path from "path";
import {
  Product,
  CategoryItem,
  OccasionItem,
  VisualCommunicationService,
  FAQItem,
  CampaignBanner,
  GalleryItem,
  StoreSettings,
} from "@/types";
import {
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_OCCASIONS,
  DEFAULT_VISUAL_COMMUNICATION,
  DEFAULT_FAQS,
  DEFAULT_CAMPAIGNS,
  DEFAULT_GALLERY,
  STORE_INFO,
} from "./constants";

export interface DataStore {
  products: Product[];
  categories: CategoryItem[];
  occasions: OccasionItem[];
  services: VisualCommunicationService[];
  faqs: FAQItem[];
  campaigns: CampaignBanner[];
  gallery: GalleryItem[];
  settings: StoreSettings;
}

const DATA_DIR = process.env.CATALOG_DATA_DIR || path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function ensureStoreExists(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_PATH)) {
      const initialData: DataStore = {
        products: DEFAULT_PRODUCTS,
        categories: DEFAULT_CATEGORIES,
        occasions: DEFAULT_OCCASIONS,
        services: DEFAULT_VISUAL_COMMUNICATION,
        faqs: DEFAULT_FAQS,
        campaigns: DEFAULT_CAMPAIGNS,
        gallery: DEFAULT_GALLERY,
        settings: STORE_INFO,
      };
      fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }

    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as DataStore;

    // Ensure all top-level keys exist in case of partial migrations
    return {
      products: parsed.products || DEFAULT_PRODUCTS,
      categories: parsed.categories || DEFAULT_CATEGORIES,
      occasions: parsed.occasions || DEFAULT_OCCASIONS,
      services: parsed.services || DEFAULT_VISUAL_COMMUNICATION,
      faqs: parsed.faqs || DEFAULT_FAQS,
      campaigns: parsed.campaigns || DEFAULT_CAMPAIGNS,
      gallery: parsed.gallery || DEFAULT_GALLERY,
      settings: parsed.settings || STORE_INFO,
    };
  } catch (error) {
    console.error("Catalog could not be read; refusing to overwrite it", error);
    throw new Error("Catalog unavailable. Restore the data file from backup.");
  }
}

export function getStore(): DataStore {
  return ensureStoreExists();
}

export function assertWritableStore(): void {
  if (process.env.VERCEL) throw new ApiError(503, "O catálogo precisa de banco e armazenamento persistentes antes de permitir alterações nesta hospedagem.");
}

export function saveStore(data: DataStore): void {
  assertWritableStore();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = `${STORE_PATH}.tmp-${randomUUID()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, STORE_PATH);
  } catch (error) {
    console.error("Error saving data store:", error);
    throw new Error("Failed to persist data store");
  }
}

// ======================== PRODUCT OPERATIONS ========================

export function getProducts(includeUnpublished = false): Product[] {
  const store = getStore();
  if (includeUnpublished) return store.products;
  return store.products.filter((p) => p.isPublished);
}

export function getProductBySlug(slug: string, includeUnpublished = false): Product | undefined {
  const store = getStore();
  const product = store.products.find((p) => p.slug === slug);
  if (!product) return undefined;
  if (!includeUnpublished && !product.isPublished) return undefined;
  return product;
}

export function getProductById(id: string): Product | undefined {
  const store = getStore();
  return store.products.find((p) => p.id === id);
}

export function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const store = getStore();
  productData = productSchema.parse(productData);
  if (store.products.some(p => p.slug === productData.slug)) throw new ApiError(409, "Já existe um produto com este endereço.");
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id: `prod-${randomUUID()}`,
    createdAt: now,
    updatedAt: now,
  };
  store.products.unshift(newProduct);
  saveStore(store);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const store = getStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = store.products[index];
  const updated: Product = {
    ...existing,
    ...productSchema.parse({ ...existing, ...updates }),
    createdAt: existing.createdAt,
    id: existing.id, // Immutable ID
    updatedAt: new Date().toISOString(),
  };

  if (store.products.some(p => p.id !== id && p.slug === updated.slug)) throw new ApiError(409, "Já existe um produto com este endereço.");
  store.products[index] = updated;
  saveStore(store);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const store = getStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === initialLength) return false;
  saveStore(store);
  return true;
}

// ======================== CATEGORIES ========================

export function getCategories(includeUnpublished = false): CategoryItem[] {
  const store = getStore();
  let cats = store.categories.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    cats = cats.filter((c) => c.isPublished);
  }
  return cats;
}

export function saveCategories(categories: CategoryItem[]): void {
  const store = getStore();
  store.categories = collection(categorySchema, categories);
  saveStore(store);
}

// ======================== OCCASIONS ========================

export function getOccasions(includeUnpublished = false): OccasionItem[] {
  const store = getStore();
  let occs = store.occasions.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    occs = occs.filter((o) => o.isPublished);
  }
  return occs;
}

export function saveOccasions(occasions: OccasionItem[]): void {
  const store = getStore();
  store.occasions = collection(occasionSchema, occasions);
  saveStore(store);
}

// ======================== VISUAL COMMUNICATION SERVICES ========================

export function getServices(includeDrafts = false): VisualCommunicationService[] {
  const store = getStore();
  let services = store.services.sort((a, b) => a.order - b.order);
  if (!includeDrafts) {
    // Only published items for public, drafts require confirmation
    services = services.filter((s) => s.status === "confirmado_publicado");
  }
  return services;
}

export function saveServices(services: VisualCommunicationService[]): void {
  const store = getStore();
  store.services = collection(serviceSchema, services);
  saveStore(store);
}

// ======================== GALLERY ========================

export function getGalleryItems(includeUnpublished = false): GalleryItem[] {
  const store = getStore();
  let items = store.gallery;
  if (!includeUnpublished) {
    items = items.filter((g) => g.isPublished);
  }
  return items;
}

export function saveGalleryItems(gallery: GalleryItem[]): void {
  const store = getStore();
  store.gallery = collection(gallerySchema, gallery);
  saveStore(store);
}

// ======================== FAQS ========================

export function getFaqs(includeUnpublished = false): FAQItem[] {
  const store = getStore();
  let faqs = store.faqs.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    faqs = faqs.filter((f) => f.isPublished);
  }
  return faqs;
}

export function saveFaqs(faqs: FAQItem[]): void {
  const store = getStore();
  store.faqs = collection(faqSchema, faqs);
  saveStore(store);
}

// ======================== CAMPAIGNS ========================

export function getCampaigns(includeInactive = false): CampaignBanner[] {
  const store = getStore();
  if (includeInactive) return store.campaigns;
  return store.campaigns.filter((c) => c.isActive);
}

export function saveCampaigns(campaigns: CampaignBanner[]): void {
  const store = getStore();
  store.campaigns = collection(campaignSchema, campaigns);
  saveStore(store);
}

// ======================== SETTINGS ========================

export function getSettings(): StoreSettings {
  const store = getStore();
  return store.settings;
}

export function updateSettings(updates: Partial<StoreSettings>): StoreSettings {
  const store = getStore();
  store.settings = settingsSchema.parse({ ...store.settings, ...updates,
    address: { ...store.settings.address, ...updates.address } });
  store.settings.whatsappLink = `https://wa.me/${store.settings.whatsapp}`;
  store.settings.instagramHandle = store.settings.instagramHandle.replace(/^@/, "");
  store.settings.instagram = `https://www.instagram.com/${encodeURIComponent(store.settings.instagramHandle)}/`;
  saveStore(store);
  return store.settings;
}
