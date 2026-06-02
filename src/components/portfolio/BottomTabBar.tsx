import { useRef } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../context/SearchContext';
import { deriveCategories } from '../../lib/categories';
import { useProjects } from '../../hooks/useProjects';
import Portal from './Portal';

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, searchOpen, setSearchOpen } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { projects } = useProjects();
  const categories = deriveCategories(projects);

  const isHome = location.pathname === '/';
  if (!isHome) return null;

  function handleSearch(q: string) {
    setSearchQuery(q);
    if (location.pathname !== '/') navigate({ to: '/' });
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
  }

  return (
    <Portal>
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeSearch}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-x-4 top-[20%] z-[96] lg:hidden
                bg-background
                backdrop-blur-xl rounded-sf-xl
                border border-foreground/10
                shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-4 border-b border-foreground/10">
                <Search size={17} className="text-foreground/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Projects, clients, categories..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 text-[17px] bg-transparent outline-none placeholder:text-foreground/30"
                />
                {searchQuery ? (
                  <button
                    onClick={() => handleSearch('')}
                    className="text-[13px] font-medium text-foreground/50 hover:text-foreground shrink-0"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={closeSearch}
                    className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {!searchQuery && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[.06em] text-foreground/40 mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          closeSearch();
                        }}
                        className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors
                          ${selectedCategory === cat.id
                            ? 'bg-foreground/90 text-background'
                            : 'bg-foreground/10 text-foreground/70'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className="fixed left-3 right-3 z-[90] lg:hidden"
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
          className="flex items-center
            bg-background/85
            backdrop-blur-xl
            rounded-full
            border border-foreground/10
            shadow-[0_8px_32px_rgba(0,0,0,0.18)]
            px-2 py-2"
        >
          <div className="flex items-stretch w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id && !searchOpen;
              const Icon = cat.icon;
              const shortName =
                cat.name === 'All Projects' ? 'All'
                : cat.name === 'Branded Content' ? 'Branded C.'
                : cat.name === 'Advertising' ? 'Advertis.'
                : cat.name === 'Photography' ? 'Photo'
                : cat.name;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (location.pathname !== '/') navigate({ to: '/' });
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-[3px] px-1 py-1
                    transition-all duration-200
                    ${isActive ? 'text-foreground' : 'text-foreground/40'}`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
                  <span className="text-[10px] font-medium leading-none truncate max-w-full">
                    {shortName}
                  </span>
                </motion.button>
              );
            })}
          </div>

        </motion.div>
      </div>
    </Portal>
  );
}
