# Plan — Mit Sertões images + Related Projects + Clickable Client/Role/Category

Three connected changes, all driven by existing markdown frontmatter (`client`, `role`, `category`). No backend changes.

---

## 1. Pull mit-mile images into `mit-cada-km-mit-conta`

The source page (`giuliopinotti.myportfolio.com/mit-mile`) has 2 Vimeo films already in the markdown + **~85 stills** (KVs, dashboard user-generated posts, OOH, press). I will:

1. Download each `cdn.myportfolio.com/...` image at its highest available size (`_rw_1920` → `_rw_1200` → `_rw_600` fallback).
2. Upload to `src/assets/cases/mit-cada-km-mit-conta/` via `lovable-assets`, writing `.asset.json` pointers.
3. Insert as gallery blocks inside the existing English markdown, grouped to keep the page readable:
   - **Key Visuals** (3–4 main KVs near the top)
   - keep existing Campaign Vimeo
   - **Dashboard Posts** (user-generated dashboard photos with the hashtag)
   - **Press & OOH** (newspaper / out-of-home)
   - keep existing Results Vimeo
   - **Behind the scenes / extras**

**Open question:** pull **all ~85** stills, or curate to the strongest ~25? Galleries over ~25 hurt scroll. I'd recommend curate; will pull all if you prefer.

Hero, credits, category, slug — unchanged.

---

## 2. Related Projects at the bottom of every project page

New component `RelatedProjects` rendered in `ProjectDetail.tsx`, above the Share button.

**Logic** (uses existing `useProjects` hook):

- Exclude the current project.
- **Pool A — More from {client}**: up to 3 projects with same `client`.
- **Pool B — More in {category}**: up to 3 projects with same `category`, excluding any already in Pool A.
- Each pool sorted by `order` asc.
- Render each non-empty pool as its own labeled row. If both empty, render nothing.

**UI** (matches portfolio's existing tokens):

- Section eyebrow: `text-[11px] font-semibold uppercase tracking-[.07em] opacity-60` (same as the poster eyebrow).
- Grid: 2 cols on mobile, 3 on `lg`, `gap-4`.
- Each card: 4:5 cover with title + category overlay (reuse `ProjectCard` if its API allows; otherwise small inline card built from the same tokens — `rounded-sf-xl`, glass overlay, hover scale).
- Container: `mt-16 pt-12 border-t border-border/40`.

---

## 3. Clickable Client / Role / Category → filtered list pages

Make the existing chips on the project poster (Client, Role) and the eyebrow (Category) clickable, leading to new filtered list routes.

### New routes (file-based)

- `src/routes/clients.$client.tsx` → `/clients/<slug>`
- `src/routes/roles.$role.tsx` → `/roles/<slug>`
- `src/routes/categories.$category.tsx` → `/categories/<slug>`

Each route:
- `head()` with route-specific `title` / `description` / `og:title` / `og:description` (e.g. `Projects for Mary Kay — Giulio Pinotti`).
- Uses `listProjects` server fn → filters client-side by slugified param.
- Page layout reuses the same `ProjectCard` grid as Home.

Empty state: "No projects found" + link back home.

### Slug helper

Add to `src/lib/portfolio-utils.ts`:

```ts
export const toSlug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
```

Filter: `projects.filter(p => toSlug(p.client) === param)`.

### ProjectDetail chip updates

Replace `<span>` chips with `<Link>`s, same pill style + `hover:bg-white/25 transition-colors`:

```tsx
<Link to="/clients/$client" params={{ client: toSlug(project.client) }}>
  {project.client}
</Link>
```

Same treatment for the Role pill and the Category eyebrow.

The new Related Projects card grid will also link via the same routes.

### Sitemap

Add one entry per unique client / role / category to `src/routes/sitemap[.]xml.ts`.

---

## Files touched

- `public/content/projects/mit-cada-km-mit-conta.md` — galleries added
- `src/assets/cases/mit-cada-km-mit-conta/*.asset.json` — new image pointers
- `src/lib/portfolio-utils.ts` — `toSlug`
- `src/components/portfolio/ProjectDetail.tsx` — chips become `<Link>`s + render `<RelatedProjects />`
- `src/components/portfolio/RelatedProjects.tsx` *(new)*
- `src/components/portfolio/ProjectList.tsx` *(new, shared by the 3 filter routes)*
- `src/routes/clients.$client.tsx` *(new)*
- `src/routes/roles.$role.tsx` *(new)*
- `src/routes/categories.$category.tsx` *(new)*
- `src/routes/sitemap[.]xml.ts` — add filter URLs

---

## Questions before I build

1. **Image count for mit-mile**: pull **all ~85**, or **curate ~25**?
2. **Related Projects layout**: two labeled rows (`More from {client}` + `More in {category}`) — OK? Or single combined "Related" row capped at 4?
3. **Sitemap**: include the new filter pages? (Recommend yes.)
