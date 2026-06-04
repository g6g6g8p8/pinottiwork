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
        {awards.map((award, i) => {
          // Per-award size overrides (base h-9 = 36px, max-w 73px)
          const isNYF = /new york|midas|nyf/i.test(award.name);
          const isGuinness = /guinness/i.test(award.name);
          const sizeClass = isNYF
            ? 'h-[43px] max-w-[88px] min-w-[43px]'
            : isGuinness
              ? 'h-[32px] max-w-[66px] min-w-[32px]'
              : 'h-9 max-w-[73px] min-w-[36px]';
          const imgClass = isNYF
            ? 'h-[43px] max-w-[88px]'
            : isGuinness
              ? 'h-[32px] max-w-[66px]'
              : 'h-9 max-w-[73px]';
          return (
          <Tooltip.Root key={i}>
            <Tooltip.Trigger asChild>
              <span
                aria-label={award.name}
                className={`inline-flex items-center justify-center w-auto opacity-80 hover:opacity-100 transition-opacity cursor-default ${sizeClass}`}
              >
                {award.logo_light ? (
                  <>
                    <img
                      src={award.logo_light}
                      alt={award.name}
                      loading="lazy"
                      className={`w-auto object-contain dark:hidden ${imgClass}`}
                    />
                    <img
                      src={award.logo_dark}
                      alt={award.name}
                      loading="lazy"
                      className={`w-auto object-contain hidden dark:block ${imgClass}`}
                    />
                  </>
                ) : (
                  <Trophy size={17} strokeWidth={1.8} className="text-foreground/60" />
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
