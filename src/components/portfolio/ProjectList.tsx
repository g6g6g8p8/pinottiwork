import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../hooks/useProject';
import { toSlug } from '../../lib/portfolio-utils';
import guinnessAsset from '../../assets/awards/guinness.png.asset.json';

interface Props {
  kind: 'client' | 'role' | 'category';
  slug: string;
}

const LABEL: Record<Props['kind'], string> = {
  client: 'Client',
  role: 'Role',
  category: 'Category',
};

function pickField(p: Project, kind: Props['kind']): string {
  if (kind === 'client') return p.client;
  if (kind === 'role') return p.role;
  return p.category;
}

export default function ProjectList({ kind, slug }: Props) {
  const { projects, loading } = useProjects();

  const matches = (projects || [])
    .filter((p) => toSlug(pickField(p, kind)) === slug)
    .sort((a, b) => a.order - b.order);

  const displayName = matches[0] ? pickField(matches[0], kind) : slug.replace(/-/g, ' ');

  return (
    <motion.div
      className="p-premium-md md:p-premium-lg lg:px-premium-xl lg:py-premium-xl max-w-[1600px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-8 lg:mb-12">
        <Link
          to="/"
          className="inline-block text-[12px] uppercase tracking-[.07em] opacity-60 hover:opacity-100 transition-opacity mb-4"
        >
          ← All projects
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[.07em] opacity-60 mb-2">
          {LABEL[kind]}
        </p>
        <h1 className="text-[34px] xl:text-[44px] font-bold tracking-[-0.03em] leading-tight capitalize">
          {displayName}
        </h1>
        {!loading && (
          <p className="text-sf-body opacity-60 mt-2">
            {matches.length} {matches.length === 1 ? 'project' : 'projects'}
          </p>
        )}
      </div>

      {matches.length === 0 && !loading ? (
        <p className="opacity-60">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((p) => {
            const isVideo = p.image_url.endsWith('.mp4') || p.image_url.endsWith('.mov');
            return (
              <Link
                key={p.slug}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sf-xl bg-foreground/5">
                  {isVideo ? (
                    <video
                      src={p.image_url}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      autoPlay loop muted playsInline
                      poster={p.image_url.replace(/\.(mp4|mov)$/i, '.jpg')}
                    />
                  ) : (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  {p.slug === 'mary-kay-guinness-record' && (
                    <img
                      src={guinnessAsset.url}
                      alt="Guinness World Record"
                      className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-12 h-12 md:w-16 md:h-16 rounded-full pointer-events-none"
                      style={{
                        boxShadow: '0 4px 14px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.9)',
                        background: 'white',
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[.07em] text-white/60 mb-1">
                      {p.category}
                    </p>
                    <h2 className="text-[18px] font-bold leading-tight tracking-[-0.01em] text-white mb-1">
                      {p.title}
                    </h2>
                    <p className="text-[12px] leading-snug text-white/70 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
