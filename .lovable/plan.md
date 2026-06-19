## Objetivo

Hoje o selo do Guinness World Records só aparece no `ProjectCard` da home. Quero que ele acompanhe o projeto "Live de Batom por Elas" (slug `mary-kay-guinness-record`) em todos os lugares onde o card/imagem do projeto aparece no site.

## Onde adicionar o selo

1. **Páginas de filtro** (`/categories/:category`, `/clients/:client`, `/roles/:role`)
   - Arquivo: `src/components/portfolio/ProjectList.tsx`
   - Adicionar o selo sobreposto na thumbnail (canto superior direito) quando `p.slug === 'mary-kay-guinness-record'`.

2. **Página do projeto** (`/projects/mary-kay-guinness-record`)
   - Arquivo: `src/components/portfolio/ProjectDetail.tsx`
   - Adicionar o selo sobreposto na imagem/vídeo de hero, em tamanho maior (proporcional ao hero), no canto superior direito, quando `slug === 'mary-kay-guinness-record'`.

3. **Projetos relacionados** (mini cards no rodapé da página de projeto)
   - Arquivo: `src/components/portfolio/RelatedProjects.tsx`
   - Adicionar o selo sobreposto nos mini cards quando `project.slug === 'mary-kay-guinness-record'`.

## Padrão visual (reutilizar o que já existe em `ProjectCard.tsx`)

- Imagem importada de `src/assets/awards/guinness.png.asset.json`.
- Posição absoluta: `top-3 right-3 md:top-4 md:right-4`, `z-30`, `rounded-full`, `pointer-events-none`.
- Fundo branco + sombra/anel para destacar sobre qualquer imagem:
  `boxShadow: '0 4px 14px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.9)'`, `background: 'white'`.
- Tamanhos por contexto:
  - `ProjectList` cards: `w-12 h-12 md:w-16 md:h-16` (mesmo do home).
  - `RelatedProjects` mini cards (menores): `w-10 h-10 md:w-12 md:h-12`.
  - `ProjectDetail` hero (maior): `w-20 h-20 md:w-28 md:h-28`, com `top-4 right-4 md:top-6 md:right-6`.
- Animação opcional sutil (mesma do home) só na home; nas outras telas o selo entra estático para não competir com a leitura.

## Resultado esperado

Onde quer que o card/imagem do projeto Live de Batom por Elas apareça — home, busca, filtros por categoria/cliente/role, página do projeto e bloco de relacionados —, o selo do Guinness aparece no canto superior direito da imagem, com o mesmo tratamento visual.
