# Toggle project visibility via frontmatter

Hoje a única forma de tirar um projeto do site é apagar o `.md`. Vou adicionar um flag no frontmatter pra ligar/desligar projetos preservando o conteúdo.

## Como vai funcionar (lado do usuário)

No topo de qualquer `public/content/projects/*.md`:

```yaml
---
title: Mastercard Jazz
published: false   # <- some do site
# ou
draft: true        # <- mesmo efeito, alias amigável
---
```

Regras:
- **Default = publicado.** Arquivos existentes não precisam de mudança nenhuma.
- `published: false` **ou** `draft: true` → projeto fica oculto em: home, listas de categoria/cliente/role, sitemap, related projects, busca.
- A página direta `/projects/<slug>` retorna **404** quando despublicado (consistente com sitemap e SEO).
- Se um slug despublicado estiver referenciado em `public/data/home-layout.md`, ele é silenciosamente ignorado (linha do grid encolhe, sem quebrar layout).

## Mudanças técnicas (1 arquivo principal)

**`src/lib/content.functions.ts`**
- Estender `ProjectData` com `published: boolean`.
- Em `normalizeProject`: `published = raw.published !== false && raw.draft !== true` (default true; só fica false se explicitamente desligado).
- `listProjects` passa a filtrar `p.published` antes de retornar — assim home, listas, related, sitemap e busca herdam o filtro sem nenhuma outra alteração.
- `getProject` / `getProjectMeta`: retornam `null` quando `published === false`, fazendo o route loader cair no `notFoundComponent` natural.

Nada muda em componentes (`FeaturedProjects`, `ProjectList`, `RelatedProjects`, `sitemap[.]xml.ts`) — todos consomem `listProjects`/`getProject` e já vão receber só o que está publicado.

## Documentação

Adicionar uma nota curta em `public/content/README.md` explicando o flag, com exemplo:

```md
## Toggle a project on/off
Set `published: false` (or `draft: true`) in the frontmatter to hide a project
from the site without deleting the file. Default is published.
```

## Fora do escopo
- UI admin pra alternar com clique (pode vir depois; por enquanto é edição direta do `.md`, mesmo fluxo que você já usa).
- Agendamento (publish_at) — dá pra adicionar depois reusando o mesmo gate.
