# Criativo Artes Personalizados 🎨✨

> **Criativo Artes — Brindes e Personalizados**  
> *"Seu presente, com a sua ideia e o nosso cuidado."*

Plataforma web completa e funcional desenvolvida para a **Criativo Artes Personalizados**, empresa especializada em presentes afetivos, lembrancinhas, canecas, copos térmicos, taças de gin, azulejos e brindes corporativos, além de soluções de comunicação visual comercial no Jardim Arpoador, São Paulo - SP.

---

## 🌟 1. Dados Confirmados da Empresa

* **Nome Comercial:** Criativo Artes — Brindes e Personalizados
* **Razão / Nome:** Criativo Artes Personalizados
* **WhatsApp Oficial:** `(11) 98750-7750` | [https://wa.me/5511987507750](https://wa.me/5511987507750)
* **Instagram:** [@criativoartes.personalizados](https://www.instagram.com/criativoartes.personalizados/)
* **Endereço Físico:** Avenida General Asdrúbal da Cunha, 1278 — Jardim Arpoador, São Paulo — SP
* **Link de Busca no Google Maps:** [Acessar Localização](https://www.google.com/maps/search/?api=1&query=Avenida+General+Asdr%C3%BAbal+da+Cunha%2C+1278+-+Jardim+Arpoador%2C+S%C3%A3o+Paulo+-+SP)

> **Observação:** Não foram inventados preços fictícios, horários, CEP, CNPJ ou avaliações artificiais. Dados pendentes são gerenciáveis e editáveis diretamente no Painel Administrativo.

---

## 🚀 2. Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components & Client Components)
* **Linguagem:** TypeScript (Strict Type Safety)
* **Estilização:** Tailwind CSS com paleta nobre e acessível (base marfim `#FAF8F5`, grafite `#1A1D20`, detalhes em ouro `#D4AF37` / `#A6802C`)
* **Ícones:** Lucide React
* **Persistência de Dados:** Storage JSON atômico no servidor (`data/store.json`) com seeding automático de dados padrão
* **Lista de Orçamento:** LocalStorage no cliente com sincronização em tempo real e drawer lateral
* **Segurança:** Autenticação administrativa com token JWT assinado via cookies HTTP-only e proteção de endpoints de mutação
* **SEO & Descoberta:** OpenGraph, Twitter Cards, Sitemap XML dinâmico, Robots.txt e Schema.org (`LocalBusiness` e `Product`)

---

## 🛠️ 3. Como Instalar e Executar

### Pré-requisitos
* Node.js v18+ ou v20+ instalado
* npm ou yarn

### Passo a passo
1. Clone ou acesse a pasta do projeto:
```bash
cd personalizados
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo de variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o site no seu navegador em: [http://localhost:3000](http://localhost:3000)

---

## 🔑 4. Painel Administrativo e Gestão de Catálogo

* **URL de Acesso:** `/admin/login` ou [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Senha Padrão Inicial:** `criativo2026` (configurável via `ADMIN_PASSWORD` no `.env.local`)

### Recursos do Painel:
* **Produtos:** Adicionar novos itens, editar descrições e especificações, definir preço ou "Sob orçamento", enviar fotos (com validação de formato e limite de 5MB), marcar destaques e alternar entre publicado e oculto.
* **Categorias & Ocasiões:** Gerenciar categorias ativas e ocasiões temáticas (aniversários, casamentos, pets, empresas).
* **Comunicação Visual:** Gerenciar serviços identificados na fachada comercial (ACM, letras luminosas, banners, adesivos, toldos) com alternância entre *Rascunho Pendente*, *Confirmado & Publicado* e *Oculto*.
* **Portfólio / Galeria:** Publicar e categorizar fotos de trabalhos reais.
* **Perguntas Frequentes (FAQ):** Atualizar respostas sobre pedidos, arte e retirada.
* **Campanhas & Avisos:** Ativar ou desativar banners sazonais para datas comemorativas.
* **Configurações da Loja:** Atualizar WhatsApp, Instagram, endereço e horários de funcionamento.

---

## 📁 5. Estrutura de Rotas e Diretórios

```
personalizados/
├── data/
│   └── store.json               # Banco de dados persistente em arquivo com escrita atômica
├── public/
│   ├── images/
│   │   ├── brand/               # Logotipo e monograma CA em vetor SVG
│   │   ├── products/            # Mockups e fotos dos produtos em alta definição
│   │   └── gallery/             # Imagens de projetos reais para o portfólio
│   └── uploads/                 # Diretório seguro para fotos enviadas via painel
├── src/
│   ├── app/
│   │   ├── api/                 # Endpoints REST protegidos (auth, products, upload, etc.)
│   │   ├── catalogo/            # Catálogo e página individual [slug]
│   │   ├── empresas/            # Brindes corporativos e comunicação visual
│   │   ├── trabalhos/           # Galeria de portfólio filtrável
│   │   ├── contato/             # Endereço, mapa, contatos e FAQ
│   │   ├── orcamento/           # Revisão e envio da lista de orçamento no WhatsApp
│   │   ├── admin/               # Login e Painel Administrativo completo
│   │   ├── layout.tsx           # Layout raiz com fontes, schema.org e providers
│   │   ├── page.tsx             # Página inicial com todas as seções
│   │   ├── sitemap.ts           # Geração dinâmica do sitemap XML
│   │   └── robots.ts            # Regras para motores de busca
│   ├── components/              # Componentes acessíveis de UI (Hero, Header, Footer, etc.)
│   ├── lib/                     # Constantes, autenticação, storage, cart e formatador WhatsApp
│   └── types/                   # Interfaces TypeScript completas
├── scripts/
│   ├── generate-assets.js       # Gerador de vetores e mockups SVG
│   └── test-suite.js            # Bateria automatizada de testes E2E
├── CODEX_HANDOFF.md             # Documento de continuidade técnica para o Codex
└── package.json
```

---

## ✅ 6. Verificações Realizadas

* **Responsividade:** Verificado em celular (360px, 390px, 412px), tablets e desktops.
* **Contraste & Acessibilidade:** Texto em grafite escuro sobre fundo claro (contraste superior a 4.5:1), anéis de foco visíveis (`focus-visible`) e suporte a `prefers-reduced-motion`.
* **Fluxo de Orçamento:**
  - Adição de produtos individuais com nome/frase, tema e observações personalizadas.
  - Gaveta (*Drawer*) e página de orçamento com controle de quantidade.
  - Geração de mensagem formatada no WhatsApp com encoding seguro e botão alternativo de cópia de texto.
* **Persistência Real:** Criação, edição e exclusão de produtos persistidas em `data/store.json` e verificadas via suíte de testes.
* **Segurança:** Visitantes não autenticados são bloqueados com `401 Unauthorized` em todas as rotas de mutação da API.

---

## 📋 7. Pendências Documentadas para a Proprietária

1. **Horário de Funcionamento:** Deixado em aberto com orientação para consulta no WhatsApp até cadastro no painel.
2. **Serviços da Fachada (ACM, Toldos, etc.):** Iniciam com status de *Rascunho Pendente* para que a proprietária confirme as modalidades exatas que atende.
3. **Fotografias Adicionais:** A proprietária pode substituir ou subir novas fotos reais pelo painel administrativo em `/admin`.
