// Checks the built site in dist/. Skipped when there is no build; `npm run verify` builds first.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LOCALES } from '../src/config/site';
import { tools } from '../src/config/tools';

const dist = fileURLToPath(new URL('../dist', import.meta.url));

const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? htmlFiles(join(dir, entry.name))
      : entry.name.endsWith('.html')
        ? [join(dir, entry.name)]
        : [],
  );

describe.skipIf(!existsSync(dist))('build output', () => {
  const pages = existsSync(dist)
    ? htmlFiles(dist).map((file) => ({
        path: relative(dist, file).replace(/\\/g, '/'),
        html: readFileSync(file, 'utf8'),
      }))
    : [];
  const toolPages = pages.filter((p) => tools.some((t) => p.path.endsWith(`${t.slug}/index.html`)));

  it('builds every tool in every locale, plus a home page per locale', () => {
    expect(toolPages).toHaveLength(tools.length * LOCALES.length);
    expect(pages.filter((p) => /^(\w\w\/)?index\.html$/.test(p.path))).toHaveLength(LOCALES.length);
  });

  it('delivers the CSP inside <head> on every page (browsers ignore it anywhere else)', () => {
    for (const { path, html } of pages) {
      const head = html.slice(0, html.indexOf('</head>'));
      expect(head, path).toContain('http-equiv="content-security-policy"');
      expect(head, path).toContain("connect-src 'self'");
      // Any text node inside <head> makes the parser close it early.
      const strayText = head
        .slice(head.indexOf('<head>') + 6)
        .replace(/<(script|style|title)\b[\s\S]*?<\/\1>/g, '')
        .replace(/<[^>]+>/g, '')
        .trim();
      expect(strayText, `text inside <head> of ${path}`).toBe('');
    }
  });

  it('loads nothing from another origin', () => {
    for (const { path, html } of pages) {
      const external = [...html.matchAll(/<(?:script|img|iframe|link(?![^>]*rel="(?:canonical|alternate)"))[^>]*(?:src|href)="(https?:)?\/\/[^"]+"/g)];
      expect(external.map((m) => m[0]), path).toEqual([]);
    }
  });

  it('has a canonical URL and a complete hreflang set on every indexable page', () => {
    for (const { path, html } of pages.filter((p) => p.path !== '404.html')) {
      expect(html.match(/rel="canonical"/g), path).toHaveLength(1);
      for (const code of [...LOCALES, 'x-default']) {
        expect(html, `${path} hreflang=${code}`).toContain(`hreflang="${code}" href="https://`);
      }
    }
  });

  it('keeps the fixed section order and never puts an ad slot next to the dropzone', () => {
    for (const { path, html } of toolPages) {
      const at = (needle: string) => html.indexOf(needle);
      const order = [at('data-dropzone'), at('id="how-to"'), at('data-ad-slot='), at('id="formats"'), at('id="faq"'), at('id="related"')];
      expect(order.every((i) => i > 0), path).toBe(true);
      expect([...order].sort((a, b) => a - b), path).toEqual(order);
    }
  });

  it('lists every page with its alternates in the sitemap', () => {
    const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
    expect(sitemap.match(/<url>/g)).toHaveLength((tools.length + 1) * LOCALES.length);
    expect(sitemap).toContain('hreflang="ja"');
    expect(sitemap).not.toContain('404');
  });
});
