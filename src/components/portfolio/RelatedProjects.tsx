import { Link } from '@tanstack/react-router';
import type { Project } from '../../hooks/useProject';
import { useProjects } from '../../hooks/useProjects';
import { toSlug } from '../../lib/portfolio-utils';
import guinnessAsset from '../../assets/awards/guinness.png.asset.json';

interface Props {
  current: Project;
}

function MiniCard({ project }: { project: Project }) {
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.07em] text-white/60 mb-1">
            {project.category}
          </p>
          <h3 className="text-[15px] font-bold leading-tight tracking-[-0.01em] text-white">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function Row({ label, projects }: { label: string; projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[.07em] opacity-60">{label}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <MiniCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}

export default function RelatedProjects({ current }: Props) {
  const { projects } = useProjects();
  if (!projects || projects.length === 0) return null;

  const others = projects.filter((p) => p.slug !== current.slug);
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

  if (sameClient.length === 0 && sameCategory.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-foreground/10 space-y-10">
      <Row label={`More from ${current.client}`} projects={sameClient} />
      <Row label={`More in ${current.category}`} projects={sameCategory} />
    </div>
  );
}
