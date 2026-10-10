import { z } from "zod";

const text = z.string().max(4000);
const name = z.string().trim().min(1).max(160);
const id = z.string().min(1).max(160);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180);
const order = z.number().int().min(0).max(100000);
const image = z.string().max(2048).refine(value =>
  /^\/(?:images|uploads)\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|svg)$/.test(value), "Use uma imagem local válida");
const link = z.string().max(2048).refine(value => {
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
}, "Link inválido");
const strings = z.array(text).max(100);
const customField = z.object({ id, label: name, type: z.enum(["text", "textarea", "select"]),
  placeholder: text.optional(), options: strings.optional(), required: z.boolean(), helpText: text.optional() });
export const productSchema = z.object({
  name, slug, category: slug, categoryName: name, occasions: z.array(id).max(50),
  description: text, details: strings, price: z.number().finite().min(0).max(10000000).nullable().transform(value => value === null ? undefined : value).optional(),
  isFeatured: z.boolean(), isPublished: z.boolean(), images: z.array(image).min(1).max(30),
  minQuantity: z.number().int().min(1).max(100000).optional(),
  customizationOptions: z.object({ allowNameOrPhrase: z.boolean(), allowTheme: z.boolean(),
    allowPhotoReference: z.boolean(), customFields: z.array(customField).max(30).optional() }),
});
export const categorySchema = z.object({ id, slug, name, description: text, iconName: name,
  image: image.optional(), order, isPublished: z.boolean() });
export const occasionSchema = z.object({ id, slug, name, description: text.optional(),
  colorBadge: z.string().max(100), order, isPublished: z.boolean() });
export const serviceSchema = z.object({ id, slug, title: name, name: name.optional(),
  shortDescription: text, fullDescription: text, materials: strings,
  status: z.enum(["rascunho_pendente", "confirmado_publicado", "oculto"]), image: image.optional(), order });
export const gallerySchema = z.object({ id, title: name,
  category: z.enum(["presentes", "eventos", "brindes", "comunicacao-visual"]),
  description: text.optional(), image, featured: z.boolean(), isPublished: z.boolean(), createdAt: text });
export const faqSchema = z.object({ id, question: name, answer: text, order, isPublished: z.boolean() });
export const campaignSchema = z.object({ id, title: name, subtitle: text, buttonText: name,
  buttonLink: link, badge: text.optional(), isActive: z.boolean(), theme: z.enum(["gold", "festive", "corporate", "love"]) });
export const settingsSchema = z.object({
  companyName: name, commercialName: name, whatsapp: z.string().regex(/^\d{10,15}$/),
  whatsappFormatted: name, whatsappLink: link, instagram: link, instagramHandle: name,
  address: z.object({ street: name, number: name, neighborhood: name, city: name,
    state: z.string().regex(/^[A-Z]{2}$/), fullAddress: name, googleMapsSearchUrl: link }),
  businessHours: text, cnpj: text.optional(), bannerNotice: text.optional(), bannerNoticeActive: z.boolean(),
});
export function collection<T>(schema: z.ZodType<T>, input: unknown): T[] {
  const rows = z.array(schema).max(1000).parse(input);
  const ids = rows.map(row => (row as { id: string }).id);
  if (new Set(ids).size !== ids.length) throw new z.ZodError([{ code: "custom", path: [], message: "IDs duplicados" }]);
  return rows;
}
