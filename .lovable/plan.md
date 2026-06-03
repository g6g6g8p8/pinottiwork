## Goal

Add a small circular "Guinness World Record" badge overlay on the top-right corner of the project card image — Behance-style award seal — specifically for the `mary-kay-guinness-record` project.

## Design

- Position: absolute top-right of the card image, with comfortable inset (e.g., 12–16px).
- Shape: small circular badge (≈48–56px desktop, ≈40px mobile) using the existing `src/assets/awards/guinness.png` asset.
- Style: subtle white ring + soft shadow so it reads as an applied seal, like Behance's "Featured" / award medals.
- Slight entrance animation (fade + scale) so it feels premium.
- Pointer-events disabled so it doesn't interfere with the card link.

## Implementation

1. **`src/components/portfolio/ProjectCard.tsx`**
   - Import the guinness asset JSON.
   - Add an optional badge overlay rendered when `project.slug === 'mary-kay-guinness-record'`.
   - Place it inside the image container (above gradient/overlay, z-30) so it sits on top-right regardless of `overlay` vs `below` layout.
   - Use `motion.img` with a small whileHover scale for delight, matching the card's existing motion vocabulary.

No changes to content markdown, categories, or routing. Scope strictly visual.

## Open question

Should the badge appear **only on the homepage card** (FeaturedProjects), or also on the **project detail hero** at `/projects/mary-kay-guinness-record`? Default plan: card only (homepage). I can extend to the detail hero if you want.
