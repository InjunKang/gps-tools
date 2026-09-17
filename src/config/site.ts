// The only place the site name and URL are defined. The name is a placeholder until the owner
// picks a brand. The URL comes from the SITE_URL build variable (set it in Cloudflare and in CI)
// because canonical, hreflang, sitemap and robots.txt all need the real production origin.
export const SITE = {
  name: 'GPS Tools',
  url: (process.env.SITE_URL ?? 'https://example.com').replace(/\/+$/, ''),
} as const;

export const LOCALES = ['en', 'de', 'ja', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  es: 'Español',
};
