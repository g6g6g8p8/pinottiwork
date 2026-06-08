## Pendência

Apenas **1** dos 2 cases precisa de `og_image`:

- `mary-kay-guinness-record.md` — hero já é `.jpg`, o `resolveOgImage` em `projects.$slug.tsx` reusa o próprio hero como og:image. **Nada a fazer.**
- `give-yourself-this-chance.md` — hero é `.mov` (sem poster derivável agora que saímos do Cloudinary). Precisa de `og_image` explícito no frontmatter.

## Plano

1. Baixar o `.mov` do hero (`destaque_r29tx5.mov`) do CDN para `/tmp/`.
2. Extrair um frame com `ffmpeg` (~1s, JPG qualidade alta, mantendo proporção do vídeo).
3. Subir o JPG via `lovable-assets create` → `src/assets/cases/give-yourself-this-chance/destaque_poster.jpg.asset.json`.
4. Adicionar uma linha `og_image: '<url-do-cdn>'` no frontmatter de `give-yourself-this-chance.md`.
5. `bun run build` para validar.

## Comportamento no site

- **Hero da página**: continua sendo o vídeo `.mov` tocando em loop, igual hoje. Nada muda visualmente.
- **Compartilhamento (WhatsApp, Twitter, LinkedIn, Slack, etc.)**: passa a mostrar o frame extraído como preview, em vez de aparecer sem imagem.

O código já suporta isso: `resolveOgImage()` em `src/routes/projects.$slug.tsx` prioriza `meta.og_image` quando existe e cai no hero só como fallback.

## Fora de escopo

- Nenhuma mudança em componentes/código — `og_image` já é lido pelo `head()` do route.
- Outros cases — todos os demais heros são imagens estáticas e já funcionam como og:image.

## Entregáveis

- 1 `.asset.json` novo (poster JPG)
- 1 linha adicionada no frontmatter de `give-yourself-this-chance.md`
