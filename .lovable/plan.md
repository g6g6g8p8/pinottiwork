## Por que Lovable Assets

O projeto já tem o **Lovable Assets** ativo — um CDN próprio (Cloudflare R2) que vem grátis com o Lovable, sem conta externa, sem dashboard de billing, sem limite de crédito como o Cloudinary. URLs imutáveis no formato `/__l5e/assets-v1/{asset_id}/{arquivo}`, servidas com cache global. Aceita imagens (PNG/JPG/GIF/WebP), vídeos (MP4/MOV/WebM) e mais — exatamente o que seus cases usam.

## Escopo da migração

8 arquivos markdown usam Cloudinary, totalizando ~45 URLs (imagens + vídeos):

- `public/content/career-highlights.md` (7 logos)
- `public/content/projects/fini-algorithmic-diagnostics.md`
- `public/content/projects/mary-kay-guinness-record.md`
- `public/content/projects/give-yourself-this-chance.md`
- `public/content/projects/mastercard-priceless-ecosystem.md`
- `public/content/projects/mary-kay-global-ecosystem.md`
- `public/content/projects/connecting-clients.md`
- `public/content/README.md` (só ajuste de instrução)

Observação: o domínio `dktild7hr.cloudinary.com` ainda serve os arquivos enquanto o plano está estourado (o bloqueio é só para *novos uploads/transformações* e largura de banda — pode haver throttling). Vamos migrar tudo agora pra não depender disso.

## O que vou fazer

### 1. Migrar os assets atuais
Para cada URL Cloudinary encontrada:
1. Baixar o arquivo via `curl` para `/tmp/`.
2. Subir para o CDN com `lovable-assets create --file /tmp/<arquivo> --filename <nome-original>` e gravar o `.asset.json` em `src/assets/cases/<projeto>/<arquivo>.asset.json`.
3. Substituir a URL Cloudinary pela nova URL CDN (`/__l5e/assets-v1/.../arquivo.ext`) no `.md` correspondente — preservando a sintaxe atual (`hero:`, `![](...)`, `[video autoplay](...)`).

Os `.md` continuam funcionando como hoje (o `content.functions.ts` lê o frontmatter e o `parseMarkdown` consome as URLs como strings — não muda código).

### 2. Atualizar a documentação interna
- `public/content/README.md`: trocar a recomendação de "use Cloudinary/Imgur" pelo fluxo Lovable Assets.
- `.lovable/plan.md`: registrar a mudança de provedor.

### 3. Documentar o fluxo "manual" para novos cases
No `README.md` de `public/content/`, adicionar uma seção curta **"Subindo mídia para um novo case"** com os comandos exatos pra você rodar via chat comigo (eu executo no sandbox) ou copiar localmente:

```bash
# 1. Você me manda o arquivo no chat (anexo) → fica em /mnt/user-uploads/
# 2. Eu rodo:
mkdir -p src/assets/cases/<slug-do-projeto>
lovable-assets create \
  --file /mnt/user-uploads/<arquivo> \
  --filename <arquivo> \
  > src/assets/cases/<slug-do-projeto>/<arquivo>.asset.json

# 3. Leio o campo "url" do JSON e colo no .md do case:
#    hero: 'https://<dominio>/__l5e/assets-v1/<uuid>/<arquivo>'
#    ![](https://<dominio>/__l5e/assets-v1/<uuid>/<arquivo>)
```

Na prática, o fluxo para você é: **"toma esses arquivos do case X, atualiza os .md"** — eu cuido do upload + edição.

## Fora de escopo

- Não vou mexer em `Sidebar`, `Home`, `CareerWall`, server functions, layout ou estilos.
- Não vou remover/desativar a conta Cloudinary (você decide depois — as URLs antigas podem continuar existindo lá sem custo se você não passar do free; só não vamos referenciá-las mais).
- Não vou criar UI de upload (você pediu só o comando).

## Riscos / pontos de atenção

- **Vídeos grandes**: alguns `.mp4/.mov` podem passar de dezenas de MB. O CDN aceita, mas o download via `curl` na máquina do sandbox pode demorar. Se algum arquivo falhar (timeout/banda Cloudinary), eu paro, listo os pendentes e seguimos com eles depois.
- **Posters de vídeo (`og:image`)**: `src/routes/projects.$slug.tsx` deriva o poster trocando `/video/upload/` por `/image/upload/` no domínio Cloudinary. Após migrar, esses vídeos não terão poster automático — vou adicionar suporte a um campo opcional `og_image:` no frontmatter (já existe no tipo `ProjectData`) e setar para os casos com vídeo como hero (Guinness, Give Yourself This Chance). Sem mudança de comportamento para os que já têm imagem como hero.
- **Cache do browser**: as URLs novas são diferentes, então quem já visitou o site vai baixar de novo. Sem problema.

## Entregáveis

- ~45 arquivos `.asset.json` em `src/assets/cases/<slug>/`
- 8 `.md` atualizados com URLs do CDN Lovable
- `public/content/README.md` com o novo fluxo documentado
- Build verde (`bun run build`) ao final
