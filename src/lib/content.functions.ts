import { createServerFn } from '@tanstack/react-start';
import matter from 'gray-matter';

// Embed markdown content into the bundle at build time so it works in any
// runtime (Node dev/preview + Cloudflare Workers production). Avoid fs/cwd —
// those only work in the Lovable Node sandbox.
const projectFiles = import.meta.glob('/public/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const aboutFiles = import.meta.glob('/public/content/about.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const careerFiles = import.meta.glob('/public/content/career-highlights.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PROJECT_PATH_PREFIX = '/public/content/projects/';

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
  og_image?: string;
  published: boolean;
}

export interface ProjectFull {
  data: ProjectData;
  content: string;
}

function safeSlug(s: string) {
  return s.replace(/[^a-z0-9-]/gi, '');
}

function slugFromPath(p: string) {
  return p.slice(PROJECT_PATH_PREFIX.length).replace(/\.md$/, '');
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
    og_image: raw.og_image || undefined,
  };
}

function readProjectBySlug(slug: string): ProjectFull | null {
  const safe = safeSlug(slug);
  const raw = projectFiles[`${PROJECT_PATH_PREFIX}${safe}.md`];
  if (!raw) return null;
  try {
    const { data, content } = matter(raw);
    if (!data || !data.title) return null;
    return { data: normalizeProject(data, safe), content };
  } catch (e) {
    console.warn(`[content] failed to parse ${safe}.md:`, e);
    return null;
  }
}

export const listProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ProjectData[]> => {
    const items: ProjectData[] = [];
    for (const [path, raw] of Object.entries(projectFiles)) {
      const slug = slugFromPath(path);
      try {
        const { data } = matter(raw);
        if (!data || !data.title) {
          console.warn(`[content] skipping ${slug}.md: missing title`);
          continue;
        }
        items.push(normalizeProject(data, slug));
      } catch (e) {
        console.warn(`[content] failed to parse ${slug}.md:`, e);
      }
    }
    return items.sort((a, b) => a.order - b.order);
  },
);

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<ProjectFull | null> => {
    return readProjectBySlug(data.slug);
  });

export const getAllProjectSlugs = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    return Object.keys(projectFiles).map(slugFromPath);
  },
);

// Lightweight meta used by sitemap / SEO head.
export interface ProjectMeta {
  title: string;
  description: string;
  hero: string;
  client?: string;
  role?: string;
  category?: string;
  og_image?: string;
}

export const getProjectMeta = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<ProjectMeta | null> => {
    const p = readProjectBySlug(data.slug);
    if (!p) return null;
    return {
      title: p.data.title,
      description: p.data.description,
      hero: p.data.hero,
      client: p.data.client,
      role: p.data.role,
      category: p.data.category,
      og_image: p.data.og_image,
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

export interface AwardItem {
  name: string;
  logo_light: string;
  logo_dark: string;
}

export interface AboutData {
  name: string;
  email: string;
  title: string;
  avatar_url: string;
  short_bio: string;
  what_i_do: string;
  brands: string[];
  awards: AwardItem[];
  career_highlights: CareerHighlight[];
}

export const getAbout = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AboutData | null> => {
    try {
      const aboutRaw = aboutFiles['/public/content/about.md'];
      if (!aboutRaw) {
        console.error('[content] about.md not found in bundle');
        return null;
      }
      const { data, content: bio } = matter(aboutRaw);

      let highlights: any[] = [];
      const chRaw = careerFiles['/public/content/career-highlights.md'];
      if (chRaw) {
        try {
          const parsed = matter(chRaw);
          highlights = parsed.data?.highlights || [];
        } catch {
          highlights = (data as any).career_highlights || [];
        }
      } else {
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
        awards: ((data.awards as any[]) || []).map((a: any) => {
          if (typeof a === 'string') return { name: a, logo_light: '', logo_dark: '' };
          const fallback = a?.logo || '';
          return {
            name: a?.name || '',
            logo_light: a?.logo_light || fallback,
            logo_dark: a?.logo_dark || a?.logo_light || fallback,
          };
        }),
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
