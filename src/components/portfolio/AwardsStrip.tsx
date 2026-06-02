import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useAbout } from '../../hooks/useAbout';

export default function AwardsStrip() {
  const { about } = useAbout();
  if (!about || about.awards.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Awards and recognition"
      className="py-2"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-foreground/40 mb-4 px-1">
        Recognition
      </p>

      <div
        className="
          flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory
          md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:gap-premium-md
        "
      >
        {about.awards.map((award, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            className="
              snap-start shrink-0 min-w-[220px] md:min-w-0
              flex items-start gap-3 p-4 md:p-5
              bg-card rounded-sf-xl
              border border-foreground/5
              hover:border-foreground/15 transition-colors
            "
          >
            <div
              aria-hidden="true"
              className="
                w-9 h-9 shrink-0 rounded-full
                flex items-center justify-center
                bg-foreground/5 text-foreground/70
              "
            >
              <Trophy size={16} strokeWidth={1.8} />
            </div>
            <p className="text-[13px] leading-[18px] font-medium text-foreground/90 pt-1">
              {award}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
