import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { X as CloseIcon, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProject } from '../../hooks/useProject';
import { getImageColor, toSlug } from '../../lib/portfolio-utils';
import Portal from './Portal';
import { SkeletonDetail } from './Skeleton';
import Toast from './Toast';
import RelatedProjects from './RelatedProjects';
import type { ContentBlock } from '../../lib/parseMarkdown';

export default function ProjectDetail() {
  const { slug } = useParams({ from: '/projects/$slug' });
  const { project, content, loading } = useProject(slug);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({});
  const [toast, setToast] = useState('');
  const [imageColor, setImageColor] = useState<string>('');
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (project?.image_url) {
      getImageColor(project.image_url, 'bottom').then(setImageColor);
    }
  }, [project?.image_url]);

  const handleShare = async () => {
    if (!project) return;
    const shareData = {
      title: project.title,
      text: project.description,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setToast('Link copied!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSlideChange = (contentId: number, direction: 'prev' | 'next', total: number) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [contentId]: (((prev[contentId] || 0) + (direction === 'next' ? 1 : -1)) + total) % total,
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent, contentId: number, total: number) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      handleSlideChange(contentId, diff > 0 ? 'next' : 'prev', total);
      touchStart.current = null;
    }
  };

  const handleTouchEnd = () => { touchStart.current = null; };

  const renderContent = (section: ContentBlock) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="project-prose text-body max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.content.text ?? ''}
            </ReactMarkdown>
          </div>
        );

      case 'gallery': {
        const gallery = section.content.gallery || [];
        const currentIndex = currentSlide[section.order] || 0;

        return (
          <div className="relative -mx-5 lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden lg:rounded-sf-xl">
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, section.order, gallery.length)}
                onTouchEnd={handleTouchEnd}
              >
                {gallery.map((media, index) => {
                  const isVideo = media.endsWith('.mp4') || media.endsWith('.mov');
                  return isVideo ? (
                    <video
                      key={index}
                      src={media}
                      className="w-full h-full object-cover flex-shrink-0"
                      autoPlay loop muted playsInline
                      poster={media.replace(/\.(mp4|mov)$/i, '.jpg')}
                    />
                  ) : (
                    <img
                      key={index}
                      src={media}
                      alt={`Gallery media ${index + 1}`}
                      className="w-full h-full object-cover flex-shrink-0"
                      loading="lazy"
                      sizes="100vw"
                    />
                  );
                })}
              </div>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => handleSlideChange(section.order, 'prev', gallery.length)}
                    className="absolute left-5 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-black/60 transition-colors"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleSlideChange(section.order, 'next', gallery.length)}
                    className="absolute right-5 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full glass hover:bg-black/60 transition-colors"
                    aria-label="Next media"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {gallery.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }

      case 'video': {
        const videoSrc = section.content.url || '';
        const autoplay = Boolean(section.content.autoplay);
        const isVideoUrl = videoSrc.endsWith('.mp4') || videoSrc.endsWith('.mov');
        const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');
        const isVimeo = videoSrc.includes('vimeo.com');
        let videoUrl = videoSrc;

        if (isYouTube) {
          const ytId =
            videoSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/)?.[1] || '';
          const params = new URLSearchParams({
            controls: '1',
            rel: '0',
            modestbranding: '1',
            showinfo: '0',
          });
          if (autoplay) {
            params.set('autoplay', '1');
            params.set('mute', '1');
            params.set('loop', '1');
            params.set('playlist', ytId);
          }
          videoUrl = `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
        } else if (isVimeo) {
          const vimeoId = videoSrc.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] || '';
          const params = new URLSearchParams({
            title: '0',
            byline: '0',
            portrait: '0',
          });
          if (autoplay) {
            params.set('autoplay', '1');
            params.set('muted', '1');
            params.set('loop', '1');
          }
          videoUrl = `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
        }

        return (
          <div className="space-y-4">
            {section.content.title && (
              <h3 className="text-sf-headline">{section.content.title}</h3>
            )}
            <div className="relative w-full overflow-hidden rounded-sf-xl">
              {isVideoUrl ? (
                <video
                  src={videoSrc}
                  className="w-full h-full"
                  autoPlay loop muted playsInline
                  poster={videoSrc.replace(/\.(mp4|mov)$/i, '.jpg')}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={videoUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-sf-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={section.content.title || 'Video'}
                  />
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'image': {
        return (
          <div className="relative -mx-5 lg:mx-0">
            <img
              src={section.content.url}
              alt={section.content.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      }

      case 'stats': {
        const stats = section.content.stats || [];
        const cols = stats.length <= 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4';
        return (
          <div className={`grid ${cols} divide-x divide-border border-y border-border py-6`}>
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center px-4 py-2 text-center first:pl-0 last:pr-0">
                <span className="text-[36px] md:text-[44px] font-bold leading-none tracking-[-0.03em] text-foreground">{stat.value}</span>
                <span className="mt-2 text-[11px] font-semibold uppercase tracking-[.07em] text-foreground/50">{stat.label}</span>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (loading) return <SkeletonDetail />;

  if (!project || !content) {
    return (
      <div className="p-5 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-title-2 mb-4">Project not found</h1>
        <Link to="/" className="text-body opacity-60 hover:opacity-100 transition-opacity inline-flex items-center gap-2">
          <CloseIcon size={20} />
          Back to projects
        </Link>
      </div>
    );
  }

  const isVideo = project.image_url.endsWith('.mp4') || project.image_url.endsWith('.mov');

  return (
    <div className="lg:min-h-screen">
      <Portal>
        <button
          onClick={() => navigate({ to: '/' })}
          className="fixed top-6 right-6 z-[100] w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-colors"
        >
          <CloseIcon size={17} />
        </button>
      </Portal>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <div className="lg:grid lg:grid-cols-[42%_58%] lg:gap-0 lg:min-h-screen">
        {/* Left col - poster */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:flex lg:items-stretch lg:px-[2.625rem] lg:py-[2.625rem] 2xl:py-20">
          <div className="lg:w-full lg:h-full lg:flex lg:justify-center">
            <div className="aspect-[4/5] w-full lg:aspect-auto lg:h-full lg:w-auto lg:max-w-full overflow-hidden lg:rounded-sf-xl relative">
              {isVideo ? (
                <video
                  src={project.image_url}
                  className="w-full h-full object-cover"
                  autoPlay loop muted playsInline
                  poster={project.image_url.replace(/\.(mp4|mov)$/i, '.jpg')}
                />
              ) : (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
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
              <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                <p className="text-[11px] font-semibold uppercase tracking-[.07em] text-white/60 mb-1">{project.client}</p>
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-white mb-2">{project.title}</h2>
                <p className="text-[14px] leading-[20px] text-white/80 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.category && (
                    <Link
                      to="/categories/$category"
                      params={{ category: toSlug(project.category) }}
                      className="px-3 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-[12px] text-white/90 transition-colors"
                    >
                      {project.category}
                    </Link>
                  )}
                  {project.role && (
                    <Link
                      to="/roles/$role"
                      params={{ role: toSlug(project.role) }}
                      className="px-3 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-[12px] text-white/90 transition-colors"
                    >
                      {project.role}
                    </Link>
                  )}
                  {project.client && (
                    <Link
                      to="/clients/$client"
                      params={{ client: toSlug(project.client) }}
                      className="px-3 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-[12px] text-white/90 transition-colors"
                    >
                      {project.client}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right col - content */}
        <div className="px-5 lg:px-[2.625rem] mt-6 lg:mt-0 lg:py-[2.625rem]">
          <div className="space-y-8">
            {content.map((section, index) => (
              <div key={index} className="space-y-4">
                {renderContent(section)}
              </div>
            ))}

            <RelatedProjects current={project} />


            <div className="mt-16 flex items-center justify-center lg:hidden">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-foreground/5 rounded-lg text-callout transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
            <div className="mb-5 lg:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
