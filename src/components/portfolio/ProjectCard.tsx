import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { Project } from '../../hooks/useProject';
import { usePrefetchLink } from '../../lib/prefetch';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsMobile(window.innerWidth < 768);
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
  className?: string;
  forceAspect?: 'hero' | 'card';
  layout?: 'overlay' | 'below';
}

export default function ProjectCard({ project, imageColor, className, forceAspect, layout = 'overlay' }: ProjectCardProps) {
  const isMobile = useIsMobile();
  const prefetchProps = usePrefetchLink(`/projects/${project.slug}`);
  const effectiveLayout = isMobile ? 'overlay' : layout;

  const getAspectRatioClass = () => {
    if (isMobile) return 'aspect-[4/5]';
    if (forceAspect === 'hero') return 'aspect-[5/2]';
    if (forceAspect === 'card') return 'aspect-[4/3]';
    switch (project.aspect_ratio) {
      case '3:4': return 'aspect-[3/4]';
      case '9:4': return 'aspect-[5/2]';
      default:    return 'aspect-[4/3]';
    }
  };

  const isVideo = (url: string) => url.endsWith('.mp4') || url.endsWith('.mov');

  const displayTags = [project.category, project.client].filter(Boolean);

  const cardVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { y: -6, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  const shadowVariants = {
    initial: { boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' },
    hover: {
      boxShadow: imageColor
        ? `0 20px 48px ${imageColor}55, 0 8px 16px rgba(0,0,0,0.15)`
        : '0 20px 48px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.15)',
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.04, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  const mediaEl = isVideo(project.image_url) ? (
    <motion.video
      src={project.image_url}
      className="w-full h-full object-cover z-0"
      variants={imageVariants}
      autoPlay
      loop
      muted
      playsInline
      poster={project.image_url.replace(/\.(mp4|mov)$/i, '.jpg')}
    />
  ) : (
    <motion.img
      src={project.image_url}
      alt={project.title}
      className="w-full h-full object-cover z-0"
      variants={imageVariants}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className={`block ${className || ''}`}
      {...prefetchProps}
    >
      <motion.div
        className="relative"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
      >
        <motion.div
          className="rounded-sf-xl overflow-hidden"
          variants={shadowVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className={`w-full rounded-sf-xl ${getAspectRatioClass()} relative`}>
            {mediaEl}
            {effectiveLayout === 'overlay' && (
              <>
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: isMobile
                      ? (imageColor
                          ? `linear-gradient(to top, ${imageColor}cc 0%, ${imageColor}55 45%, transparent 80%)`
                          : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, transparent 80%)')
                      : (imageColor
                          ? `linear-gradient(to right, ${imageColor}b3 0%, ${imageColor}66 40%, transparent 70%)`
                          : 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, transparent 70%)'),
                  }}
                />
                <div
                  className={
                    isMobile
                      ? 'absolute bottom-0 left-0 p-premium-lg z-20 max-w-[90%]'
                      : 'absolute top-0 left-0 p-premium-lg z-20 max-w-[55%]'
                  }
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[.07em] text-white/70 mb-1">
                    {project.role}
                  </p>
                  <h2 className="text-sf-title-3 text-white mb-2">{project.title}</h2>
                  <p className="text-sf-body text-white/90 mb-premium-md">{project.description}</p>
                  <div className="flex flex-wrap gap-premium-sm">
                    {displayTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[12px] text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {effectiveLayout === 'below' && (
          <div className="pt-premium-md">
            <p className="text-[11px] font-semibold uppercase tracking-[.07em] text-foreground/50 mb-1">
              {project.role}
            </p>
            <h2 className="text-sf-title-3 text-foreground mb-2">{project.title}</h2>
            <p className="text-sf-body text-foreground/70 mb-premium-md">{project.description}</p>
            <div className="flex flex-wrap gap-premium-sm">
              {displayTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-foreground/10 rounded-full text-[12px] text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
