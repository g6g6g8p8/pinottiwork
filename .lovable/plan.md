## Mapeamento dos anexos

- **Guinness** → image-5 (versão única em cores, funciona em ambos os temas)
- **Effie Brasil** → image-7 (texto preto, tema light) + image-10 (texto branco, tema dark)
- **Effie Latam** → image-6 (texto preto, tema light) + image-9 (texto branco, tema dark)
- **NYF Midas** → image-8 (dourado, versão única)

## Mudanças

### 1. Upload dos novos logos
- Substituir os 4 selos minimalistas atuais (`src/assets/awards/*.png.asset.json`) pelos logos oficiais via `lovable-assets create` direto de `/mnt/user-uploads/`:
  - `guinness.png` ← image-5
  - `effie-br-light.png` ← image-7, `effie-br-dark.png` ← image-10
  - `effie-latam-light.png` ← image-6, `effie-latam-dark.png` ← image-9
  - `nyf.png` ← image-8
- Deletar os 4 asset pointers antigos via `assets--delete_asset`.

### 2. Schema com variantes light/dark
- `AwardItem` em `src/lib/content.functions.ts` passa de `{ name, logo }` para `{ name, logo_light, logo_dark }`. Mapper aceita formato antigo (string ou `{logo}`) preenchendo ambos com o mesmo valor por compat.
- `public/content/about.md`: cada award vira:
  ```yaml
  - name: Guinness World Records
    logo_light: <url>
    logo_dark: <url>   # mesma URL quando não há variante
  ```

### 3. `SidebarAwards.tsx`
- Detectar tema via `document.documentElement.classList.contains('dark')` dentro de um `useEffect` + `MutationObserver` na classe (ou usar hook existente se houver — checar). Estado `isDark` decide qual `src` usar.
- Remover `grayscale`/`opacity` para preservar as cores oficiais. Manter container 28px (`w-7 h-7`), `object-contain`, tooltip, sem linha divisória (já está assim).
- Como os logos têm proporções largas (effie é horizontal), trocar o círculo `rounded-full overflow-hidden` por contêiner retangular `w-9 h-7` (ou similar) para acomodar sem distorcer; `object-contain` mantém proporção.

### 4. `About.tsx`
- Usar `logo_light` no card (página tem fundo claro por padrão; se houver dark mode, escolher via mesmo helper).

### 5. Arquivos tocados
- Editar: `public/content/about.md`, `src/lib/content.functions.ts`, `src/components/portfolio/SidebarAwards.tsx`, `src/components/portfolio/About.tsx`
- Criar: 6 novos `.asset.json` em `src/assets/awards/`
- Deletar: 4 `.asset.json` antigos (selos minimalistas)

### 6. QA
- Sidebar em tema light: logos coloridos com texto preto (Effie BR/Latam variant light), Guinness colorido, NYF dourado.
- Sidebar em tema dark: Effie BR/Latam trocam para variante de texto branco; Guinness e NYF mantêm.
- Sem linha divisória. Tooltip com nome no hover. `/about` continua exibindo logo + nome.