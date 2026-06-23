import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Project } from '../../hooks/useProject';
import { useProjects } from '../../hooks/useProjects';
import { toSlug, getImageColor } from '../../lib/portfolio-utils';
import guinnessAsset from '../../assets/awards/guinness.png.asset.json';

interface Props {
  current: Project;
}

function MiniCard({ project, imageColor }: { project: Project; imageColor?: string }) {
  const isVideo = project.image_url.endsWith('.mp4') || project.image_url.endsWith('.mov');
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sf-xl bg-foreground/5">
        {isVideo ? (
          <video
            src={project.image_url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            autoPlay loop muted playsInline
            poster={project.image_url.replace(/\.(mp4|mov)$/i, '.jpg')}
          />
        ) : (
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        {project.slug === 'mary-kay-guinness-record' && (
          <img
            src={guinnessAsset.url}
            alt="Guinness World Record"
            className="absolute top-2 right-2 md:top-3 md:right-3 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 4px 14px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.9)',
              background: 'white',
            }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: imageColor
              ? `linear-gradient(to top, ${imageColor}ee 0%, ${imageColor}44 55%, transparent 100%)`
              : 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.07em] text-white/60 mb-1">
            {project.category}
          </p>
          <h2 className="text-[15px] font-bold leading-tight tracking-[-0.01em] text-white">
            {project.title}
          </h2>
        </div>
      </div>
    </Link>
  );
}

function Row({
  label,
  projects,
  imageColors,
}: {
  label: string;
  projects: Project[];
  imageColors: Record<number, string>;
}) {
  if (projects.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[.07em] opacity-60">{label}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <MiniCard key={p.slug} project={p} imageColor={imageColors[p.id]} />
        ))}
      </div>
    </div>
  );
}

export default function RelatedProjects({ current }: Props) {
  const { projects } = useProjects();

  const others = (projects || []).filter((p) => p.slug !== current.slug);
  const sameClient = others
    .filter((p) => toSlug(p.client) === toSlug(current.client) && current.client)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);
  const sameClientSlugs = new Set(sameClient.map((p) => p.slug));
  const sameCategory = others
    .filter(
      (p) =>
        toSlug(p.category) === toSlug(current.category) &&
        current.category &&
        !sameClientSlugs.has(p.slug),
    )
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  const related = [...sameClient, ...sameCategory];

  const [imageColors, setImageColors] = useState<Record<number, string>>({});

  useEffect(() => {
    if (related.length === 0) return;
    let cancelled = false;
    (async () => {
      const colors: Record<number, string> = {};
      for (const p of related) {
        if (p.image_url) colors[p.id] = await getImageColor(p.image_url, 'bottom');
      }
      if (!cancelled) setImageColors(colors);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [related.map((p) => p.id).join(',')]);

  if (!projects || projects.length === 0) return null;
  if (sameClient.length === 0 && sameCategory.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-foreground/10 space-y-10">
      <Row label={`More from ${current.client}`} projects={sameClient} imageColors={imageColors} />
      <Row label={`More in ${current.category}`} projects={sameCategory} imageColors={imageColors} />
    </div>
  );
}
