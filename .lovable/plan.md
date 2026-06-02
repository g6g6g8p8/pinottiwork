## Objetivo

Importar o site público do branch `static-v2` do repo `g6g6g8p8/project` (portfolio "Giulio Pinotti") para este projeto Lovable, fazendo as páginas Home, About e Projeto abrirem corretamente. O painel `/editor` e o Supabase ficam de fora.

## O que o repo original tem

- Stack: Vite + React 18 + `react-router-dom` + framer-motion + Tailwind v3 + react-helmet-async.
- Rotas públicas: `/`, `/about`, `/projects/:slug`.
- Conteúdo estático em `public/data/*.json` e `public/content/**/*.md` (convertido pra `.json` por um plugin Vite no build).
- Componentes públicos: `Sidebar`, `BottomTabBar`, `Home`, `About`, `ProjectDetail`, `FeaturedProjects`, `ProjectCard`, `SEO`, `Skeleton`, `Toast`, `Portal`.
- Hooks `useProjects`, `useProject`, `useAbout` (lêem os JSON estáticos).
- `SearchContext` para busca.

## Decisões já tomadas

- Escopo: somente site público (sem `/editor`, sem Supabase auth).
- Roteamento: rotas independentes (sem o overlay/modal animado sobre a Home — cada rota é uma página própria).
- Conteúdo: copiar os JSON/MD de `public/data` e `public/content` do repo como dados estáticos.

## Plano de execução

1. **Trazer os assets de conteúdo do repo**
   - Re-clonar o branch `static-v2` para `/tmp/repo`.
   - Copiar para este projeto:
     - `public/data/*` → `public/data/*`
     - `public/content/**` → `public/content/**` (incluindo os `.md` já convertidos pra `.json` que existem no repo; se algum projeto só tem `.md`, converto pra `.json` manualmente com um script único — sem plugin de build).
     - `public/_redirects` é descartado (irrelevante no host da Lovable).
   - Copiar imagens/assets de `src/assets` se houver.

2. **Trazer componentes e estilos**
   - Copiar `src/components/{Home,About,ProjectDetail,Sidebar,BottomTabBar,FeaturedProjects,ProjectCard,SEO,Skeleton,Toast,Portal}.tsx`, `src/context/SearchContext.tsx`, `src/hooks/{useProjects,useProject,useAbout}.ts`, `src/lib/{categories,parseMarkdown,prefetch,utils}.ts`, `src/types/*`.
   - Remover qualquer import de `AuthContext`, `editor/*`, Supabase, `react-helmet-async` (substituir por `head()` das rotas).
   - Trocar todos os imports de `react-router-dom` por equivalentes de `@tanstack/react-router` (`Link`, `useParams`, `useNavigate`, `useLocation`).
   - Os hooks `useProjects/useProject/useAbout` passam a fazer `fetch('/data/...')` ou `fetch('/content/...')` direto do `public/`.

3. **Tailwind v3 → v4 (template atual)**
   - O repo usa `tailwind.config.js` v3 com tema custom. Vou portar as cores, fontes, `borderRadius` e utilitários custom (incluindo `rounded-sf-2xl`, cores `editor-*` se usadas no público, etc.) para `src/styles.css` no formato `@theme inline` + `:root`/`.dark` oklch do template.
   - Manter `bootstrap-icons` via CDN no `head` da rota raiz (`__root.tsx`).
   - `framer-motion` já é compatível; instalo via `bun add framer-motion` se não estiver.

4. **Criar as rotas TanStack Start**
   - `src/routes/__root.tsx`: layout com `Sidebar` + `BottomTabBar` + `SearchProvider` + `<Outlet />`, e `head()` global com o `<link>` do bootstrap-icons e meta padrão.
   - `src/routes/index.tsx`: renderiza `<Home />`, com `head()` ("Giulio Pinotti, Creative Director").
   - `src/routes/about.tsx`: renderiza `<About />` como página normal (sem modal/backdrop), com `head()` próprio.
   - `src/routes/projects.$slug.tsx`: renderiza `<ProjectDetail />`, usando `Route.useParams()` para o slug; `head()` deriva do projeto (title, description, og:image).
   - Limpar o placeholder atual de `src/routes/index.tsx`.

5. **Ajustes funcionais necessários**
   - `Home.tsx`: hoje navega para `/about` e `/projects/:slug` esperando o overlay. Como agora são rotas próprias, troco os `Link` para `@tanstack/react-router` e removo qualquer dependência de `useLocation` que controlava o modal.
   - `About.tsx`: remover o botão "fechar modal" (ou trocar por `Link to="/"`).
   - `ProjectDetail.tsx`: igual — botão de voltar vira `Link to="/"`.
   - `SEO.tsx` (que usa `react-helmet-async`): remover; SEO passa a ser feito via `head()` em cada rota.

6. **Verificação**
   - Rodar o dev server, abrir `/`, `/about` e um `/projects/<slug>` existente, confirmar render sem erros no console e nas Network requests dos JSONs.

## Detalhes técnicos

- Não criar `src/pages/`, não usar `BrowserRouter`, não adicionar `react-router-dom`, não mexer em `src/routeTree.gen.ts` (regras do template TanStack Start).
- Não adicionar `public/_redirects`, `vercel.json` ou `netlify.toml` — o host da Lovable já cuida do SPA fallback do TanStack Start.
- Conteúdo em `public/` é servido como estático, então os `fetch('/data/projects.json')` funcionam em dev e build sem precisar do plugin Vite original. Os plugins de `sitemap.xml`, `robots.txt` e `llms.txt` do repo NÃO serão portados nesta passada (podem ser adicionados depois se você pedir).
- Pacotes que provavelmente preciso instalar: `framer-motion`, `clsx`. `gray-matter` NÃO entra (era só para o plugin de build).

## Fora de escopo (explícito)

- `/editor`, login, Supabase, CRUD de projetos.
- Animação de modal/overlay sobre a Home (substituída por rotas independentes).
- Plugins de build do repo original (sitemap/robots/llms.txt).
- `react-helmet-async` (substituído por `head()` das rotas).
