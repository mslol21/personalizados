# Criativo Artes Personalizados

Catálogo de personalizados e orçamento por WhatsApp, desenvolvido em Next.js, React, TypeScript e Tailwind.

## Executar

Requer Node.js 20+ e npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Defina `ADMIN_PASSWORD` (mínimo 16 caracteres), `JWT_SECRET` (mínimo 32 caracteres aleatórios) e `APP_ORIGIN` (origem exata do site) no servidor. Não existe senha padrão. Sem configuração válida, o login responde 503 e as sessões são rejeitadas. Em produção, utilize HTTPS. Gere o segredo com `openssl rand -hex 32`; não o salve no GitHub.

`NEXT_PUBLIC_SITE_URL` configura a base de metadados e sitemap. Configure o domínio real antes de publicar. Credenciais administrativas nunca devem usar o prefixo `NEXT_PUBLIC_`.

## Painel

Acesse `/admin/login`. Produtos permitem cadastro, edição, fotos, publicação, destaques e exclusão. Categorias, ocasiões, galeria e FAQs possuem APIs protegidas, mas a interface atual dessas abas é de consulta: ainda falta implementar seus formulários completos. Serviços permitem alterar o status; campanhas permitem ativar/desativar; configurações permitem editar contatos, horários e aviso.

Novos produtos na API são rascunhos por padrão. O formulário permite escolher explicitamente a publicação. Upload aceita PNG, JPEG e WebP, até 5 MB e 25 milhões de pixels. O servidor decodifica e converte em WebP de até 2400 pixels, remove metadados e gera o nome. SVG e imagens animadas não são aceitos para upload. SVGs estáticos já incluídos no projeto continuam funcionando.

## Persistência e hospedagem

O catálogo usa `data/store.json`, com gravação atômica, e imagens em `public/uploads`. Não existe integração ativa com Supabase. O arquivo de cliente sem uso foi removido; isso não migra dados nem altera o banco remoto.

Esta implementação exige **um único processo Node.js com disco persistente**, incluindo o diretório de uploads. `CATALOG_DATA_DIR` pode apontar para um volume persistente para os dados. Faça backups do JSON e das imagens. Não use várias réplicas/processos para escrever no mesmo arquivo: não existe coordenação distribuída.

Na Vercel, as mutações e uploads são bloqueados com 503, pois disco efêmero não mantém o catálogo. Para habilitar edição nessa hospedagem, é necessário implementar banco e armazenamento de objetos com autorização, migração e testes. Configurar apenas uma URL do Supabase não resolve essa integração.

Arquivo de dados inválido gera erro: não é substituído silenciosamente por valores padrão. Imagens e itens de demonstração existentes precisam ser substituídos ou confirmados pela proprietária antes de apresentar o portfólio como trabalhos reais.

## Segurança

- Autenticação administrativa validada no servidor; JWT HS256 com emissor, audiência, identificação e validade de oito horas.
- Cookie HttpOnly, SameSite Strict e Secure em produção.
- Rotação de senha ou segredo invalida as sessões anteriores. Logout remove o cookie do navegador; um token previamente copiado permanece válido até expirar ou ocorrer rotação.
- Alterações exigem sessão e Origin exato. Clientes externos autenticados também precisam enviar esse cabeçalho.
- Login limitado a 30 tentativas a cada cinco minutos por processo, sem confiar em cabeçalhos de IP fornecidos pelo cliente. O limite compartilhado pode temporariamente bloquear outros administradores; múltiplas instâncias exigem limitação compartilhada no proxy.
- Validação de campos, limites de corpo, URLs locais de imagens e links sem esquemas executáveis.
- Rascunhos protegidos, inclusive na busca por ID; JSON-LD escapado contra encerramento do script.
- APIs e painel sem cache compartilhado, cabeçalhos contra enquadramento e interpretação incorreta de MIME.
- A política CSP inclui object-src, base-uri, frame-ancestors e form-action. Não é uma CSP completa com nonces.

## Verificar

```bash
npm run lint
npm run build
npm test
npm audit
```

`npm run lint` executa a checagem de tipos; não é uma análise ESLint. A suíte de regressão inicia um servidor de produção próprio na porta 3219, usa credenciais geradas e uma cópia temporária do catálogo e limpa os dados após o teste. Requer build prévio. Nunca a execute apontando para a loja de produção.

Veja `SECURITY_REVIEW.md` para as vulnerabilidades corrigidas e pendências externas.

## Identidade visual

O cabeçalho, rodapé, painel e favicon utilizam a marca original recortada das imagens fornecidas. A página inicial e o produto de caneca cerâmica usam fotos reais dessas referências; a seção de contato inclui a fachada. Os demais arquivos de demonstração ainda precisam ser substituídos por fotos aprovadas da empresa.

O layout usa rosa, fundos escuros, amarelo-lima e azul-ciano inspirados na referência https://www.brind.etc.br/, mantendo o dourado apenas na arte original da logo, títulos com maior hierarquia, ícones Lucide com traço uniforme e navegação adaptada para celular. Os dados de contato continuam editáveis nas configurações.
