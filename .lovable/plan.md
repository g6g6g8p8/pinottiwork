## Objetivo

Trazer Awards e Career Highlights para a home como sinais de credibilidade, sem duplicar o /about e mantendo o controle de ordem no markdown.

## Novos slots em `public/data/home-layout.md`

Dois slots novos, posicionáveis em qualquer linha:

```text
hero  | mary-kay-global-ecosystem
duo   | pink-news | fini-algorithmic-diagnostics
duo   | give-yourself-this-chance | the-reconquest
awards
hero  | mastercard-priceless-ecosystem
duo   | connecting-clients | alternative-investments
career-wall
```

- `awards` — faixa horizontal de troféus, sem slugs.
- `career-wall` — logo wall em escala de cinza, sem slugs.

Se você remover a linha, o bloco some. Pode reordenar livremente.

## Componentes novos

### `src/components/portfolio/AwardsStrip.tsx`
- Lê `about.awards` via `useAbout()`.
- Layout: faixa horizontal centralizada com header pequeno ("RECOGNITION") e 4 cards em linha (mobile: scroll horizontal com snap; desktop: grid 4 colunas).
- Cada card: ícone `Trophy` do lucide + texto do prêmio.
- Animação de entrada por scroll com `motion` + `useInView` (fade + y).
- Padding e tokens consistentes com `FeaturedProjects` (mesmo `gap-premium-md`).

### `src/components/portfolio/CareerWall.tsx`
- Lê `about.career_highlights` via `useAbout()`.
- Header pequeno ("WORKED AT") + grid responsivo de logos:
  - mobile: grid 4 colunas
  - desktop: linha única com 7 logos
- Logos em grayscale + opacity 60%, hover → cor cheia + opacity 100% (transição suave).
- Cada logo é um `<img>` quadrado com `aspect-square`, `object-contain`, fundo `bg-foreground/5`.
- Sem texto descritivo (esse fica no /about).

### `src/components/portfolio/SidebarAwards.tsx`
- Mini faixa de 4 ícones `Trophy` em linha, acima do avatar da sidebar.
- Cada um com `Tooltip` (radix) mostrando o nome do prêmio.
- Tamanho discreto (`size={14}`, opacity 50%, hover 100%).
- Sem labels — bônus visual, conteúdo principal continua na home.

## Integração

### `FeaturedProjects.tsx`
- O parser de `home-layout.md` já divide por `|`. Slots `awards` e `career-wall` chegam como `{ slot: 'awards', slugs: [] }`.
- Adicionar branches no `.map(layout)` para renderizar `<AwardsStrip />` e `<CareerWall />` quando o slot bater.
- Esses blocos **ignoram o filtro de categoria/busca** — só aparecem na visão default (mesma lógica do `isFiltered` atual).

### `Sidebar.tsx`
- Inserir `<SidebarAwards />` logo antes do bloco do avatar (depois do `flex-1`), só quando `isHome` for true.

## Detalhes técnicos

- **Sem mudança de dados**: tudo já existe em `about.awards` e `about.career_highlights` via `useAbout()`.
- **Sem novas deps**: `Trophy` já está disponível no lucide-react. Tooltip usa o radix-ui (verificar se já está instalado; se não, usar título nativo via `title=""`).
- **Acessibilidade**: cada logo do wall com `alt={company}`, troféus com `aria-label`.
- **SSR-safe**: `useAbout` já roda via server function, sem efeito colateral de window.
- **Performance**: logos com `loading="lazy"`. Animações com `whileInView` + `viewport={{ once: true }}` pra não re-disparar.

## Arquivos tocados

- `public/data/home-layout.md` — adicionar as duas linhas novas.
- `src/components/portfolio/AwardsStrip.tsx` — novo.
- `src/components/portfolio/CareerWall.tsx` — novo.
- `src/components/portfolio/SidebarAwards.tsx` — novo.
- `src/components/portfolio/FeaturedProjects.tsx` — renderizar os novos slots.
- `src/components/portfolio/Sidebar.tsx` — inserir mini troféus.

## QA

- Home desktop: ver awards entre a 3ª linha e o segundo hero, career wall no final, mini troféus na sidebar.
- Home mobile (viewport ~390px): awards em scroll horizontal com snap, career wall em grid 4 colunas.
- Filtrar por categoria → ambos os blocos somem.
- Buscar → ambos os blocos somem.
- /about continua igual, sem regressão.
