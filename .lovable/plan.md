## Vimeo → Project mapping (identified via Vimeo oEmbed)

| Vimeo ID | Title | Project |
| --- | --- | --- |
| 187879596 | Forno de Minas — Waffle ("Combina com tudo") | `forno-de-minas-waffle` |
| 261569045 | L'Oréal Paris — Elseve Óleo Extraordinário Cachos ("Orgulho dos Cachos") | `elvive-orgulho-dos-cachos` |
| 212125069 | Mastercard — Coleção de Memórias | `mastercard-collection-of-memories` |
| 212130154 | Mastercard — Como fazer a sua Coleção de Memórias | `mastercard-collection-of-memories` |
| 187872917 | Mastercard — Mulher que Estica (Supereconômicos) | `mastercard-supereconomics` |
| 187872922 | Mastercard — Guru dos Cartões (Supereconômicos) | `mastercard-supereconomics` |
| 187872926 | Mastercard — Incrível Homem das Contas (Supereconômicos) | `mastercard-supereconomics` |
| 187872991 | Mastercard — Demolidor de Gastos (Supereconômicos) | `mastercard-supereconomics` |

## What I'll change

Markdown-only edits. No code, no assets, no home-grid changes.

### `forno-de-minas-waffle.md`
- Add a `## The Film` section above the placeholder note with `[video](https://vimeo.com/187879596 "Forno de Minas — Waffle: Goes With Everything")`.
- Remove the "stills coming soon" blockquote (the film now carries the page).
- Switch frontmatter `hero` to `https://vumbnail.com/187879596.jpg` so the project gets a proper thumbnail on the sidebar/related cards.

### `elvive-orgulho-dos-cachos.md`
- Insert a `## The Film` section after the intro copy with `[video](https://vimeo.com/261569045 "Elseve Óleo Extraordinário Cachos — Orgulho dos Cachos")`.
- Leave the existing KV gallery and credits intact.

### `mastercard-collection-of-memories.md`
- Replace the current two-Vimeo block (213956861 / 213955546 — both 404 now per the original scrape note) with the two confirmed films:
  - `[video](https://vimeo.com/212125069 "Mastercard — Coleção de Memórias")`
  - `[video](https://vimeo.com/212130154 "Mastercard — Como fazer a sua Coleção de Memórias")`
- Update `hero` and `og_image` to `https://vumbnail.com/212125069.jpg`.
- Adjust credits line to match the new oEmbed credits (Direção de conteúdo: Eduardo de Oliveira; CD: Duda Hernandez; Criação: Giulio Pinotti, Tatiana Jacobsohn; Produtora: Fantástica Filmes e Post; Som: HEYHEYMYMY) — phrased in English.

### `mastercard-supereconomics.md`
- Add a `## The Films` section with all four Supereconômicos films as a video gallery (one `[video](...)` per line):
  - 187872917 — "Stretchy Woman"
  - 187872922 — "Card Guru"
  - 187872926 — "Incredible Bill Man"
  - 187872991 — "Spending Demolisher"
- Append the shared production credits to the project's Credits block (Content Direction: Eduardo de Oliveira; CD: Duda Hernandez; Creative Integration: Clauber Volinsky; Head of Digital Art: Duda di Pietro; Creative: Giulio Pinotti, Tatiana Jacobsohn) if not already present.

## Out of scope

- No still-image scraping for any of these (Vimeo poster via `vumbnail.com` is enough for cards).
- No new project files, no route/home-layout changes, no sitemap edits (sitemap regenerates from frontmatter).
- I will read each target `.md` before editing to keep the existing copy/structure intact.
