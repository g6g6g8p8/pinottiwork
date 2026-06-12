## Goal

Create 5 new project pages and extend `mastercard-like-magic` with the TVC, all in English, with copy adapted from the source articles + every still I can pull from the source pages uploaded to Lovable Assets.

## Source → Project mapping

| Source URL | Action | Slug |
| --- | --- | --- |
| clubedecriacao `new-generation` | Create | `mitsubishi-new-generation` |
| clubedecriacao `multiverso` | Create | `mitsubishi-multiverso` |
| clubedecriacao `mastercard-jazz` | Create | `mastercard-jazz` |
| clubedecriacao `magico-em-filme-da-mastercard` | **Merge** into existing | `mastercard-like-magic` |
| clubedecriacao `waffle` | Create | `forno-de-minas-waffle` |
| behance `Coleção de Memórias` | Create | `mastercard-collection-of-memories` |

## What I'll do per source

1. **Deep scrape for media.** For each clubedecriacao article: use `browser--navigate_to_url` + `browser--extract` (or Firecrawl `scrape` with `formats: ['html','links','screenshot']`) to pull every WP image (`wp-content/uploads/...`), Vimeo/YouTube IDs, and embedded photo galleries. For the Behance page, pull the two Vimeo IDs already identified (213956861, 213955546) plus any project stills exposed in the gallery viewer (fall back to `browser--screenshot` of the full page if Behance lazy-loads).
2. **Upload stills.** `curl` each image to `/tmp`, then `lovable-assets create --file` → write `src/assets/cases/<slug>/<name>.asset.json`. Skip Behance gallery thumbs that are just "other projects" cards.
3. **Write the markdown** at `public/content/projects/<slug>.md` with English copy translated/adapted from the article body, a short `description`, frontmatter (`title`, `client`, `role: Art Director` or `Creative Director` where credits show CD level, `category`, `order`, `hero`, `aspect_ratio`), video embeds via `[video](...)`, image galleries via `:::gallery`, and a final `## Credits` block with the key agency/production credits in English.
4. **Order values.** New projects get `order: 24..29` (after current max ~23) so the curated home grid stays untouched. No changes to `home-layout.md`.

## Per-project specifics

### `mitsubishi-new-generation` (NEW)
- client: Mitsubishi Motors · role: Art Director · category: Advertising
- Videos: `https://www.youtube.com/watch?v=U3KIL4otQ2s` (L200 Triton Sport), `https://www.youtube.com/watch?v=fwedmzWiL2g` (4You4NewGeneration)
- Body: English adaptation of the Tech and Soul brief — repositioning Mitsubishi around the "4×4 lifestyle" for a new generation; introduces the "4you4" signature across the lineup.

### `mitsubishi-multiverso` (NEW)
- client: Mitsubishi Motors · role: Art Director · category: Advertising
- Video: `https://www.youtube.com/watch?v=IXlz6D22rtA` (Outlander Sport 2021)
- Body: First Tech and Soul campaign for Mitsubishi; "the new diamond" positioning; original score recorded in NY with singer Tansu.

### `mastercard-jazz` (NEW)
- client: Mastercard · role: Art Director · category: Branding (photo-led festival launch)
- No video. Hero + gallery from Maurício Nahas photos + OOH pieces if the scrape returns them. If the page only yields thumbnails, I'll use the largest WP version available.
- Body: WMcCann campaign for the first Mastercard Jazz festival at Ibirapuera, 2019.

### `mastercard-like-magic` (EXTEND)
- Keep existing print KVs and copy.
- Add a new `## The Film` section above current gallery with the TVC (need to look up the Vimeo/YouTube URL via deeper scrape of the article; if no public embed survives, link to the article as reference).
- Append film credits (Side Cinema / Pablo Fusco & Renato Assad / DOP Mariano Monti / Clan VFX / Timbre).

### `forno-de-minas-waffle` (NEW)
- client: Forno de Minas · role: Art Director · category: Advertising
- Online + merchandising campaign "Combina com Tudo" / "Goes with Everything", WMcCann 2015. Photos by Marcelo Resende.
- Body in English; gallery of whatever stills the scrape returns.

### `mastercard-collection-of-memories` (NEW)
- client: Mastercard · role: Art Director · category: Advertising
- Two Vimeo films: `https://vimeo.com/213956861` (1:12), `https://vimeo.com/213955546` (1:03)
- Body: 2017 Mastercard "Coleção de Memórias" — two emotional films about the things that turn into memory, directed by Tatiana Jacobsohn.

## Files touched

- New: `public/content/projects/{mitsubishi-new-generation,mitsubishi-multiverso,mastercard-jazz,forno-de-minas-waffle,mastercard-collection-of-memories}.md`
- Edited: `public/content/projects/mastercard-like-magic.md`
- New under `src/assets/cases/<slug>/`: one `<file>.asset.json` per uploaded still
- No code changes (categories/clients/roles routes auto-pick up new slugs from frontmatter)
- No edits to `home-layout.md` or `sitemap[.]xml.ts` (sitemap regenerates from project frontmatter)

## Stopping conditions

- If deep scrape returns zero usable images for a project, I'll still publish the page (videos + copy + credits) and flag which projects need user-supplied stills.
- If a Vimeo/YouTube ID 404s on embed test, I'll drop it from the page and note it in the closing summary.