// The only place the site name and URL are defined. The URL comes from the SITE_URL build
// variable because canonical, hreflang, sitemap and robots.txt all need the real production origin.
const PLACEHOLDER_URL = 'https://example.com';

/**
 * Production origin for this build. Local builds and GitHub Actions may fall back to a
 * placeholder, but a Cloudflare build must not: a deploy without SITE_URL succeeds and looks
 * fine while every canonical, hreflang and sitemap URL points at example.com.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const raw = env.SITE_URL?.trim();
  // Set by Cloudflare Workers Builds and Cloudflare Pages respectively.
  const onCloudflare = Boolean(env.WORKERS_CI || env.CF_PAGES);

  if (!raw) {
    if (!onCloudflare) return PLACEHOLDER_URL;
    throw new Error(
      'SITE_URL is not set. In the Cloudflare dashboard open this project → Settings → Build → ' +
        '"Build variables and secrets" (not the runtime "Variables and Secrets") and add ' +
        'SITE_URL = the production origin, e.g. https://your-domain.com. Then retry the build.',
    );
  }

  const url = URL.canParse(raw) ? new URL(raw) : undefined;
  if (!url || !['https:', 'http:'].includes(url.protocol)) {
    throw new Error(`SITE_URL must be a full origin starting with https://, got "${raw}".`);
  }
  if (onCloudflare && url.origin === PLACEHOLDER_URL) {
    throw new Error(`SITE_URL is still the placeholder ${PLACEHOLDER_URL}; set it to the production origin.`);
  }
  return url.origin;
}

export const SITE = {
  name: 'GPXKit',
  url: resolveSiteUrl(process.env),
} as const;

export const LOCALES = ['en', 'de', 'ja', 'es', 'ko', 'fr', 'it', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  es: 'Español',
  ko: '한국어',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
};
