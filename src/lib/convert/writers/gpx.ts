import type { Feature, Geometry, Position } from 'geojson';
import { describeFeature, lineSegments, segmentTimes } from '../geometry';
import type { Writer } from '../types';
import { el } from '../xml';

const HEADER =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<gpx version="1.1" creator="browser-gps-converter" xmlns="http://www.topografix.com/GPX/1/1">\n';

// GeoJSON is [lon, lat, ele]; GPX wants lat/lon attributes and <ele> before <time>.
function point(tag: string, [lon, lat, ele]: Position, inner = '', time?: string): string {
  return `<${tag} lat="${lat}" lon="${lon}">${el('ele', ele)}${el('time', time)}${inner}</${tag}>`;
}

export const writeGpx: Writer = (fc) => {
  // The GPX schema fixes the order: all wpt, then all rte, then all trk.
  const wpt: string[] = [];
  const rte: string[] = [];
  const trk: string[] = [];

  const add = (feature: Feature, geometry: Geometry): void => {
    const { name, description, time, isRoute } = describeFeature(feature);
    const meta = el('name', name) + el('desc', description);

    if (geometry.type === 'GeometryCollection') {
      geometry.geometries.forEach((g) => add(feature, g));
    } else if (geometry.type === 'Point') {
      wpt.push(point('wpt', geometry.coordinates, meta, time));
    } else if (geometry.type === 'MultiPoint') {
      geometry.coordinates.forEach((c) => wpt.push(point('wpt', c, meta, time)));
    } else {
      const segments = lineSegments(geometry);
      if (isRoute && segments.length === 1) {
        rte.push(`<rte>${meta}\n${segments[0].map((c) => point('rtept', c)).join('\n')}\n</rte>`);
        return;
      }
      const times = segmentTimes(feature, segments);
      const body = segments.map(
        (segment, i) => `<trkseg>\n${segment.map((c, j) => point('trkpt', c, '', times[i]?.[j])).join('\n')}\n</trkseg>`,
      );
      trk.push(`<trk>${meta}\n${body.join('\n')}\n</trk>`);
    }
  };

  for (const feature of fc.features) if (feature.geometry) add(feature, feature.geometry);
  return `${HEADER}${[...wpt, ...rte, ...trk].join('\n')}\n</gpx>\n`;
};
