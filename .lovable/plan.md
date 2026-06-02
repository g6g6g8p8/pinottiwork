## Mudanças em `src/components/portfolio/ProjectCard.tsx`

1. **Remover tags** dos três blocos (mobile overlay, desktop hero overlay, desktop below):
   - Apagar o array `displayTags` e os três blocos `<div className="flex flex-wrap gap-...">{displayTags.map(...)}</div>`.
   - Remover o `mb-4` / `mb-premium-md` do parágrafo de descrição, já que não há mais elemento depois.

2. **Reduzir área de texto no hero desktop**:
   - No bloco overlay desktop (linha 141), trocar `max-w-[55%]` por `max-w-[28%]` (corta pela metade).
   - Ajustar o gradient desktop (linhas 122-124) para acompanhar a área menor, encerrando antes: `to right, ${imageColor}b3 0%, ${imageColor}55 22%, transparent 40%` (e fallback equivalente).

Sem mudanças em `FeaturedProjects.tsx`, mobile permanece com texto em largura total, e o layout `below` (cards menores) continua com seu texto abaixo da imagem em largura natural.
