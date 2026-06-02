import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import type { Project } from './useProject';
import { listProjects } from '../lib/content.functions';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProjects = useServerFn(listProjects);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchProjects();
        if (!cancelled) setProjects((result || []) as Project[]);
      } catch (e) {
        console.error('Error loading projects:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchProjects]);

  return { projects, loading };
}
