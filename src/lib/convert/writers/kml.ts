import type { Feature, Geometry, Position } from 'geojson';
import { describeFeature, segmentTimes } from '../geometry';
import type { Writer } from '../types';
import { el } from '../xml';

const HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">\n<Document>\n';

// KML tuples are "lon,lat[,alt]" — the same axis order as GeoJSON.
const tuple = (c: Position): string => c.slice(0, 3).join(',');
const coordinates = (cs: Position[]): string => `<coordinates>${cs.map(tuple).join(' ')}</coordinates>`;
const lineString = (cs: Position[]): string => `<LineString>${coordinates(cs)}</LineString>`;
const ring = (cs: Position[]): string => `<LinearRing>${coordinates(cs)}</LinearRing>`;

const polygon = ([outer, ...inner]: Position[][]): string =>
  `<Polygon><outerBoundaryIs>${ring(outer)}</outerBoundaryIs>` +
  inner.map((r) => `<innerBoundaryIs>${ring(r)}</innerBoundaryIs>`).join('') +
  '</Polygon>';

/** A timed segment as gx:Track — the only KML geometry that carries per-point time. */
function track(segment: Position[], times: string[]): string {
  const when = times.map((t) => el('when', t)).join('');
  // gx:coord is space-separated and needs an altitude for every point.
  const coords = segment.map(([lon, lat, alt]) => `<gx:coord>${lon} ${lat} ${alt ?? 0}</gx:coord>`).join('');
  return `<gx:Track>${when}${coords}</gx:Track>`;
}

const multi = (parts: string[]): string =>
  parts.length === 1 ? parts[0] : `<MultiGeometry>${parts.join('')}</MultiGeometry>`;

function lines(feature: Feature, segments: Position[][]): string {
  const times = segmentTimes(feature, segments);
  if (times.every((t) => t !== undefined)) {
    const tracks = segments.map((s, i) => track(s, times[i] as string[]));
    return tracks.length === 1 ? tracks[0] : `<gx:MultiTrack>${tracks.join('')}</gx:MultiTrack>`;
  }
  return multi(segments.map(lineString));
}

function geometryXml(feature: Feature, geometry: Geometry): string {
  switch (geometry.type) {
    case 'Point':
      return `<Point>${coordinates([geometry.coordinates])}</Point>`;
    case 'MultiPoint':
      return multi(geometry.coordinates.map((c) => `<Point>${coordinates([c])}</Point>`));
    case 'LineString':
      return lines(feature, [geometry.coordinates]);
    case 'MultiLineString':
      return lines(feature, geometry.coordinates);
    case 'Polygon':
      return polygon(geometry.coordinates);
    case 'MultiPolygon':
      return multi(geometry.coordinates.map(polygon));
    case 'GeometryCollection':
      return multi(geometry.geometries.map((g) => geometryXml(feature, g)));
  }
}

export const writeKml: Writer = (fc) => {
  const placemarks = fc.features
    .filter((feature) => feature.geometry)
    .map((feature) => {
      const { name, description, time } = describeFeature(feature);
      const isPoint = feature.geometry.type === 'Point';
      const timeStamp = isPoint && time ? `<TimeStamp>${el('when', time)}</TimeStamp>` : '';
      return (
        `<Placemark>${el('name', name)}${el('description', description)}${timeStamp}\n` +
        `${geometryXml(feature, feature.geometry)}\n</Placemark>`
      );
    });
  return `${HEADER}${placemarks.join('\n')}\n</Document>\n</kml>\n`;
};
