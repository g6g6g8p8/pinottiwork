## Goal
In `mastercard-priceless-ecosystem.md`, replace the plain-text link "→ See the full case: Get Closer" with an actual `ProjectCard` (same component used on the home grid) pointing to `/projects/mastercard-get-closer`, and move the whole Get Closer section to appear **after** Mastercard Black — Priceless Travel.

## Changes

### 1. New markdown block type: `project-card`
Add a reusable embed so any case study can link to another project visually.

- `src/lib/parseMarkdown.ts`
  - Extend `ContentBlock['type']` with `'project-card'` and add `slug` to `content`.
  - Update the splitter regex to also capture `:::project slug=<slug>:::` blocks and emit a `project-card` block.

- `src/components/portfolio/ProjectDetail.tsx`
  - Add a `case 'project-card'` in `renderContent` that loads the referenced project from the existing projects list (via `useProjects`) and renders `<ProjectCard project={p} forceAspect="card" layout="below" />` inside a container constrained to a sensible max width (e.g. `max-w-md`).
  - If the project isn't found, render nothing.

### 2. Reorder + embed in the markdown file
- `public/content/projects/mastercard-priceless-ecosystem.md`
  - Remove the current "Get Closer — Copa América 2019" section from its position right after the intro.
  - Insert it **after** the Mastercard Black — Priceless Travel section (before Collection of Memories).
  - Replace the text `→ [See the full case: Get Closer](/project/mastercard-get-closer)` with:
    ```
    :::project slug=mastercard-get-closer:::
    ```

## Out of scope
No visual/design changes to `ProjectCard` itself, no changes to other case study pages.
