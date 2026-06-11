## Translate Amazon case to English

Edit `public/content/projects/amazon-conta-com-a-gente.md` frontmatter:

- **slug**: `amazon-conta-com-a-gente` → `amazon-count-on-us`
- **title**: `Amazon.com.br: Conta com a gente` → `Amazon.com.br: Count On Us`
- **description**: replace Portuguese line with:
  > Official launch campaign for Amazon in Brazil, with the message that Brazilians could count on the brand.

### Side effects of slug change

- Rename the file to `amazon-count-on-us.md` so the route `/projects/amazon-count-on-us` matches.
- Update any reference to the old slug:
  - `public/data/home-layout.md` (the homepage grid still features this case at order 5).
  - Any other markdown/JSON pointing to `amazon-conta-com-a-gente`.
- Asset folder `src/assets/cases/amazon-conta-com-a-gente/` stays as-is (internal path, not user-facing) unless you want it renamed too — say the word.

No other content, media, or credits change.