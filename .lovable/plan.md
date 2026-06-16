## Goal

1. Validate the `CareerWall` component (CAREER HIGHLIGHTS on the home page) across mobile and desktop viewports.
2. Resize each card: ~25% narrower laterally and ~25% taller vertically.

## Scope

Single file: `src/components/portfolio/CareerWall.tsx`. No data/content changes, no logic changes outside what's needed to keep the scroll math correct after the resize.

## Card resize

Current card widths (both the reduced-motion and the animated track):
- mobile: `w-[78vw]`
- sm: `w-[48vw]`
- lg: `w-[32vw]`

New widths (~−25%):
- mobile: `w-[58vw]`
- sm: `w-[36vw]`
- lg: `w-[24vw]`

Current vertical sizing: cards are content-sized (no fixed height) and the inner `<p>` flexes (`flex-1`). To grow ~25% taller without breaking the grid feel, set a min-height on the card via the wrapper, scaled per breakpoint:

- mobile: `min-h-[200px]`
- sm: `min-h-[230px]`
- lg: `min-h-[260px]`

(Exact values tuned during implementation to match the ~25% delta against measured current heights; the `<p>` already fills remaining space via `flex-1`, so the visual breathing room lands at the bottom of the card.)

## QA matrix

Run `browser--view_preview` at `/`, scroll to the CAREER HIGHLIGHTS section, and verify at each viewport:

- 1920×1080 (desktop)
- 1366×768 (laptop)
- 1024×768 (small laptop / iPad landscape)
- 768×1024 (iPad portrait)
- 414×896 (iPhone Plus)
- 390×844 (iPhone 14)
- 375×812 (iPhone SE/mini)

Checks per viewport:
1. Section heading "CAREER HIGHLIGHTS" is visible and aligned with the page gutter.
2. Cards render with the new dimensions, no clipped text, logos square and crisp.
3. Vertical scroll converts to horizontal motion smoothly; last card fully reachable; track does not overshoot or leave a large empty gap on the right.
4. On reduced-motion fallback path (mobile snap scroll), horizontal swipe snaps card-by-card and the last card is reachable.
5. No horizontal page scroll (only the inner track scrolls).
6. Console clean (no React/layout warnings).

If any viewport fails (e.g., overshoot because `distance` math no longer matches), adjust the right padding (`pr-[20vw]`) or the section-height formula in the same edit.

## Out of scope

- Card visual restyle beyond size (colors, radii, typography stay as-is).
- Content/data in `career-highlights.md`.
- Other home sections.
