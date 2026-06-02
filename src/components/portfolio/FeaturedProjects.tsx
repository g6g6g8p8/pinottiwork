import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import { getImageColor } from '../../lib/portfolio-utils';
import { useSearch } from '../../context/SearchContext';
import ProjectCard from './ProjectCard';

async function fetchHomeLayout(): Promise<Array<{ slot: string; slugs: string[] }>> {
  try {
    const res = await fetch('/data/home-layout.md');
    const text = await res.text();
    return text
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .map((line) => {
        const parts = line.split('|').map((s) => s.trim()).filter(Boolean);
        return { slot: parts[0], slugs: parts.slice(1) };
      })
      .filter((r) => r.slot && r.slugs.length > 0);
  } catch {
    return [];
  }
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export default function FeaturedProjects() {
  const { projects } = useProjects();
  const { selectedCategory, searchQuery } = useSearch();
  const [imageColors, setImageColors] = useState<Record<number, string>>({});
  const [layout, setLayout] = useState<Array<{ slot: string; slugs: string[] }>>([]);

  useEffect(() => {
    fetchHomeLayout().then(setLayout);
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    let cancelled = false;
    async function loadColors() {
      const colors: Record<number, string> = {};
      for (const p of projects) {
        if (p.image_url) colors[p.id] = await getImageColor(p.image_url);
      }
      if (!cancelled) setImageColors(colors);
    }
    loadColors();
    return () => { cancelled = true; };
  }, [projects]);

  const projectMap = useMemo(() => {
    const map: Record<string, typeof projects[0]> = {};
    for (const p of projects) map[p.slug] = p;
    return map;
  }, [projects]);

  const isFiltered = (selectedCategory && selectedCategory !== 'all') || searchQuery.trim();

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, selectedCategory, searchQuery]);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 rounded-sf-xl bg-foreground/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[17px] font-semibold mb-1">No results</p>
        <p className="text-[14px] text-foreground/50">Try a different search or category.</p>
      </div>
    );
  }

  if (isFiltered) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-premium-md md:gap-premium-lg"
        initial="initial"
        animate="animate"
        key={`${selectedCategory}-${searchQuery}`}
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        {filteredProjects.map((p) => (
          <motion.div key={p.id} variants={itemVariants}>
            <ProjectCard project={p} imageColor={imageColors[p.id]} forceAspect="card" layout="below" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-premium-md md:gap-premium-lg"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      {layout.map((row, i) => {
        const cards = row.slugs.map((s) => projectMap[s]).filter(Boolean);
        if (cards.length === 0) return null;
        const isFirstRow = i === 0;

        if (row.slot === 'hero') {
          const p = cards[0];
          return (
            <motion.div key={i} variants={itemVariants}>
              <ProjectCard project={p} imageColor={imageColors[p.id]} forceAspect="hero" priority={isFirstRow} />
            </motion.div>
          );
        }

        if (row.slot === 'duo') {
          return (
            <motion.div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-premium-md md:gap-premium-lg"
              variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
            >
              {cards.map((p, idx) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProjectCard project={p} imageColor={imageColors[p.id]} forceAspect="card" layout="below" priority={isFirstRow && idx === 0} />
                </motion.div>
              ))}
            </motion.div>
          );
        }

        return (
          <motion.div key={i} variants={itemVariants}>
            <ProjectCard project={cards[0]} imageColor={imageColors[cards[0].id]} forceAspect="card" layout="below" priority={isFirstRow} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
