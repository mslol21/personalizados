# Continuidade — Criativo Artes Personalizados

Revisão de 10/10/2026: veja README.md para configuração e SECURITY_REVIEW.md para correções e limitações. Esses documentos substituem as afirmações anteriores de senha padrão, upload seguro de SVG e painel integralmente editável.

Rotas públicas: `/`, `/catalogo`, `/catalogo/[slug]`, `/empresas`, `/trabalhos`, `/contato`, `/orcamento`.
Painel: `/admin/login` e `/admin`.
APIs: produtos, categorias, ocasiões, serviços, galeria, FAQs, campanhas, configurações, upload e sessão administrativa.

Camadas importantes:
- `src/lib/auth.ts`: configuração obrigatória e validação de sessão/origem.
- `src/lib/api.ts`: erros HTTP e leitura limitada do corpo.
- `src/lib/validation.ts`: esquemas de entrada e coleções.
- `src/lib/storage.ts`: persistência JSON, validação antes de salvar e restrição serverless.
- `src/lib/settings-context.tsx`: contatos públicos editáveis.
- `src/app/api/upload/route.ts`: decodificação e conversão de imagens.
- `scripts/security-tests.mjs`: regressões HTTP em servidor e catálogo isolados.

Prioridades restantes: rotacionar a senha de banco exposta; implementar persistência compartilhada se hospedado na Vercel; completar formulários administrativos; usar os arquivos originais da marca e produtos; confirmar dados comerciais. A integração Supabase sem uso foi removida; não presumir que variáveis de banco sozinhas integram o sistema.
