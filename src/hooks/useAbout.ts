import { useState, useEffect } from 'react';

export interface CareerHighlight {
  id: number;
  company: string;
  role: string;
  logo_url: string;
  period: string;
  order: number;
}

export interface About {
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

export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [aboutRes, careerHighlightsRes] = await Promise.all([
          fetch('/content/about.json'),
          fetch('/data/career-highlights.json'),
        ]);

        if (!aboutRes.ok) {
          console.error('Failed to load about.json');
          return;
        }

        const careerHighlights = careerHighlightsRes.ok ? await careerHighlightsRes.json() : [];
        const { data, content: bio } = await aboutRes.json();

        const proj: About = {
          name: data.name,
          email: data.email,
          title: data.title,
          avatar_url: data.avatar || data.avatar_url || '',
          short_bio: (bio || '').trim(),
          what_i_do: data.what_i_do || '',
          brands: data.brands || [],
          awards: data.awards || [],
          career_highlights: ((data.career_highlights || careerHighlights || []) as any[])
            .map((h: any, i: number) => ({
              id: h.id || i,
              company: h.company || '',
              role: h.agency || h.role || '',
              logo_url: h.logo || h.logo_url || '',
              period: h.period || h.description || '',
              order: h.order || i,
            }))
            .sort((a: CareerHighlight, b: CareerHighlight) => a.order - b.order),
        };

        if (!cancelled) setAbout(proj);
      } catch (e) {
        console.error('Error loading about:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { about, loading };
}
