import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { UserCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';
import { usePrefetchLink } from '../../lib/prefetch';
import FeaturedProjects from './FeaturedProjects';
import { useSearch } from '../../context/SearchContext';
import { deriveCategories } from '../../lib/categories';
import { useProjects } from '../../hooks/useProjects';

export default function Home() {
  const { about } = useAbout();
  const { selectedCategory } = useSearch();
  const { projects } = useProjects();
  const categories = deriveCategories(projects);
  const aboutPrefetch = usePrefetchLink('/about');

  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const titleOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const titleY = useTransform(scrollY, [0, 120], [0, -12]);

  const headerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      className="p-premium-md md:p-premium-lg lg:px-premium-xl lg:pt-2 lg:pb-premium-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      
      {/* Header mobile */}
      <div className="lg:hidden sticky top-0 z-40 -mx-5 md:-mx-8 px-5 md:px-8 py-3
        bg-background/95 backdrop-blur-xl
        border-b border-foreground/10">
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[25px] leading-[30px] font-semibold tracking-[-.021em]">
              Giulio Pinotti,
            </Link>
            <span className="text-[20px] leading-[25px] tracking-[-.021em] text-foreground/60">
              Creative Director
            </span>
          </div>
          <Link
            to="/about"
            aria-label="About"
            className="w-9 h-9 flex items-center justify-center rounded-full overflow-hidden shrink-0"
            {...aboutPrefetch}
          >
            {about?.avatar_url
              ? <img src={about.avatar_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              : <UserCircle size={22} className="opacity-60" />
            }
          </Link>
        </motion.div>
      </div>

      {/* Big title */}
      <motion.div
        ref={titleRef}
        className="pt-3 pb-6"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        <motion.h1
          key={`title-${selectedCategory}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
          className="text-[28px] md:text-[34px] xl:text-[40px] font-bold tracking-[-0.03em] leading-tight"
        >
          {selectedCategory === 'all' || !selectedCategory
            ? 'Selected Works'
            : categories.find((c) => c.id === selectedCategory)?.name ?? 'Work'}
        </motion.h1>
      </motion.div>

      <div className="mt-4 lg:mt-0">
        <FeaturedProjects />
      </div>
    </motion.div>
  );
}
