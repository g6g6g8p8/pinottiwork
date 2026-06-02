import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = 'https://pinottiwork.lovable.app';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let slugs: string[] = [];
        try {
          const file = path.join(process.cwd(), 'public', 'data', 'projects.json');
          const raw = await readFile(file, 'utf-8');
          slugs = (JSON.parse(raw) as Array<{ slug: string }>).map((p) => p.slug).filter(Boolean);
        } catch {
          slugs = [];
        }

        const entries: Array<{ path: string; priority: string; changefreq: string }> = [
          { path: '/', priority: '1.0', changefreq: 'weekly' },
          { path: '/about', priority: '0.8', changefreq: 'monthly' },
          ...slugs.map((s) => ({ path: `/projects/${s}`, priority: '0.7', changefreq: 'monthly' })),
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
