import { QuoteItem, Product } from "@/types";
import { STORE_INFO } from "./constants";

export function formatSingleProductWhatsAppMessage(
  product: Product,
  customData: {
    quantity: number;
    customNamePhrase?: string;
    customTheme?: string;
    customObservations?: string;
  },
  originUrl?: string
): { whatsappUrl: string; plainTextMessage: string } {
  const lines: string[] = [
    `Olá, Criativo Artes! Gostaria de um orçamento para o seguinte produto:`,
    ``,
    `*${product.name}*`,
    `• Categoria: ${product.categoryName}`,
    `• Quantidade: ${customData.quantity} unidade(s)`,
  ];

  if (product.price) {
    lines.push(`• Preço estimado: R$ ${(product.price * customData.quantity).toFixed(2).replace(".", ",")}`);
  } else {
    lines.push(`• Valor: Sob orçamento`);
  }

  if (customData.customNamePhrase?.trim()) {
    lines.push(`• Nome / Frase para estampar: "${customData.customNamePhrase.trim()}"`);
  }

  if (customData.customTheme?.trim()) {
    lines.push(`• Tema / Ocasião: ${customData.customTheme.trim()}`);
  }

  if (customData.customObservations?.trim()) {
    lines.push(`• Observações: ${customData.customObservations.trim()}`);
  }

  if (originUrl) {
    lines.push(``);
    lines.push(`Link do item: ${originUrl}`);
  }

  lines.push(``);
  lines.push(`📸 _(Se tiver fotos ou referências para a arte, enviarei a seguir nesta conversa.)_`);

  const plainTextMessage = lines.join("\n");
  const encoded = encodeURIComponent(plainTextMessage);
  const whatsappUrl = `https://wa.me/${STORE_INFO.whatsapp}?text=${encoded}`;

  return { whatsappUrl, plainTextMessage };
}

export function formatCartWhatsAppMessage(
  items: QuoteItem[],
  baseUrl?: string
): { whatsappUrl: string; plainTextMessage: string } {
  if (items.length === 0) {
    const text = "Olá, Criativo Artes! Gostaria de tirar dúvidas sobre os produtos personalizados.";
    return {
      whatsappUrl: `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`,
      plainTextMessage: text,
    };
  }

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const lines: string[] = [
    `Olá, Criativo Artes! Gostaria de solicitar um orçamento para a seguinte lista (${totalItemsCount} item${totalItemsCount > 1 ? "s" : ""}):`,
    ``,
  ];

  items.forEach((item, index) => {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`*${index + 1}. ${item.productName}*`);
    lines.push(`• Categoria: ${item.categoryName}`);
    lines.push(`• Quantidade: ${item.quantity} un.`);

    if (item.customNamePhrase?.trim()) {
      lines.push(`• Nome / Frase: "${item.customNamePhrase.trim()}"`);
    }

    if (item.customTheme?.trim()) {
      lines.push(`• Tema: ${item.customTheme.trim()}`);
    }

    if (item.customObservations?.trim()) {
      lines.push(`• Obs: ${item.customObservations.trim()}`);
    }

    if (item.price) {
      lines.push(`• Ref. unitária: R$ ${item.price.toFixed(2).replace(".", ",")}`);
    }

    if (baseUrl) {
      lines.push(`• Ver item: ${baseUrl}/catalogo/${item.productSlug}`);
    }
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);
  lines.push(`Por favor, poderia me informar o orçamento e prazo para estes itens?`);
  lines.push(`📸 _(Enviarei fotos, logotipos e referências na sequência da conversa.)_`);

  const plainTextMessage = lines.join("\n");
  const encoded = encodeURIComponent(plainTextMessage);
  const whatsappUrl = `https://wa.me/${STORE_INFO.whatsapp}?text=${encoded}`;

  return { whatsappUrl, plainTextMessage };
}
