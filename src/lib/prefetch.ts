/**
 * Link Prefetching Utility
 * Prefetches internal route links on hover to speed up navigation.
 */

const prefetchQueue = new Set<string>();

export function prefetchLink(href: string): void {
  if (typeof window === 'undefined') return;
  if (prefetchQueue.has(href)) return;
  if (!href.startsWith('/')) return;

  prefetchQueue.add(href);

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => triggerPrefetch(href));
  } else {
    setTimeout(() => triggerPrefetch(href), 2000);
  }
}

function triggerPrefetch(href: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = 'fetch';
  document.head.appendChild(link);
  setTimeout(() => {
    if (link.parentNode) document.head.removeChild(link);
  }, 100);
}

export function usePrefetchLink(href: string) {
  return {
    onMouseEnter: () => prefetchLink(href),
    onTouchStart: () => prefetchLink(href),
  };
}
