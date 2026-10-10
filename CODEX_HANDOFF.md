# Documento de Continuidade Técnica — Revisão Codex 📑

**Projeto:** Criativo Artes Personalizados  
**Ambiente Inicial de Desenvolvimento:** Google Antigravity  
**Revisor / Continuidade:** Codex / Equipe de Engenharia  
**Data:** 09/10/2026  

---

## 🎯 1. Visão Geral da Entrega

O site da **Criativo Artes Personalizados** foi implementado do zero como uma aplicação web completa, moderna, acessível e funcional utilizando **Next.js (App Router)** com **TypeScript** e **Tailwind CSS**.

O modelo de negócio implementado é **catálogo com solicitação de orçamento via WhatsApp**, com lista de itens personalizada, sem inventar preços fictícios, horários ou avaliações artificiais.

---

## 🏗️ 2. Arquitetura e Decisões de Engenharia

### A. Camada de Apresentação (Frontend)
* **Design System Acessível:**
  - Cores: Fundo marfim quente (`#FAF8F5`), texto em grafite de alto contraste (`#1A1D20`), acentos em ouro nobre (`#D4AF37` / `#A6802C`).
  - Tipografia: Combinação de `Cormorant Garamond` (serifa elegante para títulos) e `Inter` (sans-serif para alta legibilidade).
  - Acessibilidade: Relação de contraste WCAG AA/AAA (> 4.5:1), navegação por teclado (`focus-visible`), ausência de rolagem horizontal e suporte a `prefers-reduced-motion`.
* **Lista de Orçamento (*Quote Cart*):**
  - Implementada em `src/lib/cart-context.tsx` persistida no `localStorage` do navegador sob a chave `criativo_artes_quote_cart_v1`.
  - Permite adicionar produtos com campos de personalização (frase/nome, tema, observações), alterar quantidades, remover itens e limpar a lista.
  - Sincroniza tanto em uma gaveta lateral (*QuoteDrawer*) quanto na página dedicada `/orcamento`.
* **Formatador de WhatsApp (`src/lib/whatsapp.ts`):**
  - Codificação segura de mensagens com itens, quantidades, personalizações e links diretos dos produtos.
  - Disponibiliza recurso de **"Copiar resumo do pedido"** como alternativa caso a URL fique muito extensa no cliente.

### B. Camada de Persistência e Backend (Storage & API)
* **Storage JSON Atômico (`src/lib/storage.ts`):**
  - Persiste todos os dados em `data/store.json`.
  - Utiliza escrita atômica via arquivos temporários (`store.json.tmp-*` renomeados com `fs.renameSync`) prevenindo corrupção de dados sob concorrência.
  - Faz auto-seeding inicial transparente a partir de `src/lib/constants.ts` caso o arquivo `data/store.json` ainda não exista.
* **Autenticação & Segurança (`src/lib/auth.ts`):**
  - Proteção por senha administrativa (`ADMIN_PASSWORD`, padrão `criativo2026`).
  - Geração de token JWT assinado (`HS256`) armazenado em cookie `HttpOnly`, `SameSite=Lax`.
  - Todas as rotas de mutação da API (`POST`, `PUT`, `DELETE`) validam rigorosamente a sessão administrativa no servidor antes de executar qualquer alteração. Visitantes anônimos recebem `401 Unauthorized`.
* **Upload Seguro de Imagens (`src/app/api/upload/route.ts`):**
  - Restrito a administradores autenticados.
  - Validação de formato (`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`) e limite estrito de 5MB por arquivo.
  - Armazenamento em `public/uploads/` com higienização de nomes e prefixos temporais.

---

## 🗺️ 3. Mapa de Rotas e Endpoints

