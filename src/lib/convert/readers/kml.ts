import { kml } from '@tmcw/togeojson';
import type { Feature, FeatureCollection, Geometry, LineString, Position } from 'geojson';
import type { Reader } from '../types';
import { parseXml } from '../xml';

const GX = 'http://www.google.com/kml/ext/2.2';

// Workaround for togeojson <= 7.1.2: a gx:Track with exactly two points is read as a Point and
// the second point is silently dropped. Pad such tracks with a NaN sentinel so they are read as
// lines, then strip the sentinel again in `normalize`.
function padShortTracks(doc: Document): void {
  for (const track of Array.from(doc.getElementsByTagNameNS(GX, 'Track'))) {
    if (track.getElementsByTagNameNS(GX, 'coord').length !== 2) continue;
    track.appendChild(doc.createElementNS(track.namespaceURI, 'when'));
    track.appendChild(doc.createElementNS(GX, 'gx:coord')).textContent = 'NaN NaN NaN';
  }
}

function stripSentinel(line: LineString, times: unknown): void {
  const i = line.coordinates.findIndex((c) => Number.isNaN(c[0]));
  if (i === -1) return;
  line.coordinates.splice(i, 1);
  if (Array.isArray(times)) times.splice(i, 1);
}

function normalize(feature: Feature): Feature {
  const g = feature.geometry;
  const times = (feature.properties?.coordinateProperties as { times?: unknown[] } | undefined)?.times;
  if (g.type === 'LineString') stripSentinel(g, times);
  if (g.type !== 'GeometryCollection') return feature;
  g.geometries.forEach((x, i) => x.type === 'LineString' && stripSentinel(x, times?.[i]));

  // togeojson reads gx:MultiTrack (and a MultiGeometry of lines) as a GeometryCollection of
  // LineStrings. That is a MultiLineString in all but name, and its per-segment `times` already
  // have the MultiLineString shape, so normalize it here and keep the writers simple.
  if (g.geometries.length < 2 || !g.geometries.every((x): x is LineString => x.type === 'LineString')) {
    return feature;
  }
  return {
    ...feature,
    geometry: { type: 'MultiLineString', coordinates: g.geometries.map((x) => x.coordinates) },
  };
}

function positionsOf(geometry: Geometry): Position[] {
  if (geometry.type === 'GeometryCollection') return geometry.geometries.flatMap(positionsOf);
  const out: Position[] = [];
  const walk = (c: unknown[]): void => {
    if (typeof c[0] === 'number') out.push(c as Position);
    else c.forEach((x) => walk(x as unknown[]));
  };
  walk(geometry.coordinates);
  return out;
}

// Features drawn in Google Earth are clamped to the ground and carry a literal altitude of 0.
// Passing that on as real data gives GPX editors a flat 0 m profile, so when every altitude of
// a feature is 0 it is treated as "no altitude". A 0 among real altitudes is kept.
function dropGroundAltitude(feature: Feature): Feature {
  const positions = positionsOf(feature.geometry);
  if (positions.some((p) => p.length > 2) && positions.every((p) => p.length < 3 || p[2] === 0)) {
    positions.forEach((p) => (p.length = 2));
  }
  return feature;
}

export const readKml: Reader = (text) => {
  const doc = parseXml(text, 'kml');
  padShortTracks(doc);
  // skipNullGeometry guarantees every feature has a geometry, which the library's types can't express.
  const fc = kml(doc, { skipNullGeometry: true }) as FeatureCollection;
  return { ...fc, features: fc.features.map(normalize).map(dropGroundAltitude) };
};
