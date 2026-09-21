// Single source of truth for every tool. Adding a tool = adding one entry to `definitions`
// (plus a `formats` entry and a reader/writer in src/lib/convert if the format is new) and its copy
// to every language pack in src/i18n/locales — the `Record<ToolSlug, …>` type there makes a missing
// translation a compile error.
import { LOCALES, type Locale } from './site';
import { packs, perLocale } from '../i18n/packs';
import type { Faq, ToolCopy } from '../i18n/types';
import type { FormatId } from '../lib/convert/types';

export type { Faq, ToolCopy } from '../i18n/types';

export interface FormatDef {
  label: string;
  extension: string;
  /** Other extensions the same format is commonly saved with; offered in the file picker. */
  alsoAccepts?: string[];
  mime: string;
  /** Shown in the "about the formats" section of every tool that reads or writes this format. */
  about: Record<Locale, string>;
}

export interface ToolDef {
  slug: ToolSlug;
  from: FormatId;
  to: FormatId;
  i18n: Record<Locale, ToolCopy>;
}

export const TOOL_SLUGS = ['gpx-to-kml', 'kml-to-gpx', 'gpx-to-geojson', 'gpx-to-csv', 'kml-to-geojson', 'geojson-to-gpx', 'geojson-to-kml'] as const;
export type ToolSlug = (typeof TOOL_SLUGS)[number];

const definitions: { slug: ToolSlug; from: FormatId; to: FormatId }[] = [
  { slug: 'gpx-to-kml', from: 'gpx', to: 'kml' },
  { slug: 'kml-to-gpx', from: 'kml', to: 'gpx' },
  { slug: 'gpx-to-geojson', from: 'gpx', to: 'geojson' },
  { slug: 'gpx-to-csv', from: 'gpx', to: 'csv' },
  { slug: 'kml-to-geojson', from: 'kml', to: 'geojson' },
  { slug: 'geojson-to-gpx', from: 'geojson', to: 'gpx' },
  { slug: 'geojson-to-kml', from: 'geojson', to: 'kml' },
];

const formatMeta: Record<FormatId, Omit<FormatDef, 'about'>> = {
  gpx: { label: 'GPX', extension: 'gpx', mime: 'application/gpx+xml' },
  kml: { label: 'KML', extension: 'kml', mime: 'application/vnd.google-earth.kml+xml' },
  geojson: { label: 'GeoJSON', extension: 'geojson', alsoAccepts: ['json'], mime: 'application/geo+json' },
  csv: { label: 'CSV', extension: 'csv', mime: 'text/csv' },
};

export const formats: Record<FormatId, FormatDef> = Object.fromEntries(
  (Object.keys(formatMeta) as FormatId[]).map((id) => [id, { ...formatMeta[id], about: perLocale((p) => p.formats[id]) }]),
) as Record<FormatId, FormatDef>;

/** Appended to the FAQ of every tool. */
export const commonFaq: Record<Locale, Faq[]> = perLocale((p) => p.commonFaq);

export const tools: ToolDef[] = definitions.map((d) => ({ ...d, i18n: perLocale((p) => p.tools[d.slug]) }));

// Guards against a locale listed in site.ts that has no pack (also a type error, but explicit).
for (const locale of LOCALES) if (!packs[locale]) throw new Error(`no language pack for "${locale}"`);

export const getTool = (slug: string): ToolDef | undefined => tools.find((t) => t.slug === slug);

const MAX_RELATED = 4;

/** Up to four tools that share a format with `tool`; the exact reverse conversion comes first. */
export function relatedTools(tool: ToolDef): ToolDef[] {
  const score = (t: ToolDef): number =>
    (t.from === tool.to && t.to === tool.from ? 4 : 0) +
    (t.from === tool.from ? 2 : 0) +
    (t.to === tool.to || t.from === tool.to || t.to === tool.from ? 1 : 0);
  return tools
    .filter((t) => t !== tool && score(t) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, MAX_RELATED);
}
