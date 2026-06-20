## Problema

No mobile da página `/projects/mary-kay-guinness-record`, o selo do Guinness está no canto superior direito do hero e fica embaixo do botão "fechar" (X fixo no topo direito).

## Ajuste

No `src/components/portfolio/ProjectDetail.tsx`, mover o selo para o canto esquerdo no mobile e manter no direito no desktop:

- Mudar classes de posição de `top-4 right-4 md:top-6 md:right-6` para `top-4 left-4 md:top-6 md:right-6 md:left-auto`.

Tamanhos e estilo permanecem iguais.
