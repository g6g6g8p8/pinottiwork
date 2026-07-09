import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const BASE_URL = 'https://pinotti.work';

function toSlug(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let slugs: string[] = [];
        const clients = new Set<string>();
        const roles = new Set<string>();
        const categories = new Set<string>();
        try {
          const dir = path.join(process.cwd(), 'public', 'content', 'projects');
          const files = await readdir(dir);
          for (const f of files) {
            if (!f.endsWith('.md')) continue;
            const slug = f.replace(/\.md$/, '');
            slugs.push(slug);
            try {
              const raw = await readFile(path.join(dir, f), 'utf8');
              const { data } = matter(raw);
              if (data.client) clients.add(toSlug(String(data.client)));
              if (data.role) roles.add(toSlug(String(data.role)));
              if (data.category) categories.add(toSlug(String(data.category)));
            } catch {
              // ignore parse errors
            }
          }
        } catch {
          slugs = [];
        }

        const entries: Array<{ path: string; priority: string; changefreq: string }> = [
          { path: '/', priority: '1.0', changefreq: 'weekly' },
          { path: '/about', priority: '0.8', changefreq: 'monthly' },
          { path: '/guides/creative-director-portfolio', priority: '0.7', changefreq: 'monthly' },
          { path: '/guides/portfolio-examples', priority: '0.7', changefreq: 'monthly' },
          ...slugs.map((s) => ({ path: `/projects/${s}`, priority: '0.7', changefreq: 'monthly' })),
          ...[...clients].map((s) => ({ path: `/clients/${s}`, priority: '0.5', changefreq: 'monthly' })),
          ...[...roles].map((s) => ({ path: `/roles/${s}`, priority: '0.5', changefreq: 'monthly' })),
          ...[...categories].map((s) => ({ path: `/categories/${s}`, priority: '0.5', changefreq: 'monthly' })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
          )
          .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
