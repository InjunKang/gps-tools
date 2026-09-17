import { DEFAULT_LOCALE, LOCALES, SITE, type Locale } from '../config/site';

export { ui } from './ui';
export type { UiStrings, UiErrorCode } from './ui';

/** Replaces `{name}` placeholders. */
export const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));

/** Site-relative URL of `slug` ('' = home) in `locale`. The default locale has no prefix. */
export function localePath(locale: Locale, slug = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}/${slug ? `${slug}/` : ''}`;
}

export const absoluteUrl = (path: string): string => new URL(path, SITE.url).href;

/** hreflang alternates for a page, including x-default (→ default locale). */
export function alternates(slug = ''): { hreflang: string; href: string }[] {
  return [
    ...LOCALES.map((locale) => ({ hreflang: locale as string, href: absoluteUrl(localePath(locale, slug)) })),
    { hreflang: 'x-default', href: absoluteUrl(localePath(DEFAULT_LOCALE, slug)) },
  ];
}

/** `getStaticPaths` entries for a `[...locale]` rest param: `undefined` is the default locale. */
export const localeParams = (): { locale: Locale; param: string | undefined }[] =>
  LOCALES.map((locale) => ({ locale, param: locale === DEFAULT_LOCALE ? undefined : locale }));
