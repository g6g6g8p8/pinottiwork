## Objetivo
Permitir uma linha com até 3 projetos lado a lado no desktop, configurável via `public/data/home-layout.md`.

## Mudanças

### 1. `src/components/portfolio/FeaturedProjects.tsx`
Adicionar handler para `row.slot === 'trio'`:
- Desktop (md+): `grid-cols-3` lado a lado
- Mobile: stack vertical (`grid-cols-1`), igual ao duo
- Mesmo `gap-premium-md md:gap-premium-lg`
- Cada card usa `forceAspect="card"` + `layout="below"` (consistente com duo)
- Stagger animation idêntica ao duo
- Se menos de 3 slugs forem fornecidos, renderiza só os que existirem (1 ou 2)

### 2. `public/data/home-layout.md`
Atualizar o comentário do header — já menciona `trio` mas com semântica antiga ("um destaque + dois menores"). Trocar por:
```
# trio — três projetos lado a lado no desktop (1/3 cada)
```
Sem mudar nenhuma linha ativa do layout atual.

## Como usar
```
trio | slug-1 | slug-2 | slug-3
```

## Fora de escopo
- Nenhuma mudança em `ProjectCard`, rotas, dados ou Cloud
- Sem alterar a ordem atual dos projetos na home (só habilita o slot)
