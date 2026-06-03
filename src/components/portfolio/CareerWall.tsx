import { motion } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';

export default function CareerWall() {
  const { about } = useAbout();
  if (!about || about.career_highlights.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Career highlights"
      className="py-2"
    >
      <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
        CAREER HIGHLIGHTS
      </h3>

      <div
        className="flex gap-premium-md overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {about.career_highlights.map((h, i) => (
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
        ))}
      </div>
    </motion.section>
  );
}
