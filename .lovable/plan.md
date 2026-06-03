## Problema

Hoje `src/routes/projects.$slug.tsx` já gera `og:title` e `og:description` por projeto, mas:

1. A maioria dos `hero` é vídeo (`.mp4`/`.mov`) — o código pula `og:image` nesse caso, então WhatsApp/X/LinkedIn caem no preview default do site.
2. `SITE` aponta para `pinottiwork.lovable.app`, mas o domínio canônico é `pinotti.work` (usado no sitemap/head meta). Isso quebra `og:url` e canonical.
3. Não há campo dedicado para uma imagem de share quando o autor quiser sobrescrever o hero.

## Mudanças

### 1. `public/content/projects/*.md` (opcional, por projeto)
Suportar um campo de frontmatter novo: `og_image: <url>`. Quando presente, usado direto como `og:image`/`twitter:image`. Não obrigatório — só documento no README.

### 2. `src/lib/content.functions.ts`
- Adicionar `og_image?: string` em `ProjectMeta` e `normalizeProject`/`getProjectMeta` retornarem o valor (quando existir).

### 3. `src/routes/projects.$slug.tsx`
- Trocar `SITE` para `https://pinotti.work`.
- Nova função `resolveOgImage(meta)`:
  - Se `meta.og_image` → usa.
  - Senão se `meta.hero` é imagem → usa `meta.hero`.
  - Senão se `meta.hero` é vídeo imgur (`i.imgur.com/<id>.mp4`) ou Cloudinary (`res.cloudinary.com/.../video/upload/...mp4|mov`) → deriva poster trocando extensão para `.jpg` (ambos provedores servem thumbnail nesse padrão).
  - Senão → omite (cai no default do site).
- Sempre que houver imagem resolvida, emitir `og:image`, `og:image:alt` (= título), `twitter:card: summary_large_image`, `twitter:image`.
- Atualizar `image` no JSON-LD para a mesma URL resolvida.

### 4. `public/content/README.md`
- Documentar `og_image` como opcional (1-2 linhas).

## Verificação

- `curl -s https://pinotti.work/projects/mary-kay-guinness-record | grep -E 'og:(title|description|image|url)'` deve mostrar dados do projeto.
- Testar com validador do LinkedIn/X para 1 projeto com hero de vídeo (imgur) e 1 com hero de imagem.

Sem mudanças em UI/comportamento do app — só metadados de SSR.