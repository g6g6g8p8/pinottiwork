import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale } from '../lib/locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const COOKIE_NAME = 'lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Full reload on toggle: guarantees a fresh SSR pass (correct <html lang>,
  // locale-aware SEO head tags, and every content fetch re-run) picking up
  // the cookie we just set, instead of relying on partial client-side
  // re-invalidation to touch every locale-dependent piece correctly.
  const setLocale = useCallback((next: Locale) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}`;
      window.location.reload();
    }
    setLocaleState(next);
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}
