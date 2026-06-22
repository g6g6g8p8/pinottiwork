## Objetivo

Mesmo overlay tingido (amostrado da região `'bottom'` da imagem) em todo lugar que renderiza card de projeto: home, busca/filtros (categoria, cliente, role), relacionados dentro do modal e página de detalhe. Hoje só a home e a página de detalhe tingem — e ainda com regiões diferentes.

## Mudanças

1. **`src/components/portfolio/FeaturedProjects.tsx`** (home)
   - Linha 47: trocar `getImageColor(p.image_url, 'left')` por `getImageColor(p.image_url, 'bottom')`.

2. **`src/components/portfolio/ProjectList.tsx`** (rotas `/categories/...`, `/clients/...`, `/roles/...`)
   - Importar `getImageColor` de `../../lib/portfolio-utils`.
   - Adicionar `useState<Record<number,string>>` para `imageColors` e um `useEffect` que percorre `matches` e popula via `getImageColor(p.image_url, 'bottom')` (mesmo padrão do `FeaturedProjects`, com flag `cancelled`).
   - Substituir o `<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ...">` (linha 101) por um `<div className="absolute inset-0 pointer-events-none" style={{ background: imageColors[p.id] ? \`linear-gradient(to top, ${c}ee 0%, ${c}44 55%, transparent 100%)\` : 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }} />`.

3. **`src/components/portfolio/RelatedProjects.tsx`** (carrossel de relacionados dentro do modal)
   - Mesma mudança que `ProjectList`: extrair `imageColors` via `getImageColor(url, 'bottom')` e trocar o gradiente fixo da linha 46 pelo gradiente tingido com fallback preto idêntico.

4. **`src/components/portfolio/ProjectDetail.tsx`** — sem alteração; já usa `'bottom'` e o mesmo gradiente. Fica de referência visual.

## Resultado

O card do "Live de Batom por Elas" (e de todos os outros) usa exatamente o mesmo tom avermelhado em qualquer lugar do site: home, listagens filtradas, relacionados e na hero do modal de detalhe.
