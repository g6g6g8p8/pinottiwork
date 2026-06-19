import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
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
        className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 px-1 pb-3"
      >
        {awards.map((award, i) => {
          // Per-award size overrides — +25% vs previous baseline.
          // Wraps to multiple rows when sidebar width can't fit them inline.
          const isNYF = /new york|midas|nyf/i.test(award.name);
          const isGuinness = /guinness/i.test(award.name);
          const sizeClass = isNYF
            ? 'h-[54px] max-w-[110px] min-w-[54px]'
            : isGuinness
              ? 'h-[40px] max-w-[83px] min-w-[40px]'
              : 'h-[45px] max-w-[91px] min-w-[45px]';
          const imgClass = isNYF
            ? 'h-[54px] max-w-[110px]'
            : isGuinness
              ? 'h-[40px] max-w-[83px]'
              : 'h-[45px] max-w-[91px]';
          return (
          <Fragment key={i}>
          <Tooltip.Root>
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
          {isGuinness ? <div aria-hidden className="basis-full h-0" /> : null}
          </Fragment>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}
