## Mudanças

### 1. Awards: só na sidebar, com logos oficiais

- **Remover AwardsStrip da home**: deletar `AwardsStrip.tsx`, retirar import e o branch `slot === 'awards'` de `FeaturedProjects.tsx`, remover a linha `awards` de `public/data/home-layout.md`.
- **Buscar logos oficiais** via `websearch--web_search` (Guinness World Records, Effie Awards, New York Festivals/Midas) → baixar pra `/tmp` → upload com `lovable-assets create` → escrever `.asset.json` em `src/assets/awards/`.
- **Mudar shape de `awards` no `about.md`** de `string[]` para lista de objetos `{ name, logo }`:
  ```yaml
  awards:
    - name: Guinness World Records
      logo: <cdn-url>
    - name: 'Effie Awards Brasil: 1 Gold 2 Bronze'
      logo: <cdn-url>
    ...
  ```
- **`content.functions.ts`**: trocar `awards: string[]` por `awards: Array<{ name: string; logo: string }>` em `AboutData`; normalizar entradas string antigas pra `{ name, logo: '' }` por compatibilidade.
- **`SidebarAwards.tsx`**:
  - Remover `border-b border-foreground/5`, manter só padding.
  - Trocar `<Trophy />` por `<img src={award.logo} alt={award.name} />` num círculo de 24px, grayscale + opacity 70%, hover full color.
  - Fallback: se `logo` vazio, mostrar `Trophy` como antes.
  - Tooltip continua com `award.name`.
- **`About.tsx`**: a seção AWARDS passa a renderizar logo + nome em linha (logo 32px à esquerda, nome ao lado), mantendo o card visual existente.

### 2. Career Highlights compacto na home

- **Renomear `CareerWall.tsx` → manter nome do arquivo, mudar conteúdo**: header passa de "Worked at" para **"CAREER HIGHLIGHTS"** (mesmo style do /about: `text-[14px] font-medium opacity-60`).
- **Layout compacto**: grid responsivo de cards horizontais:
  - mobile: 1 coluna
  - md: 2 colunas
  - lg: 3 colunas
- **Cada card**: 
  - logo 40px (menor que o /about, que usa 54px) à esquerda, rounded
  - empresa em `text-[15px] font-semibold`
  - "at {agency}" em `text-[12px] text-foreground/60`
  - descrição (`h.period`) abaixo, `text-[12px] text-foreground/70`, truncada em 2 linhas com `line-clamp-2`
- Card com fundo `bg-card`, padding `p-4`, `rounded-sf-xl`, border sutil.
- Animação de entrada permanece (`whileInView` + stagger).

### 3. Arquivos tocados

- **Deletar**: `src/components/portfolio/AwardsStrip.tsx`
- **Editar**: 
  - `public/data/home-layout.md` (remover linha `awards`)
  - `public/content/about.md` (awards vira lista de objetos)
  - `src/lib/content.functions.ts` (tipo `AboutData.awards`, normalização)
  - `src/components/portfolio/FeaturedProjects.tsx` (remover branch awards)
  - `src/components/portfolio/SidebarAwards.tsx` (logos, sem divisória)
  - `src/components/portfolio/CareerWall.tsx` (header, layout compacto, descrição)
  - `src/components/portfolio/About.tsx` (renderizar awards com logo)
- **Criar**: 4 `.asset.json` em `src/assets/awards/`

### 4. QA

- Sidebar desktop: 4 logos pequenos em escala de cinza, hover → cor, tooltip com nome. Sem linha divisória abaixo.
- Home: bloco Awards sumiu; Career Highlights aparece como grid de cards compactos com header "CAREER HIGHLIGHTS".
- /about: seção Awards mostra logo + nome; demais seções iguais.
