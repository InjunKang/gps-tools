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

  // An iPhone on iOS 13 showed nothing at all after picking a file: `??=` in the page script
  // was a syntax error, so no handler was ever registered. Every shipped script must parse on
  // Safari 13 (the build target); APIs missing there are covered by the reader tests.
  it('ships no syntax newer than Safari 13 in any script', () => {
    const scripts = [
      ...pages.flatMap((p) => [...p.html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].map((m) => [p.path, m[1]])),
      ...readdirSync(join(dist, '_astro'))
        .filter((f) => f.endsWith('.js'))
        .map((f) => [`_astro/${f}`, readFileSync(join(dist, '_astro', f), 'utf8')]),
      ['error-guard.js', readFileSync(join(dist, 'error-guard.js'), 'utf8')],
    ];
    expect(scripts.length).toBeGreaterThan(2);
    for (const [name, code] of scripts) {
      for (const token of ['??=', '||=', '&&=', '?.', 'replaceAll(', 'URL.canParse', '.at(']) {
        expect(code.includes(token), `${token} in ${name}`).toBe(false);
      }
    }
  });

  it('loads the error guard before any bundled script on tool pages', () => {
    for (const { path, html } of toolPages) {
      const guard = html.indexOf('src="/error-guard.js"');
      expect(guard, path).toBeGreaterThan(0);
      // Before the first module script anywhere in the page, not just the dropzone's: Astro may
      // hoist bundled scripts to wherever the first component script appears (e.g. the header).
      expect(guard, path).toBeLessThan(html.indexOf('<script type="module"'));
      expect(guard, path).toBeLessThan(html.indexOf('</head>'));
      expect(html, path).toContain('data-error-detail');
    }
  });

  // The Share button carried the hidden attribute and was still visible everywhere, because
  // .button sets display. Anything toggled with `hidden` relies on this rule.
  it('makes the hidden attribute win over component display rules', () => {
    for (const { path, html } of toolPages) {
      expect(html.replace(/\s+/g, ''), path).toContain('[hidden]{display:none!important}');
    }
  });

  it('lists every page with its alternates in the sitemap', () => {
    const sitemap = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
    expect(sitemap.match(/<url>/g)).toHaveLength((tools.length + 1) * LOCALES.length);
    expect(sitemap).toContain('hreflang="ja"');
    expect(sitemap).not.toContain('404');
  });
});
