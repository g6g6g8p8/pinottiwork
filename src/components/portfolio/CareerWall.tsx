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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-premium-md">
        {about.career_highlights.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
            className="
              flex items-start gap-3 p-4 rounded-sf-xl
              bg-card border border-foreground/5
              hover:border-foreground/15 transition-colors
            "
          >
            <img
              src={h.logo_url}
              alt={h.company}
              loading="lazy"
              className="w-10 h-10 rounded-[8px] bg-foreground/5 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] leading-[18px] font-semibold truncate">{h.company}</div>
              <div className="text-[12px] leading-[15px] text-foreground/60 mb-1">at {h.role}</div>
              <p className="text-[12px] leading-[17px] text-foreground/70 line-clamp-2">
                {h.period}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
