import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';

export default function CareerWall() {
  const { about } = useAbout();
  const wrapperRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pinHeight, setPinHeight] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useLayoutEffect(() => {
    if (reduced) {
      setPinHeight(null);
      return;
    }
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const recompute = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      setPinHeight(vh + maxScroll);
    };

    recompute();
    window.addEventListener('resize', recompute);
    const ro = new ResizeObserver(recompute);
    ro.observe(scroller);
    return () => {
      window.removeEventListener('resize', recompute);
      ro.disconnect();
    };
  }, [about, reduced]);

  useEffect(() => {
    if (reduced) return;
    const wrapper = wrapperRef.current;
    const scroller = scrollerRef.current;
    if (!wrapper || !scroller) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 0) return;
      const total = rect.height - vh;
      if (total <= 0) return;
      const passed = -rect.top;
      const progress = Math.min(1, Math.max(0, passed / total));
      scroller.scrollLeft = progress * maxScroll;
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [about, reduced, pinHeight]);

  if (!about || about.career_highlights.length === 0) return null;

  const cards = about.career_highlights.map((h, i) => (
    <motion.div
      key={h.id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
      className="
        snap-start shrink-0
        w-[320px] aspect-[4/3]
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
    </motion.div>
  ));

  if (reduced) {
    return (
      <section aria-label="Career highlights" className="py-2">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
          CAREER HIGHLIGHTS
        </h3>
        <div
          ref={scrollerRef}
          className="flex gap-premium-md overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      aria-label="Career highlights"
      style={pinHeight ? { height: `${pinHeight}px` } : undefined}
      className="relative"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center py-6"
      >
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
          CAREER HIGHLIGHTS
        </h3>
        <div
          ref={scrollerRef}
          className="flex gap-premium-md overflow-hidden pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {cards}
        </div>
      </div>
    </section>
  );
}
