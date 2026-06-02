import { useState, useEffect } from 'react';
import type { Project } from './useProject';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const indexRes = await fetch('/data/projects.json');
        const index = await indexRes.json();
        const slugs: string[] = [...index]
          .sort((a: any, b: any) => a.order - b.order)
          .map((p: any) => p.slug);

        const results = await Promise.all(
          slugs.map(async (slug) => {
            const res = await fetch(`/content/projects/${slug}.json`);
            if (!res.ok) return null;
            const { data } = await res.json();
            return { ...(data as any), image_url: data.hero } as Project;
          })
        );
        if (!cancelled) setProjects(results.filter(Boolean) as Project[]);
      } catch (e) {
        console.error('Error loading projects:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading };
}
