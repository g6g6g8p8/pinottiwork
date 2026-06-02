import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getAbout, type AboutData, type CareerHighlight } from '../lib/content.functions';

export type { CareerHighlight };
export type About = AboutData;

export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchAbout = useServerFn(getAbout);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchAbout();
        if (!cancelled) setAbout(result);
      } catch (e) {
        console.error('Error loading about:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchAbout]);

  return { about, loading };
}
