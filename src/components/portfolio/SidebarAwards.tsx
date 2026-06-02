import * as Tooltip from '@radix-ui/react-tooltip';
import { Trophy } from 'lucide-react';
import { useAbout } from '../../hooks/useAbout';

export default function SidebarAwards() {
  const { about } = useAbout();
  if (!about || about.awards.length === 0) return null;

  return (
    <Tooltip.Provider delayDuration={150}>
      <div
        aria-label="Awards"
        className="flex items-center justify-start gap-3 px-1 pb-3"
      >
        {about.awards.map((award, i) => (
          <Tooltip.Root key={i}>
            <Tooltip.Trigger asChild>
              <span
                aria-label={award.name}
                className="
                  inline-flex items-center justify-center
                  w-7 h-7 rounded-full overflow-hidden
                  opacity-70 hover:opacity-100
                  transition-opacity cursor-default
                "
              >
                {award.logo ? (
                  <img
                    src={award.logo}
                    alt={award.name}
                    loading="lazy"
                    className="w-full h-full object-contain grayscale hover:grayscale-0 transition-[filter] duration-300"
                  />
                ) : (
                  <Trophy size={13} strokeWidth={1.8} className="text-foreground/60" />
                )}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={6}
                className="
                  z-50 px-2 py-1 rounded-sf-sm
                  bg-foreground text-background
                  text-[11px] font-medium
                  shadow-md
                "
              >
                {award.name}
                <Tooltip.Arrow className="fill-foreground" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
