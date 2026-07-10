## Plan: Adjust CareerWall card proportions on desktop

### What to change
- In `src/components/portfolio/CareerWall.tsx`, reduce the desktop card width so the card feels closer to a 7:6 width-to-height ratio instead of the current long rectangle.
- Current desktop width: `lg:w-[24vw]`.
- Proposed desktop width: `lg:w-[18vw] lg:min-w-[260px]` (≈ 278 px at 1543 px viewport, ≈ 7:6 against the 240 px min-height).
- Leave mobile (`w-[58vw]`) and tablet (`sm:w-[36vw]`) breakpoints untouched so the mobile experience stays the same.
- Keep `min-h-[200px] md:min-h-[240px]`, padding, typography, and gap values unchanged.

### Why this approach
- The user asked for option A (reduce width) and suggested a 7:6 ratio rather than a perfect square.
- Adding `lg:min-w-[260px]` prevents the card from becoming too narrow on smaller desktop screens (around 1024 px), where 18 vw alone would make it taller than wide.
- The horizontal scroll distance adjusts automatically because the `distance` is measured from the track width at runtime.

### Verification
- Inspect the rendered card in the live preview at a desktop viewport.
- Confirm the card is visibly less rectangular and the horizontal scroll still has enough room to reveal subsequent cards.
