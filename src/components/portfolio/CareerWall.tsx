import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';
import type { CareerHighlight } from '../../hooks/useAbout';

// Card: -25% width, +25% height vs previous defaults.
// min-h ensures consistent height across cards regardless of content length.
function Card({ h }: { h: CareerHighlight }) {
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
            at {h.role}
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

export default function CareerWall() {
  const { about } = useAbout();
  const reduced = useReducedMotion();

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
  // Reduced spring stiffness for smoother cross-browser rendering (esp. Firefox)
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
  }, [about?.career_highlights.length]);

  if (!about || about.career_highlights.length === 0) return null;

  const highlights = about.career_highlights;

  // Reduced motion fallback: native horizontal scroll with snap.
  // scrollbar-hide keeps it clean on Windows/Chrome where scrollbars are always visible.
  if (reduced) {
    return (
      <section aria-label="Career highlights" className="py-2 -mx-5 md:-mx-8 lg:mx-0">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-5 md:px-8 lg:px-0">
          CAREER HIGHLIGHTS
        </h3>
        <div className="overflow-x-auto snap-x snap-mandatory px-5 md:px-8 lg:px-0 scrollbar-hide">
          <div className="flex gap-premium-md pb-2">
            {highlights.map((h) => (
              <div
                key={h.id}
                className={`snap-start shrink-0 ${CARD_W}`}
              >
                <Card h={h} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Section height: 100svh to enter + scrollable distance.
  // svh unit handles iOS Safari address-bar collapse correctly (vs vh).
  const sectionHeight = mounted && distance > 0
    ? `calc(100svh + ${distance}px)`
    : `${Math.max(1, highlights.length) * 100}svh`;

  return (
    <section
      ref={sectionRef}
      aria-label="Career highlights"
      role="region"
      className="relative -mx-5 md:-mx-8 lg:mx-0"
      style={{ height: sectionHeight }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center"
        style={{
          // pan-y: lets the browser handle vertical scroll natively while
          // Framer Motion drives horizontal translation via scroll progress.
          // This avoids conflicts on iOS where touch events fight between
          // native scroll and JS-driven horizontal movement.
          touchAction: 'pan-y',
          // will-change hint improves compositing on Chrome/Safari.
          // Omitted on Firefox (handled by Framer's own logic).
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-5 md:px-8 lg:px-0">
          CAREER HIGHLIGHTS
        </h3>

        <motion.div
          ref={trackRef}
          style={{ x: mounted ? x : 0 }}
          className="flex gap-premium-md pl-5 md:pl-8 lg:pl-0 pr-[20vw]"
        >
          {highlights.map((h) => (
            <div
              key={h.id}
              className={`shrink-0 ${CARD_W}`}
            >
              <Card h={h} />
            </div>
          ))}
        </motion.div>

        <span className="sr-only">Scroll to reveal more career highlights</span>
      </div>
    </section>
  );
}
