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

Na Vercel, o catálogo usa Supabase: `public.catalog_store` mantém os dados e uma revisão para impedir perda de alterações concorrentes. As fotos são convertidas em WebP e enviadas ao bucket privado `catalog-photos`. O servidor autentica cada alteração antes de acessar o banco; visitantes e usuários Supabase comuns não recebem acesso direto à tabela.

O projeto **criativo artes** (`cjfbbqvutsarubftkdlo`) foi preparado com 12 produtos e 9 categorias do catálogo inicial. A carga inicial em `supabase/seed.sql` não sobrescreve dados existentes. `supabase/bootstrap.sql` registra a estrutura e permissões aplicadas. Não execute a carga apontando para outro projeto sem revisar os dados.

Configure em **Production** na Vercel:

| Variável | Valor |
| --- | --- |
| `CATALOG_BACKEND` | `supabase` (padrão na Vercel) |
| `SUPABASE_URL` | `https://cjfbbqvutsarubftkdlo.supabase.co` |
| `SUPABASE_SECRET_KEY` | Chave secreta `sb_secret_...` do projeto, em Settings > API Keys |
| `APP_ORIGIN` e `NEXT_PUBLIC_SITE_URL` | Origem HTTPS real do site |

A chave secreta fica apenas no servidor, sem prefixo `NEXT_PUBLIC_`; não é a senha administrativa nem o `JWT_SECRET`. A chave `service_role` legada também funciona em `SUPABASE_SERVICE_ROLE_KEY`. A chave anon/publishable não permite administrar este catálogo. Após configurar, publique esta versão e faça redeploy. Falha no Supabase gera erro explícito: a aplicação não grava no disco local nem troca silenciosamente para os itens iniciais.

Fotos novas têm endereço local `/uploads/<uuid>.webp`; o servidor busca o objeto privado. Rascunhos e uploads não utilizados exigem sessão administrativa. Fotos referenciadas por produtos, categorias, trabalhos ou serviços publicados são servidas aos visitantes. Imagens do painel dispensam o otimizador para que a sessão seja enviada na prévia. Imagens publicadas podem já ter sido copiadas ou armazenadas pelo navegador/otimizador; ocultar um item não recupera cópias anteriores.

Em desenvolvimento sem Supabase, `CATALOG_BACKEND=file` usa `data/store.json` e `public/uploads`. Esse modo requer um único processo Node com disco persistente. `CATALOG_DATA_DIR` pode apontar para um volume. Escritas em arquivo continuam proibidas na Vercel. Faça backup do banco e dos objetos; fotos sem referência após um formulário abandonado não são removidas automaticamente.

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
npm run test:supabase
npm audit
```

`npm run lint` executa a checagem de tipos; não é uma análise ESLint. A suíte de regressão inicia um servidor de produção próprio na porta 3219, usa credenciais geradas e uma cópia temporária do catálogo e limpa os dados após o teste. Requer build prévio. Nunca a execute apontando para a loja de produção.

`test:supabase` usa uma simulação HTTP isolada do Supabase e um servidor Next em modo Vercel na porta 3221. Confere persistência após reinício, concorrência, publicação e privacidade das fotos, falha do backend e rejeição de chave pública. Não testa credenciais reais da hospedagem. Ambas as suítes isolam seus dados e não escrevem no banco de produção.

Veja `SECURITY_REVIEW.md` para as vulnerabilidades corrigidas e pendências externas.

## Identidade visual

O cabeçalho, rodapé, painel e favicon utilizam a marca original recortada das imagens fornecidas. A página inicial e o produto de caneca cerâmica usam fotos reais dessas referências; a seção de contato inclui a fachada. Os demais arquivos de demonstração ainda precisam ser substituídos por fotos aprovadas da empresa.

O layout usa rosa, fundos escuros, amarelo-lima e azul-ciano inspirados na referência https://www.brind.etc.br/, mantendo o dourado apenas na arte original da logo, títulos com maior hierarquia, ícones Lucide com traço uniforme e navegação adaptada para celular. Os dados de contato continuam editáveis nas configurações.
