import { createServerFn } from '@tanstack/react-start';
import matter from 'gray-matter';
import type { Locale } from './locale';

// Embed markdown content into the bundle at build time so it works in any
// runtime (Node dev/preview + Cloudflare Workers production). Avoid fs/cwd —
// those only work in the Lovable Node sandbox.
// PT content mirrors the EN tree one-for-one under content/pt/ — same
// filenames, same slugs — so locale selection is just picking which glob
// record to read from, with EN as the fallback if a PT file is missing.
const projectFilesEn = import.meta.glob('/public/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const projectFilesPt = import.meta.glob('/public/content/pt/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const aboutFilesEn = import.meta.glob('/public/content/about.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const aboutFilesPt = import.meta.glob('/public/content/pt/about.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const careerFilesEn = import.meta.glob('/public/content/career-highlights.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const careerFilesPt = import.meta.glob('/public/content/pt/career-highlights.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function projectFiles(locale: Locale) {
  return locale === 'pt' ? projectFilesPt : projectFilesEn;
}

const PROJECT_PATH_PREFIX_EN = '/public/content/projects/';
const PROJECT_PATH_PREFIX_PT = '/public/content/pt/projects/';

function projectPathPrefix(locale: Locale) {
  return locale === 'pt' ? PROJECT_PATH_PREFIX_PT : PROJECT_PATH_PREFIX_EN;
}

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

function slugFromPath(p: string, locale: Locale) {
  return p.slice(projectPathPrefix(locale).length).replace(/\.md$/, '');
}

// Slug -> raw markdown, preferring `locale` but falling back to EN for any
// slug that doesn't have a translation yet (so a missing .pt.md never makes
// a project disappear from the PT site — it just shows in English).
function mergedProjectEntries(locale: Locale): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const [path, raw] of Object.entries(projectFilesEn)) {
    merged[slugFromPath(path, 'en')] = raw;
  }
  if (locale === 'pt') {
    for (const [path, raw] of Object.entries(projectFilesPt)) {
      merged[slugFromPath(path, 'pt')] = raw;
    }
  }
  return merged;
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
    published: raw.published !== false && raw.draft !== true,
  };
}

function readProjectBySlug(slug: string, locale: Locale): ProjectFull | null {
  const safe = safeSlug(slug);
  const raw = mergedProjectEntries(locale)[safe];
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

export const listProjects = createServerFn({ method: 'GET' })
  .inputValidator((d: { locale?: Locale } = {}) => d)
  .handler(async ({ data }): Promise<ProjectData[]> => {
    const locale = data?.locale ?? 'en';
    const items: ProjectData[] = [];
    for (const [slug, raw] of Object.entries(mergedProjectEntries(locale))) {
      try {
        const { data: fm } = matter(raw);
        if (!fm || !fm.title) {
          console.warn(`[content] skipping ${slug}.md: missing title`);
          continue;
        }
        const project = normalizeProject(fm, slug);
        if (!project.published) continue;
        items.push(project);
      } catch (e) {
        console.warn(`[content] failed to parse ${slug}.md:`, e);
      }
    }
    return items.sort((a, b) => a.order - b.order);
  });

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string; locale?: Locale }) => d)
  .handler(async ({ data }): Promise<ProjectFull | null> => {
    const p = readProjectBySlug(data.slug, data.locale ?? 'en');
    if (!p || !p.data.published) return null;
    return p;
  });

export const getAllProjectSlugs = createServerFn({ method: 'GET' }).handler(
  async (): Promise<string[]> => {
    return Object.keys(mergedProjectEntries('en')).filter((slug) => {
      const p = readProjectBySlug(slug, 'en');
      return p?.data.published === true;
    });
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
  .inputValidator((d: { slug: string; locale?: Locale }) => d)
  .handler(async ({ data }): Promise<ProjectMeta | null> => {
    const p = readProjectBySlug(data.slug, data.locale ?? 'en');
    if (!p || !p.data.published) return null;
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
  open_to: string;
  linkedin_url: string;
  resume_url: string;
  avatar_url: string;
  short_bio: string;
  what_i_do: string;
  brands: string[];
  awards: AwardItem[];
  career_highlights: CareerHighlight[];
}

export const getAbout = createServerFn({ method: 'GET' })
  .inputValidator((d: { locale?: Locale } = {}) => d)
  .handler(async ({ data: input }): Promise<AboutData | null> => {
    const locale = input?.locale ?? 'en';
    try {
      const aboutRaw =
        (locale === 'pt' && aboutFilesPt['/public/content/pt/about.md']) ||
        aboutFilesEn['/public/content/about.md'];
      if (!aboutRaw) {
        console.error('[content] about.md not found in bundle');
        return null;
      }
      const { data, content: bio } = matter(aboutRaw);

      let highlights: any[] = [];
      const chRaw =
        (locale === 'pt' && careerFilesPt['/public/content/pt/career-highlights.md']) ||
        careerFilesEn['/public/content/career-highlights.md'];
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
        open_to: data.open_to || '',
        linkedin_url: data.linkedin_url || '',
        resume_url: data.resume_url || '',
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
