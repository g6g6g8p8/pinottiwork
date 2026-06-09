## Objetivo

Substituir o grid de thumbnails do dropdown de busca (Sidebar desktop) por uma **lista de texto com autocomplete inteligente** que reage conforme o usuário digita.

## Comportamento

**Estado vazio (input focado, sem texto):**
- Título "Suggestions"
- Lista com 5–6 termos populares derivados do conteúdo: títulos de projetos em destaque + nomes de clientes recorrentes + categorias. Cada item mostra um pequeno rótulo à direita (`Project`, `Client`, `Category`).

**Digitando:**
- Constrói um índice de tokens a partir de todos os projetos: `title`, `client`, `category`, `tags` (quando existir).
- Faz match por **prefixo primeiro, depois substring** (case-insensitive, sem acento).
- Exibe até 8 sugestões, ordenadas: prefixo > substring; dentro do mesmo nível, Projects antes de Clients/Categories.
- Cada linha mostra:
  - Texto da sugestão com o trecho digitado em **negrito** (highlight).
  - Rótulo discreto à direita: `Project` · `Client` · `Category`.
  - Em projetos, subtítulo cinza com `client — category`.
- Mensagem "No matches" quando vazio.

**Interação:**
- Click / Enter em **Project** → navega para `/projects/$slug`.
- Click / Enter em **Client** ou **Category** → preenche `searchQuery` com o termo (e, se Category, também aplica `setSelectedCategory`) para filtrar a home.
- Setas ↑/↓ para mover, Enter para confirmar, Esc para fechar (já existe).
- `Cmd/Ctrl+K` continua focando o input.

## Escopo de arquivos

- **`src/components/portfolio/Sidebar.tsx`** — única alteração. Remover o grid de thumbnails (`displayItems`, `imageColors`, `getImageColor` no efeito de cores das sugestões) e renderizar a nova lista textual com índice em memória + highlight.
- Sem mudanças em rotas, contexto, dados ou backend.
- Sem mudanças no `BottomTabBar` (mobile mantém chips de categorias como hoje) — confirme se também quer reformular o mobile.

## Detalhes técnicos

- Índice construído com `useMemo` sobre `projects`: `{ label, type: 'project'|'client'|'category', slug?, normalized }`. Deduplicado por `(type,label)`.
- Normalização: `label.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'')`.
- Highlight: split do label pelo índice do match e render do trecho em `<strong>`.
- Navegação por teclado: índice ativo em `useState`, handlers no `onKeyDown` do input.
- Acessibilidade: `role="listbox"` no dropdown, `role="option"` + `aria-selected` nos itens, `aria-activedescendant` no input.

## Fora de escopo

- Mobile (BottomTabBar) — manter como está, salvo pedido contrário.
- Mudanças visuais em outros componentes ou no layout do dropdown além do conteúdo.