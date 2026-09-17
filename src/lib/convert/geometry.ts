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
 * Per-point timestamps for each line segment, as produced by togeojson in
 * `coordinateProperties.times`. A segment gets `undefined` unless every point has a time,
 * because both `gx:Track` and our GPX output need all-or-nothing.
 */
export function segmentTimes(feature: Feature, segments: Position[][]): (string[] | undefined)[] {
  const raw = (feature.properties?.coordinateProperties as { times?: unknown } | undefined)?.times;
  const perSegment: unknown[] =
    Array.isArray(raw) && Array.isArray(raw[0]) ? raw : segments.length === 1 ? [raw] : [];
  return segments.map((segment, i) => {
    const times = perSegment[i];
    const complete =
      Array.isArray(times) &&
      times.length === segment.length &&
      times.every((t) => typeof t === 'string' && t !== '');
    return complete ? (times as string[]) : undefined;
  });
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
