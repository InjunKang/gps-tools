// The only place the site name and URL are defined. Both are placeholders until the
// owner picks a brand and a domain.
export const SITE = {
  name: 'GPS Tools',
  url: 'https://example.com',
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
