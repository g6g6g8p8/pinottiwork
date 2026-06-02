## Objetivo
No overlay do `ProjectCard` (hero no desktop + todos os cards no mobile), mover o texto sobreposto para a **esquerda** (não ocupar a largura toda) e suavizar o fundo de leitura, inspirado no print da App Store.

## Mudanças

### `src/components/portfolio/ProjectCard.tsx` — bloco `effectiveLayout === 'overlay'`

1. **Gradient overlay**: trocar o gradient de baixo→topo por um gradient da **esquerda→direita** mais suave, garantindo legibilidade do lado esquerdo sem escurecer a imagem inteira. Usar `imageColor` com opacidade menor (ex: `${imageColor}99` à esquerda → `transparent` ~60% para a direita), fallback preto similar.

2. **Bloco de texto**:
   - Reposicionar: sair de `inset-x-0 bottom-0` (largura total, ancorado embaixo) para ancorado à **esquerda e topo** (`top-0 left-0`), com `max-w-[60%]` no desktop hero e `max-w-[75%]` no mobile.
   - Remover a classe `glass-lg` (fundo muito marcado) — deixar só o gradient como fundo de leitura. Manter padding generoso (`p-premium-lg`).
   - Manter eyebrow (role), título, descrição e tags, com cores `text-white*` como hoje.

3. **Sem mudanças** no layout `'below'` (desktop cards menores) — continua igual.

## Detalhes técnicos
- `effectiveLayout = isMobile ? 'overlay' : layout` continua igual, então a mudança vale para: mobile (todos os cards) + desktop hero.
- Tags continuam com `bg-white/20 backdrop-blur-sm` (já suaves).
- Sem mexer em `FeaturedProjects.tsx`, grid, ou aspect ratios.
