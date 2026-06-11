## What gets added

Six new files under `public/content/projects/`, one per case. All bodies in English. None are added to `public/data/home-layout.md` (so they don't appear on the home grid, but they do show up in `/about`, the sidebar, and `/projects/{slug}`).

Each project gets `order: 99+` so the existing homepage ordering is untouched, and a `category` chosen from the existing taxonomy (icons already covered after the last task).

| Slug | Title | Client | Category | Hero | Media |
|---|---|---|---|---|---|
| `coca-cola-bye-bye-straws` | Bye Bye, Straws | Coca-Cola | Social Impact | first .gif from the portfolio page | 4 gifs + 3 png stills + body text + credits |
| `elvive-orgulho-dos-cachos` | Extraordinary Oil Curls | L'Oréal Paris Elvive | Advertising | first .png key visual | 6 key-visual pngs + YouTube film embed |
| `americanas-qr-code` | QR Code App Download | Americanas.com | Advertising | Vimeo poster (no static cover on page) | Vimeo film + 4 stills you'll send + credits |
| `mastercard-supereconomics` | Supereconomics | Mastercard | Branded Content | first portfolio image (you'll confirm or send) | 4 teaser films (URLs you'll paste) + body + credits |
| `mastercard-like-magic` | Like Magic | Mastercard | Advertising | first Behance hi-res | 3 hi-res Behance modules + short EN description |
| `mitsubishi-espn-tennis` | ESPN Tennis Broadcasts Sponsorship | Mitsubishi Motors | Branded Content | first Behance hero png | 3 Behance hero stills + 3 Giulio Vimeo films + 3 Pimp Studio vinhetas + merged EN body + credits |

## Media pipeline

For every still/gif on the source pages I'll:

1. `curl` the source URL (Behance `mir-s3-cdn-cf` / Adobe Portfolio `cdn.myportfolio.com`) into `/tmp/`.
2. `lovable-assets create --file /tmp/<file> --filename <name>` and write the pointer to `src/assets/cases/<slug>/<name>.asset.json`.
3. Embed via the JSON's `url` field in the markdown (`hero:`, `![](...)` inside a `:::gallery`, etc.).

Videos stay as remote embeds:

- Vimeo (Giulio's, Pimp Studio's, Coca-Cola's, Americanas') → `[video autoplay](https://vimeo.com/{id})` for short loops, `[video](...)` for hero-length films.
- YouTube (Elvive `8olnVU6eeYc`) → `[video](https://www.youtube.com/watch?v=...)`.
- For each project with a video hero, set `og_image` to the chosen static cover so share previews still work.

Where the page exposes no static cover (Americanas, some Mitsubishi vinhetas), I'll use the first gallery image as `hero` so cards still have artwork.

## English copy

Coca-Cola, Elvive, Americanas, Like Magic, Mitsubishi ESPN are already in English on the source pages — I'll lift verbatim, tighten lightly. The Pimp Studio page (Mitsubishi) is in Portuguese; I'll translate its production-side context and merge with the Behance English summary into one body with sections: The Brief / The Idea / The Films / Credits.

Credits lines stay in the existing project format: `Creative Director … · Art Director … · Copywriter … · Production …`.

## Pending on you

1. **Supereconomics**: the 4 teaser video URLs (Vimeo or YouTube).
2. **Americanas**: the 4 supporting still images.

I'll start writing everything as soon as build mode is on. When you drop those assets/URLs later I'll plug them into the already-created files (or I can wait for both before starting — say the word).

## Out of scope

- No changes to `home-layout.md`, sidebar logic, category icons, or `BottomTabBar`.
- No edits to existing case markdowns.
- No new routes or schema.
