import {
  LayoutGrid, Tag, FileText,
  Megaphone, Pen, Film,
  Monitor, Camera, LayoutPanelTop, HeartHandshake, Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Project } from '../hooks/useProject';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'all':             LayoutGrid,
  'branding':        Tag,
  'content':         FileText,
  'content system':  LayoutPanelTop,
  'creative ops':    Workflow,
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

const CATEGORY_ORDER = [
  'creative ops',
  'content',
  'social impact',
  'branded content',
  'advertising',
  'branding',
];

export function deriveCategories(projects: Project[]): Category[] {
  const ordered: Category[] = [];

  ordered.push({
    id: 'all',
    name: 'Selected Works',
    count: projects.length,
    icon: CATEGORY_ICONS['all'],
  });

  const byId = new Map<string, Project[]>();
  for (const p of projects) {
    const id = p.category.toLowerCase();
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id)!.push(p);
  }

  const seen = new Set<string>();
  for (const id of CATEGORY_ORDER) {
    const list = byId.get(id);
    if (!list?.length) continue;
    seen.add(id);
    ordered.push({
      id,
      name: list[0].category,
      count: list.length,
      icon: CATEGORY_ICONS[id] ?? FileText,
    });
  }

  // Fallback: any unknown categories appended at the end, sorted by project order.
  const leftovers = [...byId.entries()]
    .filter(([id]) => !seen.has(id))
    .sort((a, b) => a[1][0].order - b[1][0].order);
  for (const [id, list] of leftovers) {
    ordered.push({
      id,
      name: list[0].category,
      count: list.length,
      icon: CATEGORY_ICONS[id] ?? FileText,
    });
  }

  return ordered;
}
