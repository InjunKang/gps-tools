import type { Feature, Geometry, Position } from 'geojson';
import { describeFeature, lineSegments, segmentTimes, segmentValues } from '../geometry';
import type { Writer } from '../types';
import { el } from '../xml';

const GPXTPX = 'http://www.garmin.com/xmlschemas/TrackPointExtension/v1';

// Per-point sensor readings, in the togeojson property → GPX element form that Strava, Garmin
// Connect and Komoot all read. <power> is not part of TrackPointExtension v1; Strava writes it
// directly under <extensions>, so we do the same.
const TPX_SENSORS: [property: string, element: string][] = [
  ['heart', 'gpxtpx:hr'],
  ['cads', 'gpxtpx:cad'],
  ['atemps', 'gpxtpx:atemp'],
];

type Reading = Record<string, unknown>;

function extensions(reading: Reading): string {
  const isValue = (v: unknown) => v !== null && v !== undefined && v !== '';
  const power = isValue(reading.powers) ? el('power', reading.powers) : '';
  const tpx = TPX_SENSORS.filter(([p]) => isValue(reading[p]))
    .map(([p, element]) => el(element, reading[p]))
    .join('');
  const body = power + (tpx ? `<gpxtpx:TrackPointExtension>${tpx}</gpxtpx:TrackPointExtension>` : '');
  return body ? `<extensions>${body}</extensions>` : '';
}

// GeoJSON is [lon, lat, ele]; GPX wants lat/lon attributes and <ele> before <time>, with
// <extensions> as the last child.
function point(tag: string, [lon, lat, ele]: Position, inner = '', time?: string, reading?: Reading): string {
  const ext = reading ? extensions(reading) : '';
  return `<${tag} lat="${lat}" lon="${lon}">${el('ele', ele)}${el('time', time)}${inner}${ext}</${tag}>`;
}

export const writeGpx: Writer = (fc) => {
  // The GPX schema fixes the order: all wpt, then all rte, then all trk.
  const wpt: string[] = [];
  const rte: string[] = [];
  const trk: string[] = [];
  let usesExtensions = false;

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
      const sensors = ['powers', ...TPX_SENSORS.map(([p]) => p)].map(
        (p) => [p, segmentValues(feature, p, segments)] as const,
      );
      const body = segments.map((segment, i) => {
        const points = segment.map((c, j) => {
          const reading: Reading = {};
          for (const [p, values] of sensors) if (values[i]) reading[p] = values[i][j];
          const xml = point('trkpt', c, '', times[i]?.[j], reading);
          if (xml.includes('<extensions>')) usesExtensions = true;
          return xml;
        });
        return `<trkseg>\n${points.join('\n')}\n</trkseg>`;
      });
      trk.push(`<trk>${meta}\n${body.join('\n')}\n</trk>`);
    }
  };

  for (const feature of fc.features) if (feature.geometry) add(feature, feature.geometry);

  const header =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<gpx version="1.1" creator="browser-gps-converter" xmlns="http://www.topografix.com/GPX/1/1"' +
    (usesExtensions ? ` xmlns:gpxtpx="${GPXTPX}"` : '') +
    '>\n';
  return `${header}${[...wpt, ...rte, ...trk].join('\n')}\n</gpx>\n`;
};
