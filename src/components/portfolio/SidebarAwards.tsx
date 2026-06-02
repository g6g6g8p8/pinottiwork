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
        className="flex items-center justify-start gap-3 px-1 pb-3 mb-3 border-b border-foreground/5"
      >
        {about.awards.map((award, i) => (
          <Tooltip.Root key={i}>
            <Tooltip.Trigger asChild>
              <span
                aria-label={award}
                className="
                  inline-flex items-center justify-center
                  w-6 h-6 rounded-full
                  text-foreground/45 hover:text-foreground
                  transition-colors cursor-default
                "
              >
                <Trophy size={13} strokeWidth={1.8} />
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
                {award}
                <Tooltip.Arrow className="fill-foreground" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
