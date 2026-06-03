Adicionar um "scroll hint" no `CareerWall.tsx`: quando a seção entra no viewport pela primeira vez, o container horizontal faz um pequeno empurrão lateral (≈40–60px para a direita e volta) usando `scrollTo` com `behavior: 'smooth'`, em ~600ms total, indicando que há mais conteúdo para o lado.

Implementação:
- `useRef` no container `div.overflow-x-auto`.
- `IntersectionObserver` dispara uma única vez quando ≥50% da seção está visível.
- Sequência: `scrollTo({ left: 60, behavior: 'smooth' })` → após 350ms `scrollTo({ left: 0, behavior: 'smooth' })`.
- Respeita `prefers-reduced-motion`: se reduzido, não anima.
- Só roda no client (checa `window`).

Sem novas dependências. Arquivo alterado: `src/components/portfolio/CareerWall.tsx`.