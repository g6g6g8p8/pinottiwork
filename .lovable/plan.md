## Problema

A versão atual tenta mapear o progresso do scroll vertical para `scrollLeft` do carrossel, mas a seção tem altura pequena (≈ uma viewport ou menos), então o carrossel só "vê" o scroll por um intervalo curto e na prática nada se move de forma perceptível — em mobile ainda menos, porque a seção entra e sai do viewport quase instantaneamente.

## Solução

Trocar a abordagem por um **pin + horizontal scroll** clássico, que funciona igual em desktop e mobile:

1. Envelopar a seção `CareerWall` num **wrapper alto** (ex.: `height = 100vh + scrollDistance`, onde `scrollDistance ≈ scrollWidth − clientWidth`).
2. Dentro do wrapper, um container `sticky top-0 h-screen` (ou `h-[80vh]` para deixar respiro) que segura o carrossel fixo na tela enquanto o usuário rola.
3. Um listener de scroll calcula o progresso dentro do wrapper (0 → 1) e aplica em `scrollLeft` do trilho, igual à lógica atual mas agora com um range de scroll garantido e proporcional ao conteúdo.
4. Manter `requestAnimationFrame` para suavidade e respeitar `prefers-reduced-motion` (sem pin nesse caso, vira scroll horizontal manual normal).

Resultado: ao descer a página, o carrossel "gruda" e desliza lateralmente da primeira até a última card; depois o pin solta e a página continua. Comporta-se igual no mobile, sem depender de gesto lateral.

## Detalhes técnicos

- Arquivo: `src/components/portfolio/CareerWall.tsx` (única mudança).
- Estrutura JSX:
  ```
  <section ref={wrapperRef} style={{ height: pinHeight }}>
    <div className="sticky top-0 h-screen flex flex-col justify-center">
      <h3>CAREER HIGHLIGHTS</h3>
      <div ref={scrollerRef} className="flex gap-... overflow-hidden">
        {cards}
      </div>
    </div>
  </section>
  ```
- `pinHeight` calculado em `useLayoutEffect` a partir de `scrollerRef.current.scrollWidth − clientWidth + window.innerHeight`, recalculado em `resize`.
- Listener de scroll global: `progress = clamp((scrollY − wrapperTop) / (pinHeight − vh), 0, 1)` → `scroller.scrollLeft = progress * maxScroll`.
- `overflow-hidden` no trilho (em vez de `overflow-x-auto`) para o usuário não conseguir empurrar o scroll lateral manualmente e brigar com o pin; mantém `snap` desligado.
- Fallback `prefers-reduced-motion`: não pinar, voltar para `overflow-x-auto` com scroll-snap (comportamento antigo).
- Sem mudanças em outros componentes, estilos globais ou conteúdo.

## Fora de escopo

- Tamanhos dos logos dos prêmios (já ajustados antes).
- Estilo visual das cards.
