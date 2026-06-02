import { createServerFn } from '@tanstack/react-start';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface ProjectMeta {
  title: string;
  description: string;
  hero: string;
  client?: string;
  role?: string;
  category?: string;
}

export const getProjectMeta = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<ProjectMeta | null> => {
    try {
      const safe = data.slug.replace(/[^a-z0-9-]/gi, '');
      const file = path.join(process.cwd(), 'public', 'content', 'projects', `${safe}.json`);
      const raw = await readFile(file, 'utf-8');
      const parsed = JSON.parse(raw) as { data: ProjectMeta };
      return parsed.data ?? null;
    } catch {
      return null;
    }
  });

export const getAllProjectSlugs = createServerFn({ method: 'GET' })
  .handler(async (): Promise<string[]> => {
    try {
      const file = path.join(process.cwd(), 'public', 'data', 'projects.json');
      const raw = await readFile(file, 'utf-8');
      const arr = JSON.parse(raw) as Array<{ slug: string }>;
      return arr.map((p) => p.slug).filter(Boolean);
    } catch {
      return [];
    }
  });
