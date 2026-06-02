import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { parseMarkdownContent, type ContentBlock } from '../lib/parseMarkdown';
import { getProject } from '../lib/content.functions';

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
  const fetchProject = useServerFn(getProject);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);

    let cancelled = false;
    (async () => {
      try {
        const result = await fetchProject({ data: { slug } });
        if (cancelled) return;
        if (!result) {
          setProject(null);
          setContent(null);
        } else {
          setProject(result.data as Project);
          setContent(parseMarkdownContent(result.content));
        }
      } catch (e) {
        console.error('Error loading project:', e);
        if (!cancelled) setProject(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, fetchProject]);

  return { project, content, loading };
}
