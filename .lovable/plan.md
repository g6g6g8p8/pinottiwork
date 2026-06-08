## Objetivo

Trazer de volta o comportamento de **pin + scroll horizontal** no `CareerWall`, agora funcionando de verdade tanto no mobile quanto no desktop:

- Quando a seção entra no viewport, ela "gruda" (pin).
- O scroll vertical da página é convertido em translação horizontal dos cards.
- A página só volta a rolar verticalmente quando o carrossel terminou de passar inteiro.

## Abordagem técnica

Reescrever `src/components/portfolio/CareerWall.tsx` usando Framer Motion (`useScroll` + `useTransform`) com o padrão clássico de pinned horizontal scroll:

```text
<section ref=sectionRef style={{ height: `${cards * 100}vh` }}>
  <div className="sticky top-0 h-screen overflow-hidden">
    <motion.div style={{ x }} className="flex h-full">
      {cards.map(card => <Card />)}
    </motion.div>
  </div>
</section>
```

Pontos-chave para funcionar de verdade:

1. **Altura da seção = N × altura do viewport** (proporcional ao número de cards). É isso que dá ao navegador "scroll vertical sobrando" para converter em horizontal — sem isso, não há pin perceptível.
2. **Filho `sticky top-0 h-screen`** dentro da seção: é o que cria o efeito de "tela travada".
3. **`useScroll({ target: sectionRef, offset: ['start start', 'end end'] })`** + `useTransform` mapeando `scrollYProgress` (0→1) para `x` (`0` → `-(trackWidth - viewportWidth)`).
4. **Medir `trackWidth` e `viewportWidth` com `ResizeObserver`** (refs em viewport e track) e recalcular em resize/orientação. Sem isso, mobile quebra porque a largura dos cards muda.
5. **Largura dos cards responsiva por viewport**, não por breakpoint Tailwind:
   - Mobile (`< 640px`): card com `min-w-[78vw]` (mostra ~1 card + peek do próximo).
   - `sm` a `lg`: `min-w-[48vw]` (~2 cards).
   - `lg+`: `min-w-[32vw]` (~3 cards).
   - Gap consistente com `gap-premium-md`.
6. **Respeitar `prefers-reduced-motion`** via `useReducedMotion()`: nesse caso, renderizar fallback com `overflow-x-auto` + `snap-x` (scroll horizontal manual, sem pin).
7. **Evitar flash inicial**: só aplicar a `height` calculada e o `x` depois que `viewportWidth` e `trackWidth` foram medidos (`mounted` flag); antes disso, renderizar estático para não dar "pulo".
8. **iOS Safari**: usar `height: 100svh` no sticky para evitar o jump da barra de endereço, e `touch-action: pan-y` no track para não engolir o gesto vertical fora da fase de pin.
9. **Acessibilidade**: manter `aria-label="Career highlights"`, `role="region"`, e adicionar texto visualmente escondido indicando "Scroll para ver mais" para leitores de tela.

## Visual dos cards

Manter exatamente como está hoje:
- `bg-card rounded-2xl p-6`, `aspect-[4/3]`, borda `border-foreground/5` com hover `border-foreground/15`.
- Logo 54×54, company (22/27, semibold), role (16/19, opacity 60), period (16/24, opacity 80).
- Título da seção `CAREER HIGHLIGHTS` no mesmo estilo atual.

## Fora de escopo

- Não tocar em `BottomTabBar`, `FeaturedProjects`, `Sidebar*`, `Home`, conteúdo dos highlights, `useAbout`, nem `content.functions.ts`.
- Sem mudanças no layout das outras seções da home.

## Arquivos

- `src/components/portfolio/CareerWall.tsx` — reescrita completa com pin + horizontal scroll.
- `.lovable/plan.md` — atualizar para refletir a nova abordagem (parallax pinned).

## Verificação após implementar

- Testar no preview em 390×744 (mobile) e em desktop: ao chegar na seção, a página trava, o carrossel desliza horizontalmente, e depois do último card a página volta a rolar.
- Conferir que não há "salto" no início do pin nem scroll trap se o usuário rolar pra cima.
