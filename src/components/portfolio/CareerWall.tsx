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
      aria-label="Brands and agencies"
      className="py-2"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-foreground/40 mb-4 px-1">
        Worked at
      </p>

      <div
        className="
          grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 md:gap-3
        "
      >
        {about.career_highlights.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
            className="
              group relative aspect-square rounded-sf-md overflow-hidden
              bg-foreground/5 border border-foreground/5
              hover:border-foreground/15 transition-colors
            "
            title={`${h.company} — at ${h.role}`}
          >
            <img
              src={h.logo_url}
              alt={h.company}
              loading="lazy"
              className="
                absolute inset-0 w-full h-full object-cover
                grayscale opacity-60
                group-hover:grayscale-0 group-hover:opacity-100
                transition-all duration-300
              "
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
