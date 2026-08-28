import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';
import type { CareerHighlight } from '../../hooks/useAbout';
import { useLocale } from '../../context/LocaleContext';
import { t } from '../../lib/i18n-strings';

// Card: -25% width, +25% height vs previous defaults.
// min-h ensures consistent height across cards regardless of content length.
function Card({ h, at }: { h: CareerHighlight; at: string }) {
  return (
    <div
      className="
        bg-card rounded-2xl p-4 h-full w-full min-h-[200px] md:min-h-[240px]
        border border-foreground/5 hover:border-foreground/15
        transition-colors flex flex-col
      "
    >
      <div className="flex items-start gap-3 md:gap-4 mb-3">
        <img
          src={h.logo_url}
          alt={h.company}
          loading="lazy"
          className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] bg-foreground/5 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="text-[17px] leading-[22px] md:text-[20px] md:leading-[25px] lg:text-[22px] lg:leading-[27px] font-semibold truncate">
            {h.company}
          </div>
          <div className="text-[13px] leading-[17px] md:text-[15px] md:leading-[19px] text-foreground/60 truncate">
            {at} {h.role}
          </div>
        </div>
      </div>
      <p className="text-[13px] leading-[18px] md:text-[15px] md:leading-[21px] text-foreground/80 flex-1">
        {h.period}
      </p>
    </div>
  );
}

// Card widths: -25% from original (78→58, 48→36, 32→24)
const CARD_W = 'w-[58vw] sm:w-[36vw] lg:w-[18vw] lg:min-w-[260px]';

// Mobile/tablet: native horizontal scroll with snap.
// Avoids the sticky scroll-jack pattern which locks up on iOS Safari.
function MobileHighlights({ highlights, strings }: { highlights: CareerHighlight[]; strings: ReturnType<typeof t> }) {
  return (
    <section aria-label={strings.careerHighlights} className="py-2 -mx-5 md:-mx-8 lg:mx-0">
      <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-5 md:px-8 lg:px-0">
        {strings.careerHighlights}
      </h3>
      <div className="overflow-x-auto snap-x snap-mandatory px-5 md:px-8 lg:px-0 scrollbar-hide">
        <div className="flex gap-premium-md pb-2">
          {highlights.map((h) => (
            <div key={h.id} className={`snap-start shrink-0 ${CARD_W}`}>
              <Card h={h} at={strings.at} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Desktop only: sticky scroll-jack driven by vertical scroll.
// Only mounted after hydration so the Framer Motion scroll hooks only run on the client
// with a real DOM element and a stable layout, preventing SSR/hydration mismatch errors.
function DesktopScrollJack({ highlights, strings }: { highlights: CareerHighlight[]; strings: ReturnType<typeof t> }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(xRaw, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current;
      const tr = trackRef.current;
      if (!vp || !tr) return;
      const d = Math.max(0, tr.scrollWidth - vp.clientWidth);
      setDistance(d);
      setMounted(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [highlights.length]);

  const sectionHeight = mounted && distance > 0
    ? `calc(100svh + ${distance}px)`
    : `${Math.max(1, highlights.length) * 100}svh`;

  return (
    <section
      ref={sectionRef}
      aria-label={strings.careerHighlights}
      role="region"
      className="relative -mx-5 md:-mx-8 lg:mx-0"
      style={{ height: sectionHeight }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center"
        style={{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-5 md:px-8 lg:px-0">
          {strings.careerHighlights}
        </h3>

        <motion.div
          ref={trackRef}
          style={{ x: mounted ? x : 0 }}
          className="flex gap-premium-md pl-5 md:pl-8 lg:pl-0 pr-[20vw]"
        >
          {highlights.map((h) => (
            <div key={h.id} className={`shrink-0 ${CARD_W}`}>
              <Card h={h} at={strings.at} />
            </div>
          ))}
        </motion.div>

        <span className="sr-only">{strings.scrollForMore}</span>
      </div>
    </section>
  );
}

export default function CareerWall() {
  const { about } = useAbout();
  const { locale } = useLocale();
  const strings = t(locale);
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop after hydration so the server and initial client render match.
  // The desktop scroll-jack only mounts on large viewports and when reduced motion is off.
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  if (!about || about.career_highlights.length === 0) return null;

  const highlights = about.career_highlights;

  if (!isDesktop || reduced) {
    return <MobileHighlights highlights={highlights} strings={strings} />;
  }

  return <DesktopScrollJack highlights={highlights} strings={strings} />;
}
