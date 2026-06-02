## Goal
No desktop (lg+), reproduzir o estilo da App Store na Home:
- **Hero (slot `hero`)**: mantém texto sobreposto sobre a imagem com gradient (como hoje).
- **Cards menores (slot `duo` e demais)**: imagem limpa (sem overlay/sem texto por cima); título, role, descrição e tags ficam **abaixo** da imagem.
- **Mobile**: continua como está hoje (texto sempre sobre a imagem) — a mudança é só `lg:` para cima.
- **Filtered grid** (busca/categoria): também usa o estilo "texto abaixo" no desktop, já que são todos cards pequenos.

## Mudanças

### 1. `src/components/portfolio/ProjectCard.tsx`
- Adicionar prop `layout?: 'overlay' | 'below'` (default `'overlay'`, comportamento atual).
- Quando `layout === 'below'`:
  - Renderizar a imagem dentro do bloco com `rounded-sf-xl` e sombra, **sem** o overlay de gradient e **sem** o bloco `glass-lg` de texto.
  - Abaixo da imagem, renderizar um bloco de texto com:
    - eyebrow (`role`) em `text-foreground/50` uppercase
    - `h2` título em `text-foreground`
    - descrição em `text-foreground/70`
    - tags com fundo `bg-foreground/10` em vez de `bg-white/20`
  - Hover lift (`y: -6`) e leve aumento da sombra continuam; manter `imageVariants` scale.
- No mobile (`isMobile`) forçar sempre `overlay` (mantém comportamento atual mesmo se `layout='below'` for passado).

### 2. `src/components/portfolio/FeaturedProjects.tsx`
- Passar `layout="below"` para os cards do slot `duo` e do fallback (não-hero).
- Hero continua sem `layout` (overlay).
- No grid filtrado, passar `layout="below"` também.

### 3. Sem mudanças em
- `home-layout.md`
- hooks, rotas, sidebar, mobile navbar.

## Detalhes técnicos
- A detecção mobile dentro do `ProjectCard` já existe via `useIsMobile` (<768px). A regra "App Store style só no desktop" se traduz como: `effectiveLayout = isMobile ? 'overlay' : layout`.
- Aspect ratio dos cards menores continua `aspect-[4/5]` (forceAspect="card"), igual hoje.
- Tags: usar os mesmos `[project.category, project.client]`, só trocando classes de cor para tema claro/escuro neutro.
- Tipografia: reutilizar `text-sf-title-3` para título e `text-sf-body` para descrição, apenas trocando as classes de cor de `text-white*` para `text-foreground*`.