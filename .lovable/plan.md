## Mudanças

### 1. CAREER HIGHLIGHTS: texto completo
- `src/components/portfolio/CareerWall.tsx`: remover `line-clamp-2` da descrição (`<p>{h.period}</p>`) para o texto aparecer inteiro. Manter o resto do layout compacto.

### 2. Sidebar sem Effie Latam
- `src/components/portfolio/SidebarAwards.tsx`: filtrar a lista antes do `.map` excluindo qualquer award cujo `name` contenha "Latam" (case-insensitive). Assim a página `/about` continua mostrando os 4 awards normalmente, mas a sidebar exibe só Guinness, Effie Brasil e NYF Midas.

### 3. QA
- Sidebar: 3 logos (Guinness, Effie Brasil, NYF Midas).
- `/about` → seção AWARDS: 4 itens, incluindo Effie Latam.
- Home → cards de CAREER HIGHLIGHTS exibem a descrição inteira, sem corte.