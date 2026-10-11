import fs from "fs";
import { cache } from "react";
import { supabaseRequest, usesSupabase } from "./supabase-server";
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

function parseStore(value: unknown): DataStore {
  if (!value || typeof value !== "object") throw new ApiError(503, "Catálogo inválido no banco.");
  const data = value as DataStore;
  for (const key of ["products", "categories", "occasions", "services", "faqs", "campaigns", "gallery"] as const) {
    if (!Array.isArray(data[key])) throw new ApiError(503, "Catálogo incompleto no banco.");
  }
  if (!data.settings || typeof data.settings !== "object") throw new ApiError(503, "Configurações ausentes no banco.");
  return data;
}

interface CatalogRow { id: string; revision: number; data: DataStore }
async function readCatalog(): Promise<CatalogRow> {
  const response = await supabaseRequest("/rest/v1/catalog_store?id=eq.main&select=id,revision,data");
  const rows = await response.json() as CatalogRow[];
  if (!Array.isArray(rows) || rows.length !== 1 || !Number.isSafeInteger(rows[0].revision)) {
    throw new ApiError(503, "Catálogo não inicializado no Supabase. Execute a preparação do banco.");
  }
  return { ...rows[0], data: parseStore(rows[0].data) };
}

// React deduplicates reads within one server render, never across requests.
const readRenderStore = cache(async (): Promise<DataStore> => usesSupabase() ? (await readCatalog()).data : ensureStoreExists());
export async function getStore(): Promise<DataStore> { return readRenderStore(); }

export function assertWritableStore(): void {
  if (process.env.VERCEL && !usesSupabase()) throw new ApiError(503, "Use Supabase para manter o catálogo nesta hospedagem.");
}

function saveFile(data: DataStore): void {
  assertWritableStore();
  const tempPath = `${STORE_PATH}.tmp-${randomUUID()}`;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, STORE_PATH);
  } catch {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    throw new ApiError(503, "Não foi possível salvar o catálogo.");
  }
}

async function mutateStore<T>(change: (store: DataStore) => T): Promise<T> {
  assertWritableStore();
  if (!usesSupabase()) {
    // Synchronous read/change/write keeps file operations serialized in one process.
    const store = ensureStoreExists();
    const result = change(store);
    saveFile(store);
    return result;
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await readCatalog();
    const result = change(row.data);
    const response = await supabaseRequest(`/rest/v1/catalog_store?id=eq.main&revision=eq.${row.revision}`, {
      method: "PATCH", headers: { Prefer: "return=representation" },
      body: JSON.stringify({ data: row.data, revision: row.revision + 1, updated_at: new Date().toISOString() }),
    });
    const updated = await response.json();
    if (Array.isArray(updated) && updated.length === 1) return result;
    // A competing write won. Reread and reapply only this mutation.
  }
  throw new ApiError(409, "O catálogo foi alterado ao mesmo tempo. Tente salvar novamente.");
}

// ======================== PRODUCT OPERATIONS ========================

export async function getProducts(includeUnpublished = false): Promise<Product[]> {
  const store = await getStore();
  if (includeUnpublished) return store.products;
  return store.products.filter((p) => p.isPublished);
}

export async function getProductBySlug(slug: string, includeUnpublished = false): Promise<Product | undefined> {
  const store = await getStore();
  const product = store.products.find((p) => p.slug === slug);
  if (!product) return undefined;
  if (!includeUnpublished && !product.isPublished) return undefined;
  return product;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const store = await getStore();
  return store.products.find((p) => p.id === id);
}

export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  return mutateStore(store => {
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
    return newProduct;
  });
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  return mutateStore(store => {
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
    return updated;
  });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return mutateStore(store => {
    const initialLength = store.products.length;
    store.products = store.products.filter((p) => p.id !== id);
    if (store.products.length === initialLength) return false;
    return true;
  });
}

// ======================== CATEGORIES ========================

export async function getCategories(includeUnpublished = false): Promise<CategoryItem[]> {
  const store = await getStore();
  let cats = store.categories.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    cats = cats.filter((c) => c.isPublished);
  }
  return cats;
}

export async function saveCategories(categories: CategoryItem[]): Promise<void> {
  return mutateStore(store => {
    store.categories = collection(categorySchema, categories);
  });
}

// ======================== OCCASIONS ========================

export async function getOccasions(includeUnpublished = false): Promise<OccasionItem[]> {
  const store = await getStore();
  let occs = store.occasions.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    occs = occs.filter((o) => o.isPublished);
  }
  return occs;
}

export async function saveOccasions(occasions: OccasionItem[]): Promise<void> {
  return mutateStore(store => {
    store.occasions = collection(occasionSchema, occasions);
  });
}

// ======================== VISUAL COMMUNICATION SERVICES ========================

export async function getServices(includeDrafts = false): Promise<VisualCommunicationService[]> {
  const store = await getStore();
  let services = store.services.sort((a, b) => a.order - b.order);
  if (!includeDrafts) {
    // Only published items for public, drafts require confirmation
    services = services.filter((s) => s.status === "confirmado_publicado");
  }
  return services;
}

export async function saveServices(services: VisualCommunicationService[]): Promise<void> {
  return mutateStore(store => {
    store.services = collection(serviceSchema, services);
  });
}

// ======================== GALLERY ========================

export async function getGalleryItems(includeUnpublished = false): Promise<GalleryItem[]> {
  const store = await getStore();
  let items = store.gallery;
  if (!includeUnpublished) {
    items = items.filter((g) => g.isPublished);
  }
  return items;
}

export async function saveGalleryItems(gallery: GalleryItem[]): Promise<void> {
  return mutateStore(store => {
    store.gallery = collection(gallerySchema, gallery);
  });
}

// ======================== FAQS ========================

export async function getFaqs(includeUnpublished = false): Promise<FAQItem[]> {
  const store = await getStore();
  let faqs = store.faqs.sort((a, b) => a.order - b.order);
  if (!includeUnpublished) {
    faqs = faqs.filter((f) => f.isPublished);
  }
  return faqs;
}

export async function saveFaqs(faqs: FAQItem[]): Promise<void> {
  return mutateStore(store => {
    store.faqs = collection(faqSchema, faqs);
  });
}

// ======================== CAMPAIGNS ========================

export async function getCampaigns(includeInactive = false): Promise<CampaignBanner[]> {
  const store = await getStore();
  if (includeInactive) return store.campaigns;
  return store.campaigns.filter((c) => c.isActive);
}

export async function saveCampaigns(campaigns: CampaignBanner[]): Promise<void> {
  return mutateStore(store => {
    store.campaigns = collection(campaignSchema, campaigns);
  });
}

// ======================== SETTINGS ========================

export async function getSettings(): Promise<StoreSettings> {
  const store = await getStore();
  return store.settings;
}

export async function updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  return mutateStore(store => {
    store.settings = settingsSchema.parse({ ...store.settings, ...updates,
      address: { ...store.settings.address, ...updates.address } });
    store.settings.whatsappLink = `https://wa.me/${store.settings.whatsapp}`;
    store.settings.instagramHandle = store.settings.instagramHandle.replace(/^@/, "");
    store.settings.instagram = `https://www.instagram.com/${encodeURIComponent(store.settings.instagramHandle)}/`;
    return store.settings;
  });
}
