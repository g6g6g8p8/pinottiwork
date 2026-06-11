## 1. Ícones distintos por categoria

Hoje em `src/lib/categories.ts` o mapa `CATEGORY_ICONS` só cobre alguns slugs; "Content", "Content System" e "Social Impact" caem no fallback `FileText` — por isso aparecem iguais.

Atualizar `CATEGORY_ICONS` com chaves para todas as categorias existentes nos projetos:

- `all` → LayoutGrid
- `branding` → Tag
- `advertising` → Megaphone
- `branded content` → Film
- `content` → FileText
- `content system` → LayoutPanelTop (ou Layers)
- `social impact` → HeartHandshake (ou Sparkles)
- `design` → Pen
- `digital` → Monitor
- `photography` → Camera

Resultado: cada item da sidebar e da bottom tab bar mobile fica com um ícone visualmente único.

## 2. Scroll lateral no mobile (bottom tab bar)

Em `src/components/portfolio/BottomTabBar.tsx` a barra usa `flex-1 min-w-0` + `truncate`, espremendo todos os botões na largura do telefone. Mudar para:

- container interno com `overflow-x-auto no-scrollbar` e `flex` (sem `w-full`);
- cada botão com largura natural (`shrink-0`, padding horizontal maior, sem `flex-1`);
- remover os apelidos abreviados (`Branded C.`, `Advertis.`, `Photo`) — com scroll dá pra mostrar o nome inteiro;
- manter o pill arredondado e o efeito de ativo.

Assim no mobile a barra rola horizontalmente quando há muitas categorias, sem cortar texto.

## 3. Traduzir cases PT → EN

Três arquivos em `public/content/projects/` têm corpo em português. Reescrever apenas o conteúdo em inglês, preservando frontmatter, embeds (`[video]`, `:::gallery`), créditos e estrutura de headings:

- `amazon-conta-com-a-gente.md` — The Challenge / Insight / The Campaign / Credits
- `mary-kay-guinness-record.md` — The Challenge / Insight / The Campaign / The Impact
- `mit-cada-km-mit-conta.md` — The Challenge / Insight / The Campaign / Credits

Títulos, slugs, nomes de campanhas próprias (ex.: "Conta com a gente", "Live de Batom por Elas", "Cada Km Mit Conta") e hashtags ficam como estão — só o texto descritivo vira inglês.

## Detalhes técnicos

- Arquivos editados: `src/lib/categories.ts`, `src/components/portfolio/BottomTabBar.tsx`, e os 3 markdowns acima.
- Sem mudanças de schema, rotas ou lógica de dados.
