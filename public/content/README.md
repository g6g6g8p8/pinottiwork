# Content

All site content lives here as Markdown files with YAML frontmatter.
**One file = one source of truth.** No JSON duplicates, no separate index.

## Projects (`projects/<slug>.md`)

Each project is a single `.md`. The filename (minus `.md`) is the URL slug.

```markdown
---
title: Project Title
slug: project-slug              # should match the filename
client: Client Name
role: Art Director              # appears on the project detail page tags
category: Branding              # appears on cards (eyebrow)
order: 3                        # lower = earlier in lists
hero: https://i.imgur.com/xxx.png   # image OR mp4 URL
aspect_ratio: '4:3'             # '4:3' | '9:4' | etc.
description: Short summary shown on cards and OG share previews.
tags: []                        # optional, unused on cards/detail today
og_image: https://...           # optional, overrides the share image (use when hero is a video)
---

Free-form markdown body. Paragraphs work normally.

:::gallery
![](https://example.com/image-1.jpg)
![](https://example.com/video-1.mp4)
:::

[video](https://player.vimeo.com/video/123456 "Optional caption")
[video autoplay](https://player.vimeo.com/video/123456 "Optional caption")
```

### Special blocks

- `:::gallery ... :::` — carousel with one or more images/videos
- `[video](URL "caption")` — embedded video player (Vimeo, YouTube, mp4). Vimeo title/byline/portrait are always hidden.
- `[video autoplay](URL "caption")` — same, but autoplays muted in loop (works for Vimeo, YouTube and mp4/mov)
- `![](URL)` on its own line — single image
- Regular paragraphs become text blocks

### Adding a project

1. Create `projects/my-new-project.md` with the frontmatter above
2. (Optional) Add the slug to `public/data/home-layout.md` if you want it on the home grid
3. Save — done. The site picks it up on next request.

### Reordering

- **List order** (sidebar, /about projects list): edit `order` in each project's frontmatter
- **Home grid layout**: edit `public/data/home-layout.md`

## About (`about.md`)

Single file with bio frontmatter + markdown body for the long bio text.

## Career highlights (`career-highlights.md`)

List of past roles. Edit the `highlights:` array in frontmatter:

```yaml
---
highlights:
  - company: Mary Kay
    agency: Agência Crush
    logo: https://...
    description: What you did there.
    order: 6
---
```

## Media

Use external URLs (imgur, cloudinary, vimeo, etc.). The site doesn't host
images itself — paste the URL and you're done.

## Why this format?

- Edit in any text editor, VS Code, or directly in the GitHub web UI
- Git history = full version history of your content for free
- YAML frontmatter is forgiving (no escaped `\n`, no escaped quotes)
- Single source of truth — change one file, no sync needed
