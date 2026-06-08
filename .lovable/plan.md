## Diagnóstico

Confirmei no preview: o carrossel até está rolando lateralmente conforme a página desce, mas a seção **não está pinando** — ela renderiza com a altura do conteúdo natural (curta), então o auto-scroll horizontal completo acontece em pouquíssimos pixels de scroll vertical, e logo abaixo já aparecem outros projetos. Visualmente parece "não funcionar".

A causa é que a estratégia atual depende de `scrollLeft` + `useLayoutEffect` para definir `height` da `section`, e em alguns momentos (hidratação SSR, ordem de efeitos, ResizeObserver) o `pinHeight` não é aplicado a tempo. Sem altura extra na seção, não há range vertical para o pin segurar.

## Solução (refatoração)

Reescrever `CareerWall.tsx` usando o pattern canônico de **scroll horizontal pinado com transform**, baseado em Framer Motion `useScroll` + `useTransform`. Vantagens: zero dependência de medir/aplicar `scrollLeft`, comportamento idêntico em desktop e mobile, sem hydration mismatch.

Estrutura:

```
<section ref={targetRef} style={{ height: `${cardsCount * 90}vh` }}>
  <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
    <h3>CAREER HIGHLIGHTS</h3>
    <motion.div style={{ x }} className="flex gap-... will-change-transform">
      {cards}
    </motion.div>
  </div>
</section>
```

- `useScroll({ target: targetRef, offset: ['start start', 'end end'] })` → `scrollYProgress` de 0→1 enquanto a seção atravessa o viewport pinado.
- `x = useTransform(scrollYProgress, [0, 1], ['0%', '-X%'])` onde X é calculado a partir do número de cards (ex.: `((cards - 1) * 320 + gaps - viewportWidth) / trackWidth * 100`). Mais simples: usar valores em px medidos via `useMeasure` ou aproximar com `-(cardsCount * 340 - vw)`. Vou medir o track real com `useLayoutEffect` em uma ref do track e do viewport, recalcular em resize.
- Altura da seção fixa em `(cardsCount * 80vh)` ou `100vh + trackWidth - viewportWidth` (px), aplicada via inline style; usar um valor `null` durante SSR (renderiza altura mínima) e atualizar pós-mount sem causar hydration mismatch (a `<section>` recebe `style` apenas no client após `useEffect`, evitando warning ao deixar atributo ausente no markup SSR e adicioná-lo via efeito).
- Sticky `top-0 h-screen overflow-hidden` garante pin durante todo o range vertical.
- `prefers-reduced-motion`: fallback para scroll horizontal manual (overflow-x-auto, snap), sem pin.

Vou também:
- Confirmar que nenhum ancestral entre `<section>` e `<body>` introduz `overflow:hidden` (já verificado: não há). Sticky funciona.
- Não tocar em `BottomTabBar`, `FeaturedProjects` ou outros componentes (os warnings de hydration e keys que apareceram no console são pré-existentes e não relacionados).

## Arquivos

- `src/components/portfolio/CareerWall.tsx` — reescrever inteiro com o pattern acima.

## Fora de escopo

- Hydration warning de `BottomTabBar`.
- Warning de keys em `FeaturedProjects` (cards usam `key={p.id}`, o warning é em outro caminho — investigar em ticket próprio se persistir).
