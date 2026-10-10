# Revisão de segurança e funcionamento — 10/10/2026

## Corrigido no código

1. **Credenciais públicas e padrão:** removidos senha administrativa, segredo JWT e conexão de banco do exemplo. Excluído o cliente Supabase sem referências. Login falha fechado sem configuração válida. Remover valores do código não invalida o que já foi exposto.
2. **Sessões:** substituído JWT manual por verificação de HS256, emissor, audiência, validade e identificador. Comparação da senha em tempo constante; rotação da senha invalida tokens. Cookies malformados não provocam erro 500.
3. **CSRF e login automatizado:** origem exata obrigatória em mutações, inclusive login e logout; limitação de tentativas no processo.
4. **Rascunhos:** GET por ID não devolve produtos ocultos a visitantes. Novos produtos da API são ocultos por padrão.
5. **Uploads ativos e extensão controlada:** recusado SVG, MIME conferido contra conteúdo decodificado, limite de bytes/pixels, sem animação e saída WebP com UUID. O nome do arquivo original não determina extensão ou caminho.
6. **Dados inválidos:** esquemas para produtos e coleções, preços e quantidades válidos, IDs únicos, slugs sem duplicação, identidade e data de criação imutáveis, mensagens 400/409/413/415 adequadas. Preço opcional pode ser removido com null.
7. **XSS:** JSON-LD escapa `<`, impedindo fechamento do script por dados do produto. Links inválidos e imagens remotas arbitrárias não podem ser cadastrados.
8. **Cache e cabeçalhos:** APIs/painel sem cache compartilhado; nosniff, anti-frame, referrer e restrições básicas de CSP. Otimizador de imagens sem wildcard de hosts remotos.
9. **Persistência:** arquivo corrompido não provoca retorno silencioso a dados iniciais. Escritas na Vercel são recusadas enquanto não houver persistência real.
10. **Funcionamento:** contatos editados propagam para componentes públicos e mensagens de orçamento; sitemap dinâmico; campanhas não mostram falso sucesso; lista local inválida é filtrada; removidas ofertas de preço zero/estoque fictício do schema de produto. Lookup de ícones restrito elimina carregamento de toda a biblioteca e valores arbitrários de componente.
11. **Dependências:** Next.js fixado na versão 15.5.27, PostCSS corrigido via override e lockfile versionado. Auditoria após instalação sem vulnerabilidades reportadas.

## Ação externa necessária

**Trocar a senha do banco associado à conexão anteriormente exposta no `.env.example`.** Considerar a credencial comprometida, pois está no histórico público. Não copiar novamente o valor para arquivos, issues ou comentários. Revise acessos e atualize aplicações que usem essa senha. Esta revisão não efetuou a rotação nem consultou o banco remoto.

Defina novas credenciais administrativas e `APP_ORIGIN` no ambiente de hospedagem. Tokens que utilizavam as constantes antigas serão rejeitados. Não há segredo de exemplo reutilizável.

## Limitações concretas

- Persistência ainda é JSON/disco, sem migração de banco. Vercel precisa de banco e storage antes de permitir manutenção do catálogo.
- RLS e permissões do Supabase remoto não foram auditadas: a aplicação não usa esse banco e nenhuma credencial de administração foi disponibilizada.
- Logout encerra a sessão do navegador, sem lista persistente de revogação de tokens roubados. Para revogação individual imediata, implementar sessões em banco; hoje use rotação de senha/segredo.
- Rate limit não é distribuído. No servidor atual é por processo; reinício zera o contador.
- Formulários completos de categorias, ocasiões, galeria e FAQs ainda não existem na interface, apesar de haver APIs.
- Fotos, logo vetorial e itens demonstrativos não foram verificados como material original da loja. Confirmar antes de publicar como portfólio real.

## Validação

Build de produção aprovado, checagem de tipos aprovada e 67 testes HTTP de segurança/funcionamento aprovados. npm audit não reportou vulnerabilidades. Verificação com Playwright aprovada em 360, 390 e 1280 px nas páginas inicial, catálogo, contato e orçamento, sem rolagem horizontal. Fluxos de adicionar orçamento, persistência, recuperação de carrinho inválido, login e cadastro administrativo passaram sem erros de JavaScript. Capturas da página inicial em celular e desktop foram inspecionadas. A suíte usa dados isolados e não altera o catálogo de produção. Não afirmar que o banco remoto ou a implantação foram corrigidos com base em testes locais.
