import {
  LayoutGrid, Tag, FileText,
  Megaphone, Pen, Film,
  Monitor, Camera, LayoutPanelTop, HeartHandshake,
  type LucideIcon,
} from 'lucide-react';
import type { Project } from '../hooks/useProject';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'all':             LayoutGrid,
  'branding':        Tag,
  'content':         FileText,
  'content system':  LayoutPanelTop,
  'advertising':     Megaphone,
  'social impact':   HeartHandshake,
  'design':          Pen,
  'branded content': Film,
  'digital':         Monitor,
  'photography':     Camera,
};

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
}

export function deriveCategories(projects: Project[]): Category[] {
  const seen = new Set<string>();
  const ordered: Category[] = [];

  ordered.push({
    id: 'all',
    name: 'Selected Works',
    count: projects.length,
    icon: CATEGORY_ICONS['all'],
  });

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  for (const project of sorted) {
    const id = project.category.toLowerCase();
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push({
        id,
        name: project.category,
        count: projects.filter((p) => p.category.toLowerCase() === id).length,
        icon: CATEGORY_ICONS[id] ?? FileText,
      });
    }
  }

  return ordered;
}
