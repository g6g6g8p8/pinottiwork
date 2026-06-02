## Problema

Hoje, no detalhe de projeto (`ProjectDetail.tsx`), os blocos de texto vindos dos arquivos `.md` em `public/content/projects/` são renderizados como `<p>` simples, dividindo apenas por quebras de linha. Resultado: `##`, `**bold**`, listas e links aparecem como texto cru ("## The Diagnosis", "**Bold**"), como visível no case Mary Kay.

## Solução

Usar um renderizador real de Markdown nos blocos `type: 'text'`, preservando o pipeline atual (gallery, video, image continuam tratados por regex antes do parse).

### 1. Dependências

Adicionar:
- `react-markdown` — renderizador
- `remark-gfm` — suporte GFM (listas com `-`, tabelas, links automáticos, strikethrough)

### 2. `src/components/portfolio/ProjectDetail.tsx`

No `case 'text'` do `renderContent`, substituir o `.split('\n').map(...)` por:

```tsx
<div className="prose prose-invert max-w-none opacity-80">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {section.content.text ?? ''}
  </ReactMarkdown>
</div>
```

### 3. Estilos tipográficos

Como o projeto usa Tailwind v4 sem o plugin `@tailwindcss/typography`, mapear elementos via CSS dirigido ao container (em `src/styles.css` ou classes utilitárias inline) para casar com o design system:

- `h2` → estilo similar ao `text-sf-headline` usado em vídeos (display font, maior, negrito, `mt-8 mb-3`)
- `h3` → menor, semibold, `mt-6 mb-2`
- `p` → manter `text-body opacity-80` (já default)
- `strong` → `font-semibold text-foreground` (sem reduzir opacidade)
- `ul`/`ol` → list-disc/decimal com `pl-5 space-y-1`
- `a` → underline, hover muda opacidade
- `blockquote` → border-l, italic, opacidade reduzida

Preferência: adicionar uma classe utilitária no container (ex.: `.project-prose`) em `src/styles.css` com regras `.project-prose h2 { ... }` etc., evitando depender do plugin typography.

### 4. Markdown nativo nos arquivos

Os arquivos já usam sintaxe markdown válida (`##`, `**`, listas). Nenhuma migração de conteúdo é necessária — eles passarão a renderizar corretamente após a mudança.

### 5. Edge cases

- `:::gallery` e `[video](...)` continuam sendo extraídos antes pelo `parseMarkdown.ts` (split no regex), então não vão parar em `ReactMarkdown`.
- Imagens "soltas" (`![](url)`) viram blocos `type: 'image'` no parser atual — comportamento preservado.
- Em mobile, validar espaçamento de h2/h3 dentro do `space-y-8` do container.

## QA

- Abrir `/projects/mary-kay-global-ecosystem`: verificar que "The Diagnosis", "The Architecture", "The Impact" aparecem como headings reais e os trechos em `**` como bold.
- Abrir `/projects/mary-kay-content-machine`: idem para h2 e bold.
- Conferir que galerias e vídeos continuam funcionando.
