import { useState, useEffect } from 'react';
import { parseMarkdownContent, type ContentBlock } from '../lib/parseMarkdown';

export interface Project {
  id: number;
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

export function useProject(slug: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<ContentBlock[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);

    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/content/projects/${slug}.json`);
        if (!res.ok) {
          if (!cancelled) { setProject(null); setLoading(false); }
          return;
        }
        const { data, content: body } = await res.json();
        const proj: Project = { ...(data as any), image_url: data.hero };
        if (!cancelled) {
          setProject(proj);
          setContent(parseMarkdownContent(body));
        }
      } catch (e) {
        console.error('Error loading project:', e);
        if (!cancelled) setProject(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { project, content, loading };
}
