import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { DEFAULT_LOCALE, LOCALES, SITE } from './src/config/site';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: {
    // Lower modern syntax (??=, ?., ||=) for older iPhones: on iOS 13 the untranspiled dropzone
    // script was a syntax error, so picking a file silently did nothing. APIs are not polyfilled
    // by this, so src/ avoids anything newer than Safari 13 (see tests/build-output.test.ts).
    build: { target: ['safari13', 'chrome80', 'firefox72'] },
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: { prefixDefaultLocale: false },
  },
  security: {
    // Emitted as a <meta> CSP with hashes for Astro's own scripts and styles.
    // `connect-src 'self'` is the technical guarantee behind "files never leave your browser":
    // the page cannot send data to any other origin. Do not loosen without the owner's decision.
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self'",
        "worker-src 'self'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map((l) => [l, l])),
      },
    }),
  ],
});
