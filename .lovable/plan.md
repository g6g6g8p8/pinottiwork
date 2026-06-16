## Objetivo

Reordenar as categorias exibidas na sidebar (e em qualquer lugar que derive de `deriveCategories`) para refletir o posicionamento estratégico do portfólio, não a ordem dos projetos.

Nova ordem (após "Selected Works"):

1. Creative Ops
2. Content
3. Social Impact
4. Branded Content
5. Advertising
6. Branding

## Implementação

Editar `src/lib/categories.ts`:

- Adicionar uma constante `CATEGORY_ORDER` com a sequência acima (lowercase).
- Em `deriveCategories`, parar de inferir a ordem a partir de `project.order`. Em vez disso:
  - Continuar começando com a entrada `all` (Selected Works).
  - Iterar `CATEGORY_ORDER` e, para cada categoria que tiver ao menos 1 projeto, adicionar a entrada com `count` calculado.
  - Como fallback, anexar ao final qualquer categoria presente nos projetos que não esteja em `CATEGORY_ORDER` (mantém robustez se surgir categoria nova).

## Fora do escopo

- Não alterar `order` dos arquivos `.md` dos projetos (a ordem dentro de "Selected Works" continua igual).
- Não mexer em ícones, nomes, nem na UI da sidebar.
- Não tocar em rotas `/categories/$category`.
