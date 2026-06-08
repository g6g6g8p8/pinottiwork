import * as Tooltip from '@radix-ui/react-tooltip';
import { Trophy } from 'lucide-react';
import { useAbout } from '../../hooks/useAbout';

export default function SidebarAwards() {
  const { about } = useAbout();
  const awards = (about?.awards ?? []).filter((a) => !/latam/i.test(a.name));
  if (!about || awards.length === 0) return null;

  return (
    <Tooltip.Provider delayDuration={150}>
      <div
        aria-label="Awards"
        className="flex items-center justify-start gap-3 px-1 pb-3"
      >
        {awards.map((award, i) => (
          <Tooltip.Root key={i}>
            <Tooltip.Trigger asChild>
              <span
                aria-label={award.name}
                className="
                  inline-flex items-center justify-center
                  h-7 w-auto min-w-[28px] max-w-[56px]
                  opacity-80 hover:opacity-100
                  transition-opacity cursor-default
                "
              >
                {award.logo_light ? (
                  <>
                    <img
                      src={award.logo_light}
                      alt={award.name}
                      loading="lazy"
                      className="h-7 w-auto max-w-[56px] object-contain dark:hidden"
                    />
                    <img
                      src={award.logo_dark}
                      alt={award.name}
                      loading="lazy"
                      className="h-7 w-auto max-w-[56px] object-contain hidden dark:block"
                    />
                  </>
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
