## Problem

`CareerWall` uses a sticky scroll-jack (section grows to `100svh + distance`, sticky viewport, horizontal `translateX` driven by `useScroll`) on every viewport except when `prefers-reduced-motion` is set. On mobile Safari this pattern is fragile:

- iOS Safari's dynamic toolbar changes `svh` mid-scroll, which resets `scrollYProgress` and can wedge the sticky container.
- On newer iPhones (iOS 17/18) the touch handling around a tall sticky section with `touchAction: pan-y` + JS-driven X often ends up "capturing" the gesture and blocks further vertical scroll — the page freezes exactly where the section pins, which matches what the user reports.
- The in-app Instagram browser behaves slightly differently (older WebKit fork), which is why it half-works there.

The scroll-jack was designed for desktop. On phones, a horizontal scroll-jack inside a vertical page is the wrong interaction anyway — thumb-scrolling a horizontal rail is more natural.

## Fix

Restrict the sticky scroll-jack to `lg` and up. On mobile and tablet, always render the existing "reduced motion" branch: a normal horizontal scroll strip with snap and hidden scrollbar. No JS scroll math, no sticky section, no `svh` height — so nothing can wedge iOS.

### Changes in `src/components/portfolio/CareerWall.tsx`

1. Detect desktop (e.g. `useEffect` + `matchMedia('(min-width: 1024px)')` → `isDesktop` state, false during SSR).
2. Render the native horizontal-scroll branch (currently under `if (reduced)`) whenever `reduced || !isDesktop`. Extract it into a small local component or keep the early return, just widen the condition.
3. Only run the `useScroll` / `useTransform` / `useSpring` / measurement `useEffect` path when `isDesktop && !reduced`. Guarding the effect and the sticky JSX behind that flag avoids attaching scroll listeners on mobile at all.
4. Keep card sizing (`CARD_W`) and `Card` markup unchanged — this is purely an interaction change.

### Verification

- Desktop (≥1024px): scroll-jack still works, cards translate horizontally as the page scrolls. No visual change.
- Mobile/tablet: section renders as a single-row horizontal scroller with snap; vertical page scroll is never intercepted; test in iOS Safari and Instagram in-app browser to confirm the page keeps scrolling past the section.
