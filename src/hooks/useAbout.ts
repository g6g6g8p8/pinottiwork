import { useState, useEffect } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getAbout, type AboutData, type CareerHighlight } from '../lib/content.functions';
import { useLocale } from '../context/LocaleContext';

export type { CareerHighlight };
export type About = AboutData;

export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchAbout = useServerFn(getAbout);
  const { locale } = useLocale();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchAbout({ data: { locale } });
        if (!cancelled) setAbout(result);
      } catch (e) {
        console.error('Error loading about:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchAbout, locale]);

  return { about, loading };
}
