import type { Feature, FeatureCollection, Geometry, Position } from 'geojson';

type Props = Record<string, unknown>;

// togeojson wraps HTML descriptions from KML as { '@type': 'html', value }.
function text(value: unknown): string | undefined {
  const raw = typeof value === 'object' && value !== null && 'value' in value ? value.value : value;
  return typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : undefined;
}

/** Format-neutral metadata. GPX readers produce `desc`/`time`, KML readers `description`/`timestamp`. */
export function describeFeature(feature: Feature) {
  const p: Props = feature.properties ?? {};
  return {
    name: text(p.name),
    description: text(p.desc) ?? text(p.description),
    time: text(p.time) ?? text(p.timestamp),
    isRoute: p._gpxType === 'rte',
  };
}

/**
 * Per-point values (`times`, `heart`, …) that togeojson stores in `coordinateProperties`,
 * split per line segment. A segment gets `undefined` when the data cannot be aligned with its
 * points: togeojson omits the `times` entry of a segment that has no timestamps, which shifts
 * every later segment, so anything but an exact segment/length match is discarded.
 */
export function segmentValues(feature: Feature, key: string, segments: Position[][]): (unknown[] | undefined)[] {
  const raw = (feature.properties?.coordinateProperties as Record<string, unknown> | undefined)?.[key];
  const perSegment: unknown[] = Array.isArray(raw) && Array.isArray(raw[0]) ? raw : [raw];
  const aligned = perSegment.length === segments.length;
  return segments.map((segment, i) => {
    const values = perSegment[i];
    return aligned && Array.isArray(values) && values.length === segment.length ? values : undefined;
  });
}

/**
 * Timestamps per segment, all-or-nothing: both `gx:Track` and our GPX tracks need a time for
 * every point of a segment or none at all.
 */
export function segmentTimes(feature: Feature, segments: Position[][]): (string[] | undefined)[] {
  return segmentValues(feature, 'times', segments).map((times) =>
    times?.every((t) => typeof t === 'string' && t !== '') ? (times as string[]) : undefined,
  );
}

/** Line segments of a line-like geometry; polygon rings count as segments. */
export function lineSegments(geometry: Geometry): Position[][] {
  switch (geometry.type) {
    case 'LineString':
      return [geometry.coordinates];
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates;
    case 'MultiPolygon':
      return geometry.coordinates.flat();
    default:
      return [];
  }
}

function countGeometry(geometry: Geometry | null): number {
  if (!geometry) return 0;
  switch (geometry.type) {
    case 'Point':
      return 1;
    case 'MultiPoint':
      return geometry.coordinates.length;
    case 'GeometryCollection':
      return geometry.geometries.reduce((n, g) => n + countGeometry(g), 0);
    default:
      return lineSegments(geometry).reduce((n, s) => n + s.length, 0);
  }
}

export const countPoints = (fc: FeatureCollection): number =>
  fc.features.reduce((n, f) => n + countGeometry(f.geometry), 0);
