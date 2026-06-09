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

function Card({ h }: { h: CareerHighlight }) {
  return (
    <div
      className="
        bg-card rounded-2xl p-4 h-full w-full
        border border-foreground/5 hover:border-foreground/15
        transition-colors flex flex-col
      "
    >
      <div className="flex items-start gap-3 mb-2">
        <img
          src={h.logo_url}
          alt={h.company}
          loading="lazy"
          className="w-10 h-10 rounded-[8px] bg-foreground/5 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="text-[17px] leading-[22px] font-semibold truncate">
            {h.company}
          </div>
          <div className="text-[13px] leading-[17px] text-foreground/60 truncate">
            at {h.role}
          </div>
        </div>
      </div>
      <p className="text-[13px] leading-[18px] text-foreground/80 flex-1 overflow-hidden">
        {h.period}
      </p>
    </div>
  );
}

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
  const x = useSpring(xRaw, { stiffness: 120, damping: 22, mass: 0.4 });

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

  // Fallback: reduced motion → simple horizontal scroll with snap.
  if (reduced) {
    return (
      <section aria-label="Career highlights" className="py-2 -mx-5 md:-mx-8 lg:mx-0">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-5 md:px-8 lg:px-0">
          CAREER HIGHLIGHTS
        </h3>
        <div className="overflow-x-auto snap-x snap-mandatory px-5 md:px-8 lg:px-0">
          <div className="flex gap-premium-md">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="snap-start shrink-0 w-[78vw] sm:w-[48vw] lg:w-[32vw] aspect-[4/3]"
              >
                <Card h={h} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Section height drives how much vertical scroll is converted into horizontal motion.
  // 1 viewport height to enter + N extra to scroll through. Clamped by actual measured distance.
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
        style={{ touchAction: 'pan-y' }}
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
              className="
                shrink-0
                w-[78vw] sm:w-[48vw] lg:w-[32vw]
                aspect-[4/3]
              "
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
