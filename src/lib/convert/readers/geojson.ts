import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { ConvertError, type Reader } from '../types';

// Nesting depth of `coordinates` below a single position, per geometry type.
const DEPTH: Record<string, number> = {
  Point: 0,
  MultiPoint: 1,
  LineString: 1,
  MultiLineString: 2,
  Polygon: 2,
  MultiPolygon: 3,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function checkPosition(position: unknown): void {
  const ok =
    Array.isArray(position) &&
    position.length >= 2 &&
    position.every((n) => typeof n === 'number' && Number.isFinite(n));
  if (!ok) throw new ConvertError('invalid-file', `bad position ${JSON.stringify(position)?.slice(0, 80)}`);
  // GPX and KML only know WGS 84 degrees. Anything outside this range is a projected CRS.
  const [lon, lat] = position as number[];
  if (Math.abs(lon) > 180 || Math.abs(lat) > 90) throw new ConvertError('not-wgs84', `position ${lon}, ${lat}`);
}

function checkCoordinates(coordinates: unknown, depth: number): void {
  if (depth === 0) return checkPosition(coordinates);
  if (!Array.isArray(coordinates)) throw new ConvertError('invalid-file', 'coordinates is not an array');
  coordinates.forEach((c) => checkCoordinates(c, depth - 1));
}

function checkGeometry(geometry: unknown): asserts geometry is Geometry {
  if (!isObject(geometry)) throw new ConvertError('invalid-file', 'geometry is not an object');
  if (geometry.type === 'GeometryCollection') {
    if (!Array.isArray(geometry.geometries)) throw new ConvertError('invalid-file', 'geometries is not an array');
    return geometry.geometries.forEach(checkGeometry);
  }
  const depth = DEPTH[geometry.type as string];
  if (depth === undefined) throw new ConvertError('invalid-file', `unknown geometry type ${String(geometry.type)}`);
  checkCoordinates(geometry.coordinates, depth);
}

// Pre-RFC 7946 files may name a CRS. Only the two spellings of WGS 84 lon/lat are convertible.
function checkCrs(root: Record<string, unknown>): void {
  const crs = root.crs;
  const name = isObject(crs) && isObject(crs.properties) ? crs.properties.name : undefined;
  if (typeof name === 'string' && !/CRS84$|EPSG:{1,2}4326$/i.test(name)) throw new ConvertError('not-wgs84', name);
}

function toFeatures(root: Record<string, unknown>): unknown[] {
  if (root.type === 'FeatureCollection' && Array.isArray(root.features)) return root.features;
  if (root.type === 'Feature') return [root];
  if (typeof root.type === 'string' && (root.type in DEPTH || root.type === 'GeometryCollection')) {
    return [{ type: 'Feature', geometry: root, properties: {} }];
  }
  throw new ConvertError('wrong-format', `not GeoJSON: type=${JSON.stringify(root.type)}`);
}

export const readGeojson: Reader = (text) => {
  // A GPX or KML file dropped here deserves "wrong format", not "unreadable".
  if (text.trimStart().startsWith('<')) throw new ConvertError('wrong-format', 'looks like XML');

  let root: unknown;
  try {
    root = JSON.parse(text);
  } catch (e) {
    throw new ConvertError('invalid-file', e instanceof Error ? e.message : String(e));
  }
  if (!isObject(root)) throw new ConvertError('wrong-format', 'top level is not an object');
  checkCrs(root);

  const features: Feature[] = [];
  for (const candidate of toFeatures(root)) {
    if (!isObject(candidate) || candidate.type !== 'Feature') throw new ConvertError('invalid-file', 'not a Feature');
    // Attribute-only rows (geometry: null) are valid GeoJSON with nothing to draw.
    if (candidate.geometry === null || candidate.geometry === undefined) continue;
    checkGeometry(candidate.geometry);
    features.push({
      type: 'Feature',
      geometry: candidate.geometry,
      properties: isObject(candidate.properties) ? candidate.properties : {},
    });
  }
  return { type: 'FeatureCollection', features } satisfies FeatureCollection;
};
