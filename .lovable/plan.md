## Mudança

Substituir o `CareerWall` atual (pin + scroll horizontal com Framer Motion `useScroll`/`useTransform`) por um layout vertical clean com **reveal on-scroll**: cada card entra com fade + leve translateY quando aparece no viewport. Sem sequestrar scroll, sem medir larguras, funciona igual em desktop e mobile.

## Implementação

Reescrever `src/components/portfolio/CareerWall.tsx`:

- Layout: grid vertical responsivo
  - Mobile: 1 coluna
  - `sm`: 2 colunas
  - `lg`: 3 colunas
  - gap usando os tokens já existentes (`gap-premium-md`)
- Cada card mantém o visual atual (logo 54px + company + role + period, `aspect-[4/3]`, `rounded-2xl`, borda sutil com hover).
- Reveal por card usando Framer Motion `motion.div` + `whileInView`:
  - `initial={{ opacity: 0, y: 16 }}`
  - `whileInView={{ opacity: 1, y: 0 }}`
  - `viewport={{ once: true, amount: 0.3 }}`
  - `transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}` (stagger leve por ordem visual)
- Respeitar `prefers-reduced-motion`: se o usuário preferir movimento reduzido, renderizar sem `motion` (estático, sem animação) — usar `useReducedMotion()` do framer-motion.
- Manter o título `CAREER HIGHLIGHTS` no mesmo estilo atual.
- Remover tudo relacionado ao pin: `sectionRef`/`viewportRef`/`trackRef`, `useScroll`, `useTransform`, `useMotionValue`, cálculo de `distance`, `ResizeObserver`, `sectionStyle`, `mounted`, e o fallback `overflow-x-auto`.

## Fora de escopo

- Não tocar em `BottomTabBar`, `FeaturedProjects`, `Sidebar*`, conteúdo dos highlights, ou `useAbout`.
- Warnings de hydration/keys pré-existentes em outros componentes.

## Arquivos

- `src/components/portfolio/CareerWall.tsx` — reescrever inteiro.
- `.lovable/plan.md` — atualizar com a nova abordagem.
