import type { Feature, Geometry, Position } from 'geojson';
import { describeFeature, lineSegments, segmentValues } from '../geometry';
import type { Writer } from '../types';

const BASE_COLUMNS = ['type', 'name', 'description', 'segment', 'latitude', 'longitude', 'elevation', 'time'];

// togeojson's names for per-point sensor arrays → CSV column. A column is only written
// when the file actually contains that sensor.
const SENSORS: [property: string, column: string][] = [
  ['heart', 'heart_rate'],
  ['cads', 'cadence'],
  ['atemps', 'temperature'],
  ['powers', 'power'],
];

type Cell = string | number | null | undefined;

// Spreadsheets execute cells starting with these as formulas. Only free text needs the guard;
// numbers we generate (e.g. negative longitudes) must stay numeric.
const text = (value: string | undefined): string =>
  value !== undefined && /^[=+\-@\t\r]/.test(value) ? `'${value}` : (value ?? '');

function cell(value: Cell): string {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const writeCsv: Writer = (fc) => {
  const sensors = SENSORS.filter(([property]) =>
    fc.features.some((f) => (f.properties?.coordinateProperties as Record<string, unknown> | undefined)?.[property]),
  );
  const rows: Cell[][] = [[...BASE_COLUMNS, ...sensors.map(([, column]) => column)]];
  const blanks = sensors.map(() => '');

  const add = (feature: Feature, geometry: Geometry): void => {
    const { name, description, time, isRoute } = describeFeature(feature);
    // GeoJSON is [lon, lat, ele]; the CSV puts latitude first, as people expect.
    const waypoint = ([lon, lat, ele]: Position): Cell[] =>
      ['waypoint', text(name), text(description), '', lat, lon, ele, time, ...blanks];

    if (geometry.type === 'GeometryCollection') {
      geometry.geometries.forEach((g) => add(feature, g));
    } else if (geometry.type === 'Point') {
      rows.push(waypoint(geometry.coordinates));
    } else if (geometry.type === 'MultiPoint') {
      geometry.coordinates.forEach((c) => rows.push(waypoint(c)));
    } else {
      const type = geometry.type.endsWith('Polygon') ? 'polygon' : isRoute ? 'route' : 'track';
      const segments = lineSegments(geometry);
      const times = segmentValues(feature, 'times', segments);
      const values = sensors.map(([property]) => segmentValues(feature, property, segments));
      segments.forEach((segment, s) =>
        segment.forEach(([lon, lat, ele], i) =>
          // The description is not repeated on every point row; it would dominate the file.
          rows.push([type, text(name), '', s + 1, lat, lon, ele, times[s]?.[i] as Cell, ...values.map((v) => v[s]?.[i] as Cell)]),
        ),
      );
    }
  };

  for (const feature of fc.features) if (feature.geometry) add(feature, feature.geometry);
  // BOM: without it Excel decodes UTF-8 names as the local code page.
  return `﻿${rows.map((row) => row.map(cell).join(',')).join('\r\n')}\r\n`;
};
