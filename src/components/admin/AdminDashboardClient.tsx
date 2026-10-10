"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Product,
  CategoryItem,
  OccasionItem,
  VisualCommunicationService,
  GalleryItem,
  FAQItem,
  CampaignBanner,
  StoreSettings,
} from "@/types";
import {
  Package,
  Layers,
  Sparkles,
  Building2,
  Image as ImageIcon,
  HelpCircle,
  Megaphone,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Save,
  Star,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialProducts: Product[];
  initialCategories: CategoryItem[];
  initialOccasions: OccasionItem[];
  initialServices: VisualCommunicationService[];
  initialGallery: GalleryItem[];
  initialFaqs: FAQItem[];
  initialCampaigns: CampaignBanner[];
  initialSettings: StoreSettings;
}

export function AdminDashboardClient({
  initialProducts,
  initialCategories,
  initialOccasions,
  initialServices,
  initialGallery,
  initialFaqs,
  initialCampaigns,
  initialSettings,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "produtos" | "categorias" | "servicos" | "galeria" | "faqs" | "campanhas" | "configuracoes"
  >("produtos");

  // State collections
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [occasions, setOccasions] = useState<OccasionItem[]>(initialOccasions);
  const [services, setServices] = useState<VisualCommunicationService[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [campaigns, setCampaigns] = useState<CampaignBanner[]>(initialCampaigns);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==================== PRODUCT MODAL & ACTIONS ====================
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category: "canecas",
    categoryName: "Canecas",
    occasions: ["geral"],
    description: "",
    details: [],
    price: undefined,
    isFeatured: false,
    isPublished: true,
    images: ["/images/products/caneca-personalizada-1.svg"],
    minQuantity: 1,
    customizationOptions: {
      allowNameOrPhrase: true,
      allowTheme: true,
      allowPhotoReference: true,
    },
  });

  const [detailsInput, setDetailsInput] = useState("");

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      slug: "",
      category: categories[0]?.slug || "canecas",
      categoryName: categories[0]?.name || "Canecas",
      occasions: ["geral"],
      description: "",
      details: [],
      price: undefined,
      isFeatured: false,
      isPublished: true,
      images: ["/images/products/caneca-personalizada-1.svg"],
      minQuantity: 1,
      customizationOptions: {
        allowNameOrPhrase: true,
        allowTheme: true,
        allowPhotoReference: true,
      },
    });
    setDetailsInput("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setDetailsInput(product.details ? product.details.join("\n") : "");
    setIsProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Erro ao fazer upload da imagem", "error");
        setUploadingImage(false);
        return;
      }

      setProductForm((prev) => ({
        ...prev,
        images: [data.url, ...(prev.images || [])],
      }));
      showToast("Imagem enviada com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("Falha de conexão ao enviar imagem", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name?.trim()) {
      showToast("Nome do produto é obrigatório", "error");
      return;
    }

    const detailsArray = detailsInput
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const selectedCat = categories.find((c) => c.slug === productForm.category);

    const payload = {
      ...productForm,
      categoryName: selectedCat ? selectedCat.name : productForm.categoryName,
      details: detailsArray,
      price: productForm.price ? Number(productForm.price) : undefined,
    };

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || "Erro ao atualizar produto");

        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast("Produto atualizado com sucesso!");
      } else {
        // Create product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const created = await res.json();
        if (!res.ok) throw new Error(created.error || "Erro ao criar produto");

        setProducts((prev) => [created, ...prev]);
        showToast("Produto cadastrado com sucesso!");
      }

      setIsProductModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar alterações", "error");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao excluir produto");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Produto excluído com sucesso!");
    } catch (err: any) {
      showToast(err.message || "Erro ao excluir", "error");
    }
  };

  const handleToggleProductPublish = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error);

      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(updated.isPublished ? "Produto publicado no site!" : "Produto ocultado do site!");
    } catch (err: any) {
      showToast("Erro ao alterar visibilidade", "error");
    }
  };

  const handleToggleProductFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error);

      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(updated.isFeatured ? "Marcado como destaque!" : "Removido dos destaques!");
    } catch (err: any) {
      showToast("Erro ao alterar destaque", "error");
    }
  };

  // ==================== VISUAL COMMUNICATION ACTIONS ====================
  const handleServiceStatusChange = async (id: string, status: "rascunho_pendente" | "confirmado_publicado" | "oculto") => {
    const updatedServices = services.map((s) => (s.id === id ? { ...s, status } : s));
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedServices),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setServices(updatedServices);
      showToast("Status do serviço atualizado!");
    } catch {
      showToast("Erro ao atualizar serviço", "error");
    }
  };

  // ==================== SETTINGS ACTIONS ====================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings(data.settings);
      showToast("Configurações da loja salvas com sucesso!");
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar configurações", "error");
    }
  };

  // ==================== LOGOUT ====================
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-card flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white ${
              toastMessage.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-brand-surface border-b border-brand-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-gold-50 border border-brand-gold-300 p-0.5">
                <Image
                  src="/images/brand/logo-mark.svg"
                  alt="Logo CA"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-base font-bold text-brand-graphite-900 leading-none block">
                  Criativo Artes • Painel Administrativo
                </span>
                <span className="text-[10px] text-brand-gold-700 font-semibold tracking-wider uppercase">
                  Gestor de Catálogo e Conteúdo
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-graphite-700 hover:text-brand-graphite-900 bg-brand-bg hover:bg-brand-muted border border-brand-border transition-colors"
              >
                <span>Ver Site Público</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-brand-border/60">
          {[
            { id: "produtos", label: "Produtos", icon: Package, count: products.length },
            { id: "categorias", label: "Categorias & Ocasiões", icon: Layers },
            { id: "servicos", label: "Comunicação Visual", icon: Building2, count: services.length },
            { id: "galeria", label: "Galeria / Trabalhos", icon: ImageIcon, count: gallery.length },
            { id: "faqs", label: "Perguntas Frequentes", icon: HelpCircle, count: faqs.length },
            { id: "campanhas", label: "Campanhas & Avisos", icon: Megaphone },
            { id: "configuracoes", label: "Configurações da Loja", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? "bg-brand-gold-700 text-white shadow-subtle"
                    : "bg-brand-surface text-brand-graphite-700 hover:bg-brand-muted border border-brand-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-brand-bg text-brand-graphite-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRODUTOS */}
        {activeTab === "produtos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-brand-graphite-900">
                  Gerenciar Produtos ({products.length})
                </h2>
                <p className="text-xs text-brand-graphite-600 mt-0.5">
                  Cadastre, altere preços, fotos, opções de personalização e visibilidade no catálogo.
                </p>
              </div>

              <button
                type="button"
                onClick={openNewProductModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-colors shadow-subtle"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar produto</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg text-brand-graphite-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Preço</th>
                      <th className="py-3.5 px-4">Destaque</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-brand-bg border border-brand-border overflow-hidden relative shrink-0">
                              <Image
                                src={product.images?.[0] || "/images/products/caneca-personalizada-1.svg"}
                                alt={product.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="max-w-xs">
                              <span className="font-bold text-brand-graphite-900 block leading-snug">
                                {product.name}
                              </span>
                              <span className="text-[11px] text-brand-graphite-500 font-mono truncate block">
                                /catalogo/{product.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-brand-graphite-700">
                            {product.categoryName}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {product.price ? (
                            <span className="font-bold text-brand-graphite-900">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-brand-gold-800 bg-brand-gold-50 px-2 py-0.5 rounded border border-brand-gold-200">
                              Sob orçamento
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleProductFeatured(product)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              product.isFeatured
                                ? "bg-amber-50 text-amber-600 border-amber-300"
                                : "bg-brand-bg text-brand-graphite-400 border-brand-border hover:text-brand-graphite-700"
                            }`}
                            title={product.isFeatured ? "Remover de destaque" : "Marcar como destaque"}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleProductPublish(product)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              product.isPublished
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-brand-graphite-100 text-brand-graphite-600 border border-brand-graphite-300"
                            }`}
                          >
                            {product.isPublished ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Publicado</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-brand-graphite-500" />
                                <span>Oculto</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditProductModal(product)}
                              className="p-1.5 text-brand-graphite-700 hover:text-brand-gold-800 hover:bg-brand-gold-50 rounded-lg border border-brand-border transition-colors"
                              title="Editar produto"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-1.5 text-brand-graphite-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-brand-border transition-colors"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIAS & OCASIÕES */}
        {activeTab === "categorias" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Categories Management */}
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
              <h3 className="font-display text-xl font-bold text-brand-graphite-900">
                Categorias ({categories.length})
              </h3>
              <p className="text-xs text-brand-graphite-600">
                Categorias sem produtos publicados ficam ocultas automaticamente no site público.
              </p>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-brand-bg border border-brand-border text-xs"
                  >
                    <div>
                      <span className="font-bold text-brand-graphite-900">{cat.name}</span>
                      <span className="text-[11px] text-brand-graphite-500 block">{cat.slug}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Ativa
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Occasions Management */}
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
              <h3 className="font-display text-xl font-bold text-brand-graphite-900">
                Ocasiões &amp; Filtros ({occasions.length})
              </h3>
              <p className="text-xs text-brand-graphite-600">
                Filtros temáticos para aniversários, casamentos, pets e empresas.
              </p>

              <div className="space-y-2">
                {occasions.map((occ) => (
                  <div
                    key={occ.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-brand-bg border border-brand-border text-xs"
                  >
                    <div>
                      <span className="font-bold text-brand-graphite-900">{occ.name}</span>
                      <span className="text-[11px] text-brand-graphite-500 block">{occ.description}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-gold-800 bg-brand-gold-50 px-2 py-0.5 rounded border border-brand-gold-200">
                      Publicada
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMUNICAÇÃO VISUAL */}
        {activeTab === "servicos" && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900">
                Serviços de Comunicação Visual (Fachadas, Banners, Letreiros)
              </h3>
              <p className="text-xs sm:text-sm text-brand-graphite-600 mt-1">
                Serviços identificados na fachada comercial iniciam com status de rascunho até que a proprietária confirme a publicação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-base font-bold text-brand-graphite-900">
                      {service.title || service.name}
                    </h4>
                    <select
                      value={service.status}
                      onChange={(e) => handleServiceStatusChange(service.id, e.target.value as any)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                        service.status === "confirmado_publicado"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : service.status === "rascunho_pendente"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-brand-graphite-100 text-brand-graphite-600 border-brand-graphite-300"
                      }`}
                    >
                      <option value="confirmado_publicado">Confirmado &amp; Publicado</option>
                      <option value="rascunho_pendente">Rascunho Pendente</option>
                      <option value="oculto">Oculto do Site</option>
                    </select>
                  </div>

                  <p className="text-xs text-brand-graphite-600 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <div className="text-[11px] text-brand-graphite-700">
                    <strong>Materiais:</strong> {service.materials?.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALERIA / TRABALHOS */}
        {activeTab === "galeria" && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900">
                Portfólio &amp; Trabalhos Realizados ({gallery.length})
              </h3>
              <p className="text-xs sm:text-sm text-brand-graphite-600 mt-1">
                Gerencie fotos de projetos reais executados para clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-brand-bg border border-brand-border flex gap-3"
                >
                  <div className="w-16 h-16 rounded-xl bg-brand-surface border border-brand-border overflow-hidden relative shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-brand-graphite-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-brand-gold-700">
                      {item.category}
                    </span>
                    <p className="text-[11px] text-brand-graphite-600 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAQS */}
        {activeTab === "faqs" && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900">
                Perguntas Frequentes ({faqs.length})
              </h3>
              <p className="text-xs sm:text-sm text-brand-graphite-600 mt-1">
                Edite as respostas práticas que esclarecem o processo de orçamento e retirada.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl bg-brand-bg border border-brand-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-brand-graphite-900">
                      {index + 1}. {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-brand-graphite-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CAMPANHAS & AVISOS */}
        {activeTab === "campanhas" && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900">
                Banner Sazonal &amp; Campanhas
              </h3>
              <p className="text-xs sm:text-sm text-brand-graphite-600 mt-1">
                Ative ou desative o banner de campanhas e datas comemorativas.
              </p>
            </div>

            <div className="space-y-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-brand-graphite-900">
                      {camp.title}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const updated = campaigns.map((c) =>
                          c.id === camp.id ? { ...c, isActive: !c.isActive } : c
                        );
                        await fetch("/api/campaigns", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(updated),
                        });
                        setCampaigns(updated);
                        showToast(camp.isActive ? "Campanha desativada" : "Campanha ativada");
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        camp.isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-brand-graphite-100 text-brand-graphite-600 border-brand-graphite-300"
                      }`}
                    >
                      {camp.isActive ? "Ativa no site" : "Desativada"}
                    </button>
                  </div>
                  <p className="text-xs text-brand-graphite-600">{camp.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONFIGURAÇÕES DA LOJA */}
        {activeTab === "configuracoes" && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle">
            <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-graphite-900">
                  Dados da Loja &amp; Atendimento
                </h3>
                <p className="text-xs text-brand-graphite-600 mt-1">
                  Centralize os contatos confirmados da Criativo Artes.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  WhatsApp (apenas números com DDD):
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Telefone Formatado (Exibição):
                </label>
                <input
                  type="text"
                  value={settings.whatsappFormatted}
                  onChange={(e) => setSettings({ ...settings, whatsappFormatted: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Instagram Handle:
                </label>
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Horário de Atendimento (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: 'Segunda a Sexta: 09h às 18h | Sábado: 09h às 13h'"
                  value={settings.businessHours}
                  onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                />
                <span className="text-[11px] text-brand-graphite-500">
                  Se deixado em branco, o site orienta a consultar horários pelo WhatsApp.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Aviso do Topo do Site:
                </label>
                <input
                  type="text"
                  value={settings.bannerNotice || ""}
                  onChange={(e) => setSettings({ ...settings, bannerNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="noticeActive"
                    checked={settings.bannerNoticeActive}
                    onChange={(e) => setSettings({ ...settings, bannerNoticeActive: e.target.checked })}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <label htmlFor="noticeActive" className="text-xs text-brand-graphite-700 font-medium">
                    Exibir barra de aviso no topo do site
                  </label>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-colors shadow-subtle"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar alterações</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-graphite-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-surface rounded-3xl border border-brand-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="font-display text-xl font-bold text-brand-graphite-900">
                {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-graphite-400 hover:text-brand-graphite-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Nome do Produto:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Caneca de Cerâmica Personalizada com Foto"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                    Categoria:
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900 font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                    Preço Unitário (R$, opcional):
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    placeholder="Em branco = 'Sob orçamento'"
                    value={productForm.price !== undefined ? productForm.price : ""}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Descrição do Produto:
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhes sobre o produto, material e acabamento..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900 resize-none"
                />
              </div>

              {/* Details (one per line) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Itens &amp; Especificações (1 por linha):
                </label>
                <textarea
                  rows={3}
                  placeholder="Capacidade: 325ml&#10;Material: Cerâmica resinada brilhante&#10;Acompanha caixinha de presente"
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-xs sm:text-sm text-brand-graphite-900 font-mono text-[11px] resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 pt-2 border-t border-brand-border/60">
                <label className="text-xs font-bold text-brand-graphite-800 uppercase tracking-wider block">
                  Foto do Produto:
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-bg border border-brand-border overflow-hidden relative shrink-0">
                    <Image
                      src={productForm.images?.[0] || "/images/products/caneca-personalizada-1.svg"}
                      alt="Preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-graphite-900 bg-brand-bg hover:bg-brand-muted border border-brand-border cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-brand-gold-700" />
                      <span>{uploadingImage ? "Enviando imagem..." : "Enviar Nova Foto"}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <span className="text-[10px] text-brand-graphite-500 block mt-1">
                      Formatos aceitos: JPG, PNG, WEBP, SVG (máx 5MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Flags: Featured & Published */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-brand-border/60 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <span className="font-semibold text-brand-graphite-800">Destacar na página inicial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isPublished}
                    onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500"
                  />
                  <span className="font-semibold text-brand-graphite-800">Publicado no catálogo</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-graphite-700 hover:bg-brand-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-gold-700 hover:bg-brand-gold-800 transition-colors shadow-subtle"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
