# Limpeza de código não usado

Varri o codebase procurando arquivos importados em zero lugares. Separei em **3 grupos** por nível de risco — você decide quais aprovar.

---

## Grupo 1 — Remoção segura (zero impacto)

Arquivos sem nenhum import externo, puramente template/stub residual:

| Arquivo | Por quê remover |
|---|---|
| `src/lib/api/example.functions.ts` | Exemplo `getGreeting` do template TanStack. Nenhum import. |
| `src/lib/api/` (pasta) | Fica vazia após o item acima. |
| `src/lib/config.server.ts` | Só era usado pelo `example.functions.ts`. |
| `src/types/database.ts` | Arquivo só com `export {}` e um comentário. Zero imports. |
| `src/types/` (pasta) | Fica vazia. |
| `src/hooks/use-mobile.tsx` | `useIsMobile` não é importado em lugar nenhum. O `ProjectCard` tem uma versão local própria (inline). |

Verificado com `grep -rn` em todo `src/`.

---

## Grupo 2 — Doc de migração já concluída

| Arquivo | Por quê |
|---|---|
| `.lovable/plan.md` | Plano da migração JSON → Markdown que já foi executada. Conteúdo histórico. |

Posso remover, ou manter como registro. Padrão: **remover** (o histórico do chat já preserva).

---

## Grupo 3 — Pasta `src/components/ui/` inteira (shadcn) — **avaliar**

**Achado:** dos 46 componentes shadcn instalados, **nenhum é importado por código de aplicação** (`portfolio/`, `routes/`, `hooks/`, `lib/`). Os únicos imports que existem são internos da própria pasta `ui/` (ex.: `sidebar.tsx` importa `input`, `sheet`, etc.) — ou seja, é um grafo isolado, todo morto.

Verificado:
```text
grep -rn "components/ui" src/ | grep -v "^src/components/ui/"
→ (nada)
```

### Opção 3A — Remover toda a pasta `src/components/ui/` (46 arquivos)
**Prós:** ~3-4k linhas a menos, build mais leve, codebase reflete o que realmente é usado (você usa só componentes próprios em `components/portfolio/`).
**Contras:** se um dia quiser usar um componente shadcn, precisa rodar `npx shadcn add <nome>` de novo. Mas o `components.json` fica preservado — é trivial.
**Deps do `package.json`:** mantenho como estão nesta limpeza (radix, cmdk, sonner, vaul…). Limpar deps tem risco maior e dá pra fazer num passo seguinte se você quiser.

### Opção 3B — Manter a pasta `ui/` intacta
Caso prefira ter a "biblioteca" pronta caso queira testar algo rápido.

### Opção 3C — Remover só os claramente desnecessários, manter alguns "úteis em potencial"
Não recomendo: cria meio-termo sem critério objetivo. Ou tudo ou nada.

---

## Não vou mexer (verifiquei e estão em uso)

- `src/lib/error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts` → usados por `server.ts`, `start.ts`, `__root.tsx` (infra do template, importante).
- `src/lib/parseMarkdown.ts`, `portfolio-utils.ts`, `prefetch.ts`, `categories.ts` → usados pelos componentes do portfolio.
- Todos os componentes em `src/components/portfolio/` → usados.
- `public/llms.txt`, `public/robots.txt`, `public/content/README.md` → conteúdo público / doc de edição.

---

## O que preciso de você

1. **Grupo 1** — aprovo remover? (recomendação: sim)
2. **Grupo 2** (`.lovable/plan.md`) — remover ou manter?
3. **Grupo 3** — **3A (remover tudo de `ui/`)**, **3B (manter)**, ou outra?

Me responde com as escolhas e eu executo numa só leva.
