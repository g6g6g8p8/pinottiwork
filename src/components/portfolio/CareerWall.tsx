import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';

export default function CareerWall() {
  const { about } = useAbout();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(false);
  const [distance, setDistance] = useState(0); // px the track needs to translate
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const recompute = () => {
      const d = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDistance(d);
    };
    recompute();
    window.addEventListener('resize', recompute);
    const ro = new ResizeObserver(recompute);
    ro.observe(track);
    ro.observe(viewport);
    return () => {
      window.removeEventListener('resize', recompute);
      ro.disconnect();
    };
  }, [about, reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const fallbackX = useMotionValue(0);
  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = reduced ? fallbackX : xTransform;

  if (!about || about.career_highlights.length === 0) return null;

  const cards = about.career_highlights.map((h) => (
    <div
      key={h.id}
      className="
        shrink-0 w-[320px] aspect-[4/3]
        bg-card rounded-2xl p-6
        border border-foreground/5 hover:border-foreground/15
        transition-colors flex flex-col
      "
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={h.logo_url}
          alt={h.company}
          loading="lazy"
          className="w-[54px] h-[54px] rounded-[8px] bg-foreground/5 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="text-[22px] leading-[27px] font-semibold truncate">{h.company}</div>
          <div className="text-[16px] leading-[19px] text-foreground/60 truncate">at {h.role}</div>
        </div>
      </div>
      <p className="text-[16px] leading-[24px] text-foreground/80 flex-1 overflow-hidden">
        {h.period}
      </p>
    </div>
  ));

  if (reduced) {
    return (
      <section aria-label="Career highlights" className="py-2">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
          CAREER HIGHLIGHTS
        </h3>
        <div
          className="flex gap-premium-md overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {cards}
        </div>
      </section>
    );
  }

  // Section height = viewport height + horizontal distance so that the user
  // scrolls vertically through the entire horizontal range while the inner
  // pane stays pinned via `sticky top-0 h-screen`.
  // Applied only after mount to avoid SSR/hydration mismatch.
  const sectionStyle = mounted
    ? { height: `calc(100vh + ${distance}px)` }
    : undefined;

  return (
    <section
      ref={sectionRef}
      aria-label="Career highlights"
      style={sectionStyle}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
          CAREER HIGHLIGHTS
        </h3>
        <div ref={viewportRef} className="overflow-hidden -mx-1 px-1">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-premium-md pb-2 will-change-transform"
          >
            {cards}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
