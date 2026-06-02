import { createServerFn } from '@tanstack/react-start';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const PROJECTS_DIR = path.join(process.cwd(), 'public/content/projects');
const CONTENT_DIR = path.join(process.cwd(), 'public/content');

export interface ProjectData {
  id?: number;
  title: string;
  slug: string;
  client: string;
  role: string;
  category: string;
  tags: string[];
  order: number;
  hero: string;
  image_url: string;
  aspect_ratio: string;
  description: string;
}

export interface ProjectFull {
  data: ProjectData;
  content: string;
}

function safeSlug(s: string) {
  return s.replace(/[^a-z0-9-]/gi, '');
}

function normalizeProject(raw: any, fallbackSlug: string): ProjectData {
  const slug = raw.slug || fallbackSlug;
  const hero = raw.hero || '';
  return {
    id: raw.id,
    title: raw.title || '',
    slug,
    client: raw.client || '',
    role: raw.role || '',
    category: raw.category || '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    order: typeof raw.order === 'number' ? raw.order : 999,
    hero,
    image_url: hero,
    aspect_ratio: raw.aspect_ratio || '4:3',
    description: raw.description || '',
  };
}

async function readProjectFile(slug: string): Promise<ProjectFull | null> {
  try {
    const safe = safeSlug(slug);
    const file = path.join(PROJECTS_DIR, `${safe}.md`);
    const raw = await readFile(file, 'utf-8');
    const { data, content } = matter(raw);
    if (!data || !data.title) return null;
    return { data: normalizeProject(data, safe), content };
  } catch {
    return null;
  }
}

export const listProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ProjectData[]> => {
    try {
      const files = await readdir(PROJECTS_DIR);
      const mds = files.filter((f) => f.endsWith('.md'));
      const items = await Promise.all(
        mds.map(async (f) => {
          const slug = f.replace(/\.md$/, '');
          try {
            const raw = await readFile(path.join(PROJECTS_DIR, f), 'utf-8');
            const { data } = matter(raw);
            if (!data || !data.title) {
              console.warn(`[content] skipping ${f}: missing title in frontmatter`);
              return null;
            }
            return normalizeProject(data, slug);
          } catch (e) {
            console.warn(`[content] failed to parse ${f}:`, e);
            return null;
          }
        }),
      );
      return (items.filter(Boolean) as ProjectData[]).sort((a, b) => a.order - b.order);
    } catch (e) {
      console.error('[content] listProjects failed:', e);
      return [];
    }
  },
);

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<ProjectFull | null> => {
    return readProjectFile(data.slug);
  });

export const getAllProjectSlugs = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    try {
      const files = await readdir(PROJECTS_DIR);
      return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
    } catch {
      return [];
    }
  },
);

// Lightweight meta used by sitemap / SEO head — preserves the shape of the
// previous project-meta.functions.ts API.
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
    const p = await readProjectFile(data.slug);
    if (!p) return null;
    return {
      title: p.data.title,
      description: p.data.description,
      hero: p.data.hero,
      client: p.data.client,
      role: p.data.role,
      category: p.data.category,
    };
  });

// ---------- ABOUT ----------

export interface CareerHighlight {
  id: number;
  company: string;
  role: string;
  logo_url: string;
  period: string;
  order: number;
}

export interface AboutData {
  name: string;
  email: string;
  title: string;
  avatar_url: string;
  short_bio: string;
  what_i_do: string;
  brands: string[];
  awards: string[];
  career_highlights: CareerHighlight[];
}

export const getAbout = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AboutData | null> => {
    try {
      const aboutRaw = await readFile(path.join(CONTENT_DIR, 'about.md'), 'utf-8');
      const { data, content: bio } = matter(aboutRaw);

      let highlights: any[] = [];
      try {
        const chRaw = await readFile(path.join(CONTENT_DIR, 'career-highlights.md'), 'utf-8');
        const parsed = matter(chRaw);
        highlights = parsed.data?.highlights || [];
      } catch {
        highlights = (data as any).career_highlights || [];
      }

      return {
        name: data.name || '',
        email: data.email || '',
        title: data.title || '',
        avatar_url: data.avatar_url || data.avatar || '',
        short_bio: (bio || '').trim(),
        what_i_do: data.what_i_do || '',
        brands: data.brands || [],
        awards: data.awards || [],
        career_highlights: (highlights as any[])
          .map((h: any, i: number) => ({
            id: h.id || i,
            company: h.company || '',
            role: h.agency || h.role || '',
            logo_url: h.logo || h.logo_url || '',
            period: h.period || h.description || '',
            order: h.order || i,
          }))
          .sort((a, b) => a.order - b.order),
      };
    } catch (e) {
      console.error('[content] getAbout failed:', e);
      return null;
    }
  },
);
