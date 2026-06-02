import { useRef, useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';
import { useSearch } from '../../context/SearchContext';
import { getImageColor } from '../../lib/portfolio-utils';
import { deriveCategories } from '../../lib/categories';
import { useProjects } from '../../hooks/useProjects';

export default function Sidebar() {
  const { about } = useAbout();
  const { projects: projectsData } = useProjects();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeColor, setActiveColor] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [imageColors, setImageColors] = useState<Record<number, string>>({});

  const isHome = location.pathname === '/';
  const categories = deriveCategories(projectsData);
  const showDropdown = searchFocused;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return projectsData.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.client?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [searchQuery, projectsData]);

  const suggestions = useMemo(() => {
    if (searchQuery.trim()) return [];
    return projectsData.slice(0, 4);
  }, [searchQuery, projectsData]);

  useEffect(() => {
    let cancelled = false;
    async function loadColor() {
      const firstProject = selectedCategory === 'all'
        ? projectsData[0]
        : projectsData.find((p) => p.category.toLowerCase() === selectedCategory?.toLowerCase());
      if (firstProject) {
        const color = await getImageColor(firstProject.image_url);
        if (!cancelled) setActiveColor(color);
      }
    }
    loadColor();
    return () => { cancelled = true; };
  }, [selectedCategory, projectsData]);

  useEffect(() => {
    let cancelled = false;
    async function loadColors() {
      const colors: Record<number, string> = {};
      const items = searchQuery ? searchResults : suggestions;
      for (const p of items) {
        colors[p.id] = await getImageColor(p.image_url);
      }
      if (!cancelled) setImageColors(colors);
    }
    loadColors();
    return () => { cancelled = true; };
  }, [searchResults, suggestions, searchQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setSearchFocused(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchQuery]);

  function handleResultClick(slug: string) {
    setSearchFocused(false);
    setSearchQuery('');
    navigate({ to: '/projects/$slug', params: { slug } });
  }

  const displayItems = searchQuery ? searchResults : suggestions;

  return (
    <aside className="hidden lg:flex flex-col w-[240px] xl:w-[260px] shrink-0
      sticky top-0 h-screen overflow-y-auto no-scrollbar
      py-6 px-4
      bg-background/70
      backdrop-blur-2xl
      border-r border-foreground/10
      shadow-[1px_0_0_0_rgba(0,0,0,0.04)]">

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
          className="w-full h-8 pl-8 pr-8
            bg-foreground/10
            text-[13px] placeholder:text-foreground/40
            border border-transparent focus:border-border/30
            outline-none transition-all rounded-sf-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 z-10"
          >
            <X size={12} />
          </button>
        )}

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-1.5 z-50
                bg-background
                backdrop-blur-xl rounded-sf-md
                border border-foreground/10
                shadow-[0_8px_32px_rgba(0,0,0,0.18)]
                overflow-hidden"
            >
              <div className="px-3 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[.07em] text-foreground/40">
                  {searchQuery ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}` : 'Suggestions'}
                </p>
              </div>

              {searchQuery && searchResults.length === 0 && (
                <div className="px-3 pb-3 text-[12px] text-foreground/50">
                  No projects found.
                </div>
              )}

              {displayItems.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 px-2 pb-2">
                  {displayItems.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleResultClick(project.slug)}
                      className="group relative rounded-sf-sm overflow-hidden aspect-[4/3]
                        hover:ring-2 hover:ring-white/20 transition-all"
                    >
                      {project.image_url.endsWith('.mp4') || project.image_url.endsWith('.mov') ? (
                        <video
                          src={project.image_url}
                          className="w-full h-full object-cover"
                          autoPlay loop muted playsInline
                        />
                      ) : (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div
                        className="absolute inset-0 flex items-end p-2"
                        style={{
                          background: imageColors[project.id]
                            ? `linear-gradient(to top, ${imageColors[project.id]}cc 0%, transparent 60%)`
                            : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                        }}
                      >
                        <p className="text-[11px] font-medium text-white leading-tight line-clamp-2">
                          {project.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isHome && (
        <nav>
          <p className="text-[11px] font-semibold uppercase tracking-[.07em] text-foreground/40 mb-1.5 px-2">
            Work
          </p>
          <ul className="space-y-0.5">
            {categories.map((cat) => {
              const count = cat.count;
              const isActive = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <li key={cat.id}>
                  <motion.button
                    onClick={() => setSelectedCategory(cat.id)}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-sf-sm text-left
                      transition-all duration-200
                      ${isActive
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                      }`}
                    style={isActive && activeColor ? { backgroundColor: `${activeColor}22` } : {}}
                  >
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      style={isActive && activeColor ? { color: activeColor } : {}}
                      className={!isActive ? 'text-foreground/50' : ''}
                    />
                    <span className={`text-[13px] flex-1 ${isActive ? 'font-medium' : ''}`}>
                      {cat.name}
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] text-foreground/35 tabular-nums">{count}</span>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="flex-1" />

      <div className="mt-6 pt-4 border-t border-foreground/10">
        <Link
          to="/about"
          className="flex items-center gap-3 group px-1 py-1 rounded-sf-md
            hover:bg-foreground/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0
            ring-1 ring-foreground/10
            group-hover:ring-foreground/20 transition-all">
            {about?.avatar_url
              ? <img src={about.avatar_url} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-foreground/10" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight truncate">Giulio Pinotti</p>
            <p className="text-[11px] text-foreground/50 leading-tight truncate">Creative Director</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
