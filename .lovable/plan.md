## Goal
Refine the `:::stats` block (Mitsubishi project and any future case using it) so each cell is ~25% narrower and ~25% taller, then visually verify the result across the viewports I can actually drive in the sandbox.

## Change

File: `src/components/portfolio/ProjectDetail.tsx` (stats case, ~line 240)

Current cell padding: `px-4 py-2` (16px / 8px).
New cell padding: `px-3 py-6` on mobile, `md:px-3 md:py-8` on desktop — roughly −25% lateral, +25–300% vertical (8px is too cramped to take only +25%, so I'm bumping more aggressively for breathing room; happy to dial back if you prefer literal +25% = 10px).

Also:
- add `min-h-[140px] md:min-h-[180px]` on each cell so the column reads tall regardless of label length
- keep `divide-x divide-border border-y` framing untouched
- value/label typography unchanged

If you'd rather keep py increments literal at +25% (8 → 10px), say the word and I'll use `py-2.5 md:py-3` plus only the min-height bump.

## QA in preview

I'll open `/projects/mitsubishi-4you4-platform` (the page that currently uses `:::stats`) and screenshot at:
- 390×844 (iPhone 14 portrait)
- 768×1024 (iPad portrait)
- 1366×768 (laptop)
- 1920×1080 (desktop)

For each I'll check: no text clipping, line breaks land where intended (`KM DRIVEN / BY COMMUNITY`, `DONATED PER / 10K KM DRIVEN`, `SERTÕES AREA / COVERED BY SAS BRASIL`), dividers align, vertical rhythm balances the value and label.

## Honest scope note

The sandbox browser is a single Chromium instance. I cannot test Safari, Firefox, iOS Safari, or Android Chrome directly — only emulate their viewport sizes. The CSS used here (`grid`, `divide-x`, `border-y`, `tracking`, `leading-none`) is universally supported, so cross-browser risk is low, but real-device QA is on you. I'll call this out in the closing message rather than imply I tested actual devices.
