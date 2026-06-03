## Update site share image

Replace the site-wide Open Graph / Twitter share image in `src/routes/__root.tsx` with the newly uploaded black-and-white portrait.

### Steps

1. Upload the attached image via `lovable-assets create` from `/mnt/user-uploads/...png`, writing the pointer to `src/assets/social-share.png.asset.json`.
2. In `src/routes/__root.tsx`, import that pointer and use its `.url` for both:
   - `<meta property="og:image">` (line 93)
   - `<meta name="twitter:image">` (line 94)
3. Leave project routes untouched — `src/routes/projects.$slug.tsx` already emits its own per-project `og:image`, which overrides the root value.

### Notes

- The image is 1024×1024; LinkedIn/X accept square but the ideal is 1200×630. Using as-is per request.
- No other meta tags change.