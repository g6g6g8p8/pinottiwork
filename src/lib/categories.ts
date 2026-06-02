import {
  LayoutGrid, Tag, FileText,
  Megaphone, Pen, Film,
  Monitor, Camera, type LucideIcon,
} from 'lucide-react';
import type { Project } from '../hooks/useProject';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'all':             LayoutGrid,
  'branding':        Tag,
  'content':         FileText,
  'advertising':     Megaphone,
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
    name: 'All Projects',
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
