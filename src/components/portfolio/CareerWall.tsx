import { motion, useReducedMotion } from 'framer-motion';
import { useAbout } from '../../hooks/useAbout';

export default function CareerWall() {
  const { about } = useAbout();
  const reduced = useReducedMotion();

  if (!about || about.career_highlights.length === 0) return null;

  return (
    <section aria-label="Career highlights" className="py-2">
      <h3 className="text-[14px] leading-[17px] font-medium opacity-60 mb-4 px-1">
        CAREER HIGHLIGHTS
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-premium-md">
        {about.career_highlights.map((h, index) => {
          const card = (
            <div
              className="
                bg-card rounded-2xl p-6 h-full
                border border-foreground/5 hover:border-foreground/15
                transition-colors flex flex-col aspect-[4/3]
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
                  <div className="text-[22px] leading-[27px] font-semibold truncate">
                    {h.company}
                  </div>
                  <div className="text-[16px] leading-[19px] text-foreground/60 truncate">
                    at {h.role}
                  </div>
                </div>
              </div>
              <p className="text-[16px] leading-[24px] text-foreground/80 flex-1 overflow-hidden">
                {h.period}
              </p>
            </div>
          );

          if (reduced) {
            return <div key={h.id}>{card}</div>;
          }

          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
            >
              {card}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
