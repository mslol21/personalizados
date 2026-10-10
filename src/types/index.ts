export type ProductCategory =
  | "canecas"
  | "garrafas-copos"
  | "tacas-long-drinks"
  | "camisetas"
  | "azulejos"
  | "toalhinhas"
  | "brindes"
  | "cestas-presentes"
  | "papelaria";

export type ProductOccasion =
  | "aniversario"
  | "casamento-noivado"
  | "maternidade-batizado"
  | "pets"
  | "empresas-corporativo"
  | "datas-comemorativas"
  | "geral";

export interface CustomizationField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required: boolean;
  helpText?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  occasions: string[];
  description: string;
  details: string[];
  price?: number; // Optional: if undefined, displays "Sob orçamento"
  isFeatured: boolean;
  isPublished: boolean;
  images: string[];
  minQuantity?: number;
  customizationOptions: {
    allowNameOrPhrase: boolean;
    allowTheme: boolean;
    allowPhotoReference: boolean;
    customFields?: CustomizationField[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  image?: string;
  order: number;
  isPublished: boolean;
}

export interface OccasionItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  colorBadge: string;
  order: number;
  isPublished: boolean;
}

export interface VisualCommunicationService {
  id: string;
  slug: string;
  title: string;
  name?: string;
  shortDescription: string;
  fullDescription: string;
  materials: string[];
  status: "rascunho_pendente" | "confirmado_publicado" | "oculto";
  image?: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "presentes" | "eventos" | "brindes" | "comunicacao-visual";
  description?: string;
  image: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export interface CampaignBanner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
  isActive: boolean;
  theme: "gold" | "festive" | "corporate" | "love";
}

export interface StoreSettings {
  companyName: string;
  commercialName: string;
  whatsapp: string;
  whatsappFormatted: string;
  whatsappLink: string;
  instagram: string;
  instagramHandle: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    fullAddress: string;
    googleMapsSearchUrl: string;
  };
  // Missing data documented and editable:
  businessHours: string; // e.g. "" (if empty, shows "Consulte horários pelo WhatsApp")
  cnpj?: string; // Optional
  bannerNotice?: string;
  bannerNoticeActive: boolean;
}

export interface QuoteItem {
  cartId: string;
  productId: string;
  productSlug: string;
  productName: string;
  categoryName: string;
  image: string;
  price?: number;
  quantity: number;
  customNamePhrase?: string;
  customTheme?: string;
  customObservations?: string;
}

export interface AdminUser {
  username: string;
  name: string;
}
