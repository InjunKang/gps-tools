import { describe, expect, it } from 'vitest';
import { LOCALES } from '../src/config/site';
import { commonFaq, formats, relatedTools, tools } from '../src/config/tools';
import { readers, writers } from '../src/lib/convert';
import { alternates, localePath, ui } from '../src/i18n';

describe('tools config', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = tools.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
    // A slug equal to a locale code would collide with /de/, /ja/, /es/.
    slugs.forEach((slug) => expect(LOCALES).not.toContain(slug));
  });

  it('only offers conversions the library can perform', () => {
    for (const tool of tools) {
      expect(tool.from).not.toBe(tool.to);
      expect(readers[tool.from], `reader for ${tool.from}`).toBeTypeOf('function');
      expect(writers[tool.to], `writer for ${tool.to}`).toBeTypeOf('function');
      expect(formats[tool.from]).toBeDefined();
      expect(formats[tool.to]).toBeDefined();
    }
  });

  it('has complete, non-empty copy in every locale', () => {
    for (const locale of LOCALES) {
      expect(commonFaq[locale].length).toBe(commonFaq.en.length);
      Object.values(formats).forEach((f) => expect(f.about[locale].trim()).not.toBe(''));
      for (const tool of tools) {
        const copy = tool.i18n[locale];
        expect(copy.title.trim()).not.toBe('');
        // Search engines truncate long descriptions.
        expect(copy.description.length).toBeGreaterThan(50);
        expect(copy.description.length).toBeLessThanOrEqual(locale === 'ja' ? 120 : 200);
        expect(copy.faq.length).toBe(tool.i18n.en.faq.length);
        copy.faq.forEach(({ q, a }) => expect(q.trim() && a.trim()).not.toBe(''));
      }
    }
  });

  it('keeps titles unique within a locale', () => {
    for (const locale of LOCALES) {
      const titles = tools.map((t) => t.i18n[locale].title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it('uses the same placeholders in every translation of a UI string', () => {
    const placeholders = (value: unknown): string[] =>
      typeof value === 'string'
        ? (value.match(/\{\w+\}/g) ?? []).sort()
        : Object.values(value as object).flatMap(placeholders);
    for (const locale of LOCALES) {
      for (const key of Object.keys(ui.en) as (keyof typeof ui.en)[]) {
        expect(placeholders(ui[locale][key]), `${locale}.${key}`).toEqual(placeholders(ui.en[key]));
      }
    }
  });

  it('lists the reverse conversion first among related tools', () => {
    const gpxToKml = tools.find((t) => t.slug === 'gpx-to-kml')!;
    expect(relatedTools(gpxToKml).map((t) => t.slug)).toEqual(['kml-to-gpx', 'gpx-to-geojson']);
  });
});

describe('i18n URLs', () => {
  it('prefixes every locale except the default', () => {
    expect(localePath('en')).toBe('/');
    expect(localePath('en', 'gpx-to-kml')).toBe('/gpx-to-kml/');
    expect(localePath('ja')).toBe('/ja/');
    expect(localePath('ja', 'gpx-to-kml')).toBe('/ja/gpx-to-kml/');
  });

  it('emits one alternate per locale plus x-default pointing at English', () => {
    const links = alternates('kml-to-gpx');
    expect(links.map((l) => l.hreflang)).toEqual([...LOCALES, 'x-default']);
    expect(links.at(-1)?.href).toBe(links[0].href);
    links.forEach((l) => expect(l.href).toMatch(/^https:\/\/.+\/kml-to-gpx\/$/));
  });
});
