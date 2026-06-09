## Goal
Os cards da faixa "CAREER HIGHLIGHTS" estão muito altos (aspect 4/3). Reduzir a altura pela metade, mantendo a largura e o layout horizontal com scroll.

## Mudança
Arquivo: `src/components/portfolio/CareerWall.tsx`

- Trocar `aspect-[4/3]` por `aspect-[8/3]` nos dois pontos (fallback de reduced motion + track principal), o que reduz a altura à metade mantendo a largura atual (`w-[78vw] sm:w-[48vw] lg:w-[32vw]`).
- Reduzir paddings/typografia internos do `Card` para caber bem na nova altura:
  - `p-6` → `p-4`
  - Logo `w-[54px] h-[54px]` → `w-10 h-10`
  - Título `text-[22px]/27px` → `text-[17px]/22px`
  - Subtítulo `text-[16px]/19px` → `text-[13px]/17px`
  - Período `text-[16px]/24px` → `text-[13px]/18px`
  - `mb-4` do header → `mb-2`

## Fora do escopo
Sem mudanças em dados, animação de scroll horizontal, ou outros componentes.
