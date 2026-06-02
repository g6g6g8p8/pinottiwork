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
}

export default function ProjectCard({ project, imageColor, className, forceAspect }: ProjectCardProps) {
  const isMobile = useIsMobile();
  const prefetchProps = usePrefetchLink(`/projects/${project.slug}`);

  const getAspectRatioClass = () => {
    if (isMobile) return 'aspect-[4/5]';
    if (forceAspect === 'hero') return 'aspect-[5/2]';
    if (forceAspect === 'card') return 'aspect-[4/5]';
    switch (project.aspect_ratio) {
      case '3:4': return 'aspect-[3/4]';
      case '9:4': return 'aspect-[5/2]';
      default:    return 'aspect-[4/5]';
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
            {isVideo(project.image_url) ? (
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
            )}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: imageColor
                  ? `linear-gradient(to top, ${imageColor}cc 0%, ${imageColor}22 60%, transparent 100%)`
                  : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-premium-lg z-20 glass-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[.07em] text-white/60 mb-1">
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
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
