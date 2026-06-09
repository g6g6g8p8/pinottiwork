## Causa

O frontmatter de `public/content/projects/fini-algorithmic-diagnostics.md` tem:

```
title: Fini: A The Content System for Fun
```

O `:` sem aspas torna o YAML inválido. O parser (`gray-matter` / js-yaml) em `src/lib/content.functions.ts` lança erro, o `listProjects` ignora o arquivo, e o slug some do `projectMap`. Como `FeaturedProjects.tsx` filtra slugs inexistentes (`cards.length === 0 → return null`), o card do hero do Fini desaparece da home.

## Mudança

Arquivo: `public/content/projects/fini-algorithmic-diagnostics.md`

Trocar a linha do título por uma versão com aspas:

```yaml
title: 'Fini: A The Content System for Fun'
```

Confirmar com o usuário se o título correto é mesmo "Fini: A The Content System for Fun" (parece ter um "A" sobrando — talvez devesse ser "Fini: The Content System for Fun" ou "Fini: A Content System for Fun"). Aplicar a correção final junto com as aspas.

## Fora do escopo

Nenhuma mudança em código, layout ou outros projetos. Só o frontmatter do arquivo do Fini.