### Rotas Públicas (Páginas)
* `/` — Página inicial completa com Hero, Banners sazonais, Categorias, Destaques, Ocasiões, 4 Passos, Brindes & Comunicação Visual, Portfólio, Localização física e FAQs.
* `/catalogo` — Catálogo interativo com busca em tempo real, filtros combinados por categoria e ocasião, ordenação por preço e destaques, e estado vazio amigável.
* `/catalogo/[slug]` — Página individual do produto com galeria de fotos, especificações, formulário de personalização, orçamento direto no WhatsApp e botão de adição à lista.
* `/empresas` — Seção voltada para brindes corporativos e serviços de comunicação visual comercial.
* `/trabalhos` — Galeria de projetos reais realizados com filtro por tipo de trabalho.
* `/contato` — Endereço completo no Jardim Arpoador, botão de busca no Google Maps, canais de WhatsApp e Instagram, e FAQ.
* `/orcamento` — Página completa de revisão da lista de orçamento com envio formatado para WhatsApp e botão de cópia.

### Rotas Administrativas
* `/admin/login` — Tela de login com validação de senha.
* `/admin` — Painel administrativo com abas para Produtos, Categorias & Ocasiões, Comunicação Visual, Galeria, FAQs, Campanhas e Configurações da Loja.

### Endpoints REST (`/api/*`)
* `POST /api/auth/login` — Autenticação de admin e emissão de cookie de sessão.
* `POST /api/auth/logout` — Revogação de sessão.
* `GET /api/auth/me` — Verificação de estado de autenticação.
* `GET, POST /api/products` — Listagem e cadastro de produtos.
* `GET, PUT, DELETE /api/products/[id]` — Consulta, edição e exclusão de produto.
* `GET, PUT /api/categories` — Gestão de categorias.
* `GET, PUT /api/occasions` — Gestão de ocasiões.
* `GET, PUT /api/services` — Gestão de serviços de comunicação visual.
* `GET, PUT /api/gallery` — Gestão do portfólio.
* `GET, PUT /api/faqs` — Gestão de perguntas frequentes.
* `GET, PUT /api/campaigns` — Gestão de campanhas e avisos sazonais.
* `GET, PUT /api/settings` — Gestão de dados da loja e contatos.
* `POST /api/upload` — Upload seguro de imagens com validação de tamanho e tipo.

---

## 🔍 4. Pontos de Atenção & Recomendações para Revisão do Codex

1. **Migração de Banco de Dados (Opcional para Grande Escala):**
   - Atualmente, a persistência utiliza JSON em disco com escrita atômica (`data/store.json`), ideal para catálogo comercial leve/médio e fácil hospedagem em instâncias Node.js.
   - Caso o projeto seja implantado em arquitetura *Serverless* pura (como Vercel) com múltiplos nós efêmeros, recomenda-se conectar a interface de `src/lib/storage.ts` a um banco relacional como PostgreSQL (ex: Supabase, Neon ou Prisma) ou S3/R2 para uploads. As assinaturas das funções já estão desacopladas.

2. **Pendências de Conteúdo com a Proprietária:**
   - **Horário de Atendimento:** O campo está pronto e editável no painel administrativo. Enquanto não for preenchido, o site informa para consultar pelo WhatsApp.
   - **Serviços da Fachada (ACM, Letreiros, Toldos):** Foram cadastrados com status inicial `rascunho_pendente` para que a proprietária aprove ou edite no painel antes da publicação definitiva.
   - **Fotografias:** Todos os produtos e trabalhos já contam com imagens vetoriais SVG de alta resolução. A proprietária pode enriquecer o catálogo com fotos reais do ateliê pelo botão de upload do painel.

3. **SEO e Domínio Definitivo:**
   - O `metadataBase` e `sitemap.ts` foram configurados com a URL canônica padrão `https://criativoartespersonalizados.com.br`. Atualizar caso o domínio registrado final seja diferente.

---

## 🚀 5. Suíte de Testes Executada

O script de teste automatizado `scripts/test-suite.js` foi executado com sucesso e validou:
* ✅ Listagem pública de produtos com filtragem
* ✅ Bloqueio 401 para requisições não autenticadas em rotas de mutação
* ✅ Autenticação com cookie HTTP-only
* ✅ Criação, atualização e exclusão de produto com persistência no servidor
* ✅ Geração correta do `sitemap.xml` e `robots.txt`
