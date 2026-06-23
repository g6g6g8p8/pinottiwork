import { useRef, useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';
import SidebarAwards from './SidebarAwards';
import { useSearch } from '../../context/SearchContext';
import { getImageColor } from '../../lib/portfolio-utils';
import { deriveCategories } from '../../lib/categories';
import { useProjects } from '../../hooks/useProjects';

type SuggestionType = 'project' | 'client' | 'category' | 'tag';

interface Suggestion {
  key: string;
  label: string;
  type: SuggestionType;
  normalized: string;
  slug?: string;
  subtitle?: string;
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

const TYPE_LABEL: Record<SuggestionType, string> = {
  project: 'Project',
  client: 'Client',
  category: 'Category',
  tag: 'Tag',
};

export default function Sidebar() {
  const { about } = useAbout();
  const { projects: projectsData } = useProjects();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeColor, setActiveColor] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isHome = location.pathname === '/';
  const categories = deriveCategories(projectsData);
  const showDropdown = searchFocused;

  // Build flat suggestion index from projects
  const index = useMemo<Suggestion[]>(() => {
    const out: Suggestion[] = [];
    const seen = new Set<string>();
    const push = (label: string, type: SuggestionType, extra: Partial<Suggestion> = {}) => {
      if (!label) return;
      const key = `${type}:${label.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ key, label, type, normalized: normalize(label), ...extra });
    };
    for (const p of projectsData) {
      push(p.title, 'project', {
        slug: p.slug,
        subtitle: [p.client, p.category].filter(Boolean).join(' — '),
      });
      if (p.client) push(p.client, 'client');
      if (p.category) push(p.category, 'category');
      if (Array.isArray(p.tags)) for (const t of p.tags) push(t, 'tag');
    }
    return out;
  }, [projectsData]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = normalize(searchQuery.trim());
    if (!q) {
      // Empty state: a mix of projects, clients, categories
      const projects = index.filter((s) => s.type === 'project').slice(0, 4);
      const clients = index.filter((s) => s.type === 'client').slice(0, 2);
      const cats = index.filter((s) => s.type === 'category').slice(0, 2);
      return [...projects, ...clients, ...cats].slice(0, 8);
    }
    const prefix: Suggestion[] = [];
    const sub: Suggestion[] = [];
    for (const s of index) {
      const i = s.normalized.indexOf(q);
      if (i === 0) prefix.push(s);
      else if (i > 0) sub.push(s);
    }
    const rank = (t: SuggestionType) =>
      t === 'project' ? 0 : t === 'client' ? 1 : t === 'category' ? 2 : 3;
    const sorter = (a: Suggestion, b: Suggestion) =>
      rank(a.type) - rank(b.type) || a.label.localeCompare(b.label);
    return [...prefix.sort(sorter), ...sub.sort(sorter)].slice(0, 8);
  }, [searchQuery, index]);

  useEffect(() => { setActiveIndex(0); }, [searchQuery, searchFocused]);

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

  function commitSuggestion(s: Suggestion) {
    setSearchFocused(false);
    if (s.type === 'project' && s.slug) {
      setSearchQuery('');
      navigate({ to: '/projects/$slug', params: { slug: s.slug } });
      return;
    }
    if (s.type === 'category') {
      const match = categories.find((c) => c.name.toLowerCase() === s.label.toLowerCase());
      if (match) setSelectedCategory(match.id);
      setSearchQuery('');
      if (location.pathname !== '/') navigate({ to: '/' });
      return;
    }
    // client or tag → filter list by text
    setSearchQuery(s.label);
    if (location.pathname !== '/') navigate({ to: '/' });
  }

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

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = suggestions[activeIndex];
      if (pick) commitSuggestion(pick);
    }
  }

  function renderHighlight(label: string) {
    const q = searchQuery.trim();
    if (!q) return label;
    const nl = normalize(label);
    const nq = normalize(q);
    const i = nl.indexOf(nq);
    if (i < 0) return label;
    return (
      <>
        {label.slice(0, i)}
        <strong className="font-semibold text-foreground">{label.slice(i, i + q.length)}</strong>
        {label.slice(i + q.length)}
      </>
    );
  }

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
          onKeyDown={handleInputKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="sidebar-search-listbox"
          aria-activedescendant={
            showDropdown && suggestions[activeIndex]
              ? `sidebar-sugg-${suggestions[activeIndex].key}`
              : undefined
          }
          className="w-full h-8 pl-8 pr-8
            bg-foreground/10
            text-[13px] placeholder:text-foreground/60
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
              <div className="px-3 pt-2.5 pb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[.07em] text-foreground/40">
                  {searchQuery.trim()
                    ? `${suggestions.length} result${suggestions.length !== 1 ? 's' : ''}`
                    : 'Suggestions'}
                </p>
              </div>

              {suggestions.length === 0 ? (
                <div className="px-3 pb-3 text-[12px] text-foreground/50">
                  No matches.
                </div>
              ) : (
                <ul
                  id="sidebar-search-listbox"
                  role="listbox"
                  className="pb-1.5"
                >
                  {suggestions.map((s, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <li key={s.key} role="none">
                        <button
                          id={`sidebar-sugg-${s.key}`}
                          role="option"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveIndex(i)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => commitSuggestion(s)}
                          className={`group w-full flex items-center gap-2 px-3 py-1.5 text-left
                            transition-colors
                            ${isActive ? 'bg-foreground/8' : 'hover:bg-foreground/5'}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-foreground/70 truncate leading-tight">
                              {renderHighlight(s.label)}
                            </p>
                            {s.subtitle && (
                              <p className="text-[11px] text-foreground/40 truncate leading-tight mt-0.5">
                                {s.subtitle}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] uppercase tracking-[.06em] text-foreground/35 shrink-0">
                            {TYPE_LABEL[s.type]}
                          </span>
                          <ArrowRight
                            size={12}
                            className={`shrink-0 transition-opacity ${isActive ? 'opacity-60' : 'opacity-0'}`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
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
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="flex-1" />

      {isHome && <SidebarAwards />}

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
