
# Migração para Markdown puro

Objetivo: um único arquivo `.md` por projeto (e um pro about). Some o `.json` paralelo e o `projects.json` index — tudo é derivado da pasta em runtime.

## Como vai ficar editar

**Adicionar projeto novo:** criar `public/content/projects/novo-projeto.md`:

```markdown
---
title: Novo Projeto
slug: novo-projeto
client: Cliente X
role: Creative Director
category: Branding
order: 5
hero: https://i.imgur.com/xxx.png
aspect_ratio: 4:3
description: Resumo curto que aparece no card.
tags: []
---

Conteúdo em markdown normal.

:::gallery
![](https://...mp4)
![](https://...jpg)
:::

[video](https://player.vimeo.com/video/123 "Legenda")
```

Salvou → site atualiza. Sem editar mais nenhum outro arquivo.

**Reordenar home:** continua editando só `public/data/home-layout.md` (não muda).

**Editar metadados/conteúdo:** abre o `.md`, edita o frontmatter ou o corpo. Sem JSON escapado, sem `\n`, sem aspas escapadas.

**Onde edita:** VS Code local, ou direto no GitHub web UI (commit pelo navegador, deploy automático).

## Estrutura final

```text
public/content/
  about.md                          ← um arquivo só (frontmatter + bio)
  career-highlights.md              ← um arquivo, lista no frontmatter
  projects/
    pink-news.md                    ← um arquivo por projeto
    mary-kay-global-ecosystem.md
    ...
public/data/
  home-layout.md                    ← mantém igual
```

Some: `public/content/projects/*.json`, `public/content/about.json`, `public/data/projects.json`, `public/data/career-highlights.json`, `public/data/projects-content/`.

## Detalhes técnicos

1. **Server functions novas** em `src/lib/content.functions.ts`:
   - `listProjects()` — lê `public/content/projects/`, parseia frontmatter de cada `.md`, retorna array ordenado por `order`. Substitui `projects.json`.
   - `getProject(slug)` — lê um `.md`, retorna `{ data, content }`. Substitui o fetch atual de `/content/projects/<slug>.json`.
   - `getAbout()` — lê `about.md` + `career-highlights.md`.
   - Reutilizar/adaptar `getAllProjectSlugs` e `getProjectMeta` que já existem em `src/lib/project-meta.functions.ts` (consolidar tudo num arquivo só).

2. **Parser de frontmatter:** instalar `gray-matter` (padrão da indústria, pequeno, sem deps nativas — seguro pro runtime do Worker).

3. **Atualizar hooks** `useProjects`, `useProject`, `useAbout` pra chamar as server functions via `useServerFn` + `useQuery` (em vez de `fetch` direto pros arquivos estáticos). Mantém a mesma forma dos dados retornados — zero mudança nos componentes.

4. **Script de migração** (one-shot, depois deleto): lê os `.json` atuais, gera os `.md` consolidados, valida que o conteúdo bate, remove os `.json` e o `projects.json`.

5. **Sitemap e SEO:** `src/routes/sitemap[.]xml.ts` e `getProjectMeta` continuam funcionando — só trocam a fonte de leitura.

6. **Validação leve:** a server function `listProjects` ignora arquivos sem `slug` no frontmatter e loga warning, em vez de quebrar o site se um `.md` estiver malformado.

## Não muda

- Layout/visual da home, cards, project detail — nada.
- `home-layout.md` — fica igual.
- Markdown extensions atuais (`:::gallery`, `[video](...)`) — o parser em `src/lib/parseMarkdown.ts` continua igual.
- URLs de mídia externas (imgur/cloudinary/vimeo) — sem mudança.

## Entregáveis

- `src/lib/content.functions.ts` consolidado
- `gray-matter` instalado
- Hooks `useProjects`/`useProject`/`useAbout` atualizados
- `public/content/projects/*.md` regenerados com frontmatter completo
- `public/content/about.md` consolidado
- `public/content/career-highlights.md` novo
- Arquivos antigos removidos
- README curto em `public/content/README.md` explicando o formato pra você consultar depois

## Riscos

- Pequeno: se um `.md` tiver YAML inválido, esse projeto somem da listagem (log no console do server). Mitigação: validação no script de migração.
- O `home-layout.md` referencia slugs — se você renomear um `.md`, o slug muda e a home quebra naquela linha. Mitigação: mantenho os slugs atuais idênticos na migração.
