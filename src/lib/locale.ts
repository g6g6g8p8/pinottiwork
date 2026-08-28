import { createServerFn } from '@tanstack/react-start';
import { getCookie, getRequestHeader, setCookie } from '@tanstack/react-start/server';

export type Locale = 'en' | 'pt';

const COOKIE_NAME = 'lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'pt';
}

// Resolves the visitor's language for this request:
// 1. an explicit cookie (set by the manual toggle, or by a previous resolution) wins
// 2. otherwise, Vercel's edge-injected geo header — Brazil gets PT, everyone else EN
// The chosen locale is written back as a cookie so it's stable across navigations.
export const resolveLocale = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Locale> => {
    const cookieLocale = getCookie(COOKIE_NAME);
    if (isLocale(cookieLocale)) return cookieLocale;

    const country = getRequestHeader('x-vercel-ip-country' as any);
    const locale: Locale = country === 'BR' ? 'pt' : 'en';

    setCookie(COOKIE_NAME, locale, { path: '/', maxAge: COOKIE_MAX_AGE });
    return locale;
  },
);

export const setLocaleCookie = createServerFn({ method: 'POST' })
  .inputValidator((d: { locale: Locale }) => d)
  .handler(async ({ data }) => {
    setCookie(COOKIE_NAME, data.locale, { path: '/', maxAge: COOKIE_MAX_AGE });
    return { ok: true };
  });
