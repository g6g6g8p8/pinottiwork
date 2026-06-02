import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { X as CloseIcon, Share2 } from 'lucide-react';
import { useAbout } from '../../hooks/useAbout';
import Toast from './Toast';

export default function About() {
  const { about, loading } = useAbout();
  const navigate = useNavigate();
  const [toast, setToast] = React.useState('');

  const handleShare = async () => {
    const shareData = {
      title: about?.name || 'About',
      text: about?.short_bio || '',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground" />
      </div>
    );
  }

  if (!about) return null;

  return (
    <div className="min-h-screen">
      {/* Header bar with back/close */}
      <div className="sticky top-0 z-10 flex justify-between items-center px-5 lg:px-premium-xl py-4 bg-background/80 backdrop-blur-xl">
        <Link
          to="/"
          className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          ← Back
        </Link>
        <button
          onClick={() => navigate({ to: '/' })}
          className="w-8 h-8 flex items-center justify-center rounded-full
            bg-foreground/10 hover:bg-foreground/20
            text-foreground/60 hover:text-foreground transition-colors"
        >
          <CloseIcon size={15} />
        </button>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <div className="px-premium-md md:px-premium-lg lg:px-premium-xl pb-premium-xl max-w-3xl mx-auto">
        <div className="space-y-8">
          {/* Profile */}
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <img src={about.avatar_url} alt="" className="w-16 h-16 rounded-full" loading="lazy" />
              <div>
                <h1 className="text-[22px] leading-[27px]">{about.name}</h1>
                <a href={`mailto:${about.email}`} className="text-body opacity-60">{about.email}</a>
              </div>
            </div>
            <div className="h-px bg-foreground/10 my-4" />
            <h2 className="text-[18px] leading-[22px]">{about.title}</h2>
          </div>

          {/* About me */}
          <div className="bg-card rounded-2xl p-6">
            <h3 className="text-[18px] leading-[22px] mb-4">About me</h3>
            <div className="prose">
              <p className="text-body whitespace-pre-line">{about.short_bio}</p>
            </div>
          </div>

          {/* Career highlights */}
          <div className="space-y-5">
            <h3 className="text-subheadline font-medium opacity-60">CAREER HIGHLIGHTS</h3>
            <div className="bg-card rounded-2xl p-6">
              {about.career_highlights.map((h, index) => (
                <React.Fragment key={h.id}>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={h.logo_url}
                        alt={h.company}
                        className="w-[54px] h-[54px] rounded-[8px] bg-foreground/5"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="text-[22px] leading-[27px] font-semibold">{h.company}</div>
                        <div className="text-[16px] leading-[19px] text-foreground/60">at {h.role}</div>
                      </div>
                    </div>
                    <p className="text-[16px] leading-[24px] text-foreground/80">{h.period}</p>
                  </div>
                  {index < about.career_highlights.length - 1 && (
                    <div className="h-px bg-foreground/10 my-6" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* What I do */}
          <div className="space-y-5">
            <h3 className="text-[14px] leading-[17px] font-medium opacity-60">WHAT I DO</h3>
            <div className="bg-card rounded-2xl p-6">
              <p className="text-body whitespace-pre-line">{about.what_i_do}</p>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-5">
            <h3 className="text-[14px] leading-[17px] font-medium opacity-60">BRANDS I'VE WORKED WITH</h3>
            <div className="bg-card rounded-2xl p-6">
              <div className="flex flex-wrap gap-2">
                {about.brands.map((brand, i) => (
                  <span key={i} className="px-4 py-2 bg-foreground/5 rounded-full text-footnote">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-5">
            <h3 className="text-[14px] leading-[17px] font-medium opacity-60">AWARDS</h3>
            <div className="bg-card rounded-2xl p-6">
              <div className="space-y-3">
                {about.awards.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {a.logo && (
                      <img
                        src={a.logo}
                        alt={a.name}
                        loading="lazy"
                        className="w-8 h-8 object-contain flex-shrink-0"
                      />
                    )}
                    <p className="text-body">{a.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="mt-16 flex items-center justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-foreground/5 rounded-lg text-callout transition-colors"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
