import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DOMParser } from '@xmldom/xmldom';
import type { Feature, Position } from 'geojson';

export const fixture = (name: string): string =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), 'utf8');

/** Parses strictly: any XML error (not just fatal ones) fails the test. */
export function parseXmlStrict(xml: string) {
  return new DOMParser({
    onError: (level, msg) => {
      throw new Error(`${level}: ${msg}`);
    },
  }).parseFromString(xml, 'text/xml');
}

/** Every coordinate of a feature, flattened, in document order. */
export function positions(feature: Feature): Position[] {
  const out: Position[] = [];
  const walk = (c: unknown): void => {
    if (Array.isArray(c) && typeof c[0] === 'number') out.push(c as Position);
    else if (Array.isArray(c)) c.forEach(walk);
  };
  const g = feature.geometry;
  if (g.type === 'GeometryCollection') g.geometries.forEach((x) => 'coordinates' in x && walk(x.coordinates));
  else walk(g.coordinates);
  return out;
}

/** Per-point timestamps of a line feature, flattened across segments. */
export function times(feature: Feature): string[] {
  const t = (feature.properties?.coordinateProperties as { times?: unknown } | undefined)?.times;
  return Array.isArray(t) ? (t.flat() as string[]) : [];
}
