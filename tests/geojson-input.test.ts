import { describe, expect, it } from 'vitest';
import type { Feature, FeatureCollection } from 'geojson';
import { convert, ConvertError } from '../src/lib/convert';
import { readGeojson } from '../src/lib/convert/readers/geojson';
import { readGpx } from '../src/lib/convert/readers/gpx';
import { readKml } from '../src/lib/convert/readers/kml';
import { fixture, parseXmlStrict, positions, times } from './helpers';

const fc = (...features: Feature[]): string => JSON.stringify({ type: 'FeatureCollection', features });
const feature = (geometry: Feature['geometry'], properties: Feature['properties'] = {}): Feature => ({
  type: 'Feature',
  geometry,
  properties,
});
const errorCode = (fn: () => unknown): string => {
  try {
    fn();
  } catch (e) {
    expect(e).toBeInstanceOf(ConvertError);
    return (e as ConvertError).code;
  }
  return 'no error';
};

describe('GPX → GeoJSON → GPX round trip', () => {
  it('restores waypoints, routes, multi-segment tracks, elevation, names and times', () => {
    for (const name of ['blue_hills.gpx', 'strava.gpx', 'multitrackgpx.gpx', 'trek.gpx', 'wpt.gpx']) {
      const source = readGpx(fixture(name));
      const geojson = convert(fixture(name), 'gpx', 'geojson').output;
      const { output } = convert(geojson, 'geojson', 'gpx');
      parseXmlStrict(output);
      const back = readGpx(output);

      const summary = (f: Feature) => ({
        type: f.geometry.type,
        gpxType: f.properties?._gpxType,
        name: f.properties?.name,
        positions: positions(f),
        times: times(f),
      });
      const sort = (x: FeatureCollection) =>
        x.features.map(summary).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      expect(sort(back), name).toEqual(sort(source));
    }
  });
});

describe('GeoJSON → GPX', () => {
  it('maps points, lines, multi-lines and polygons, reading name/title and description', () => {
    const input = fc(
      feature({ type: 'Point', coordinates: [8.54, 47.37, 408] }, { title: 'Zürich HB', description: 'Main station' }),
      feature({ type: 'LineString', coordinates: [[8.5, 47.3], [8.6, 47.4]] }, { name: 'Line' }),
      feature({ type: 'MultiLineString', coordinates: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]] }, { name: 'Two parts' }),
      feature(
        { type: 'Polygon', coordinates: [[[0, 0], [4, 0], [4, 4], [0, 0]], [[1, 1], [2, 1], [2, 2], [1, 1]]] },
        { name: 'Area' },
      ),
    );
    const { output, stats } = convert(input, 'geojson', 'gpx');
    const doc = parseXmlStrict(output);
    expect(output).toContain('<wpt lat="47.37" lon="8.54"><ele>408</ele><name>Zürich HB</name><desc>Main station</desc></wpt>');
    expect(doc.getElementsByTagName('trk')).toHaveLength(3);
    // MultiLineString → 2 segments, polygon outline + hole → 2 segments, LineString → 1.
    expect(doc.getElementsByTagName('trkseg')).toHaveLength(5);
    expect(stats).toEqual({ features: 4, points: 1 + 2 + 4 + 8 });
  });

  it('accepts a single Feature and a bare Geometry', () => {
    const point: Feature['geometry'] = { type: 'Point', coordinates: [10, 50] };
    expect(convert(JSON.stringify(feature(point, { name: 'A' })), 'geojson', 'gpx').output).toContain(
      '<wpt lat="50" lon="10"><name>A</name></wpt>',
    );
    expect(convert(JSON.stringify(point), 'geojson', 'gpx').output).toContain('<wpt lat="50" lon="10"></wpt>');
  });

  it('skips features without geometry and reports a file with none left as empty', () => {
    const nullFeature = { type: 'Feature', geometry: null, properties: { name: 'table row' } } as unknown as Feature;
    const input = fc(nullFeature, feature({ type: 'Point', coordinates: [1, 2] }));
    expect(readGeojson(input).features).toHaveLength(1);
    expect(errorCode(() => convert(fc(nullFeature), 'geojson', 'gpx'))).toBe('empty');
    expect(errorCode(() => convert(fc(), 'geojson', 'kml'))).toBe('empty');
  });

  it('reads a UTF-8 BOM-less file with the CRS84 member that QGIS writes', () => {
    const qgis = JSON.stringify({
      type: 'FeatureCollection',
      name: 'trails',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [feature({ type: 'LineString', coordinates: [[8.5, 47.3], [8.6, 47.4]] }, { name: 'Trail' })],
    });
    expect(readGeojson(qgis).features).toHaveLength(1);
  });
});

describe('GeoJSON → KML', () => {
  it('keeps geometry types, including polygon holes and multi geometries', () => {
    const input = fc(
      feature({ type: 'Point', coordinates: [8.54, 47.37, 408] }, { name: 'P' }),
      feature({ type: 'Polygon', coordinates: [[[0, 0], [4, 0], [4, 4], [0, 0]], [[1, 1], [2, 1], [2, 2], [1, 1]]] }),
      feature({ type: 'MultiPolygon', coordinates: [[[[0, 0], [1, 0], [1, 1], [0, 0]]], [[[5, 5], [6, 5], [6, 6], [5, 5]]]] }),
      feature({ type: 'MultiPoint', coordinates: [[1, 1], [2, 2]] }),
    );
    const { output } = convert(input, 'geojson', 'kml');
    parseXmlStrict(output);
    const back = readKml(output).features;
    expect(back.map((f) => f.geometry.type)).toEqual(['Point', 'Polygon', 'GeometryCollection', 'GeometryCollection']);
    expect(back[1].geometry).toMatchObject({ coordinates: [expect.any(Array), expect.any(Array)] }); // outer + hole
    expect(positions(back[0])).toEqual([[8.54, 47.37, 408]]);
  });

  it('writes per-point times from coordinateProperties as gx:Track', () => {
    const geojson = convert(fixture('strava.gpx'), 'gpx', 'geojson').output;
    const { output } = convert(geojson, 'geojson', 'kml');
    expect(output).toContain('<gx:Track>');
    expect(times(readKml(output).features[0])).toEqual(times(readGpx(fixture('strava.gpx')).features[0]));
  });

  // Backs the FAQ: attributes are the point of GeoJSON for GIS users.
  it('carries other properties over as ExtendedData', () => {
    const input = fc(
      feature(
        { type: 'Point', coordinates: [1, 2] },
        {
          name: 'Hut',
          description: 'Open in summer',
          capacity: 24,
          staffed: true,
          'ref:id': 'A&B <1>',
          nested: { skipped: true },
          list: [1, 2],
          nothing: null,
          coordinateProperties: { times: ['x'] },
          _gpxType: 'wpt',
        },
      ),
    );
    const { output } = convert(input, 'geojson', 'kml');
    parseXmlStrict(output);
    expect(output).toContain('<Data name="capacity"><value>24</value></Data>');
    const props = readKml(output).features[0].properties ?? {};
    expect(props).toMatchObject({ name: 'Hut', description: 'Open in summer', capacity: '24', staffed: 'true', 'ref:id': 'A&B <1>' });
    // Objects, arrays, nulls, internal keys and the fields written elsewhere are not duplicated.
    for (const key of ['nested', 'list', 'nothing', 'coordinateProperties', '_gpxType']) expect(props).not.toHaveProperty(key);
    expect(output.match(/<Data name="(name|description)"/g)).toBeNull();
  });

  it('writes no ExtendedData element when there is nothing to put in it', () => {
    const { output } = convert(fc(feature({ type: 'Point', coordinates: [1, 2] }, { name: 'x' })), 'geojson', 'kml');
    expect(output).not.toContain('ExtendedData');
  });
});

describe('GeoJSON input errors', () => {
  it('reports text that is not JSON', () => {
    expect(errorCode(() => convert('{"type": "FeatureCollection", "features": [', 'geojson', 'gpx'))).toBe('invalid-file');
    expect(errorCode(() => convert('', 'geojson', 'gpx'))).toBe('invalid-file');
  });

  it('recognises XML and JSON that is not GeoJSON as the wrong format', () => {
    expect(errorCode(() => convert(fixture('strava.gpx'), 'geojson', 'kml'))).toBe('wrong-format');
    expect(errorCode(() => convert('{"a": 1}', 'geojson', 'gpx'))).toBe('wrong-format');
    expect(errorCode(() => convert('[1, 2, 3]', 'geojson', 'gpx'))).toBe('wrong-format');
    expect(errorCode(() => convert('{"type": "Topology", "objects": {}}', 'geojson', 'gpx'))).toBe('wrong-format');
  });

  it('rejects malformed coordinates instead of writing lat="undefined"', () => {
    const bad = (coordinates: unknown) => fc(feature({ type: 'LineString', coordinates } as never));
    expect(errorCode(() => convert(bad([['8.5', '47.3'], [8.6, 47.4]]), 'geojson', 'gpx'))).toBe('invalid-file');
    expect(errorCode(() => convert(bad([[8.5], [8.6, 47.4]]), 'geojson', 'gpx'))).toBe('invalid-file');
    expect(errorCode(() => convert(bad('nope'), 'geojson', 'gpx'))).toBe('invalid-file');
    expect(errorCode(() => convert(fc(feature({ type: 'Circle', coordinates: [1, 2] } as never)), 'geojson', 'gpx'))).toBe(
      'invalid-file',
    );
  });

  // GPX and KML are WGS 84 only. QGIS and ogr2ogr happily export projected GeoJSON.
  it('rejects projected coordinates, by crs member or by range', () => {
    const webMercator = JSON.stringify({
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3857' } },
      features: [feature({ type: 'Point', coordinates: [950000, 6000000] })],
    });
    expect(errorCode(() => convert(webMercator, 'geojson', 'gpx'))).toBe('not-wgs84');
    // No crs member, but the numbers cannot be degrees.
    expect(errorCode(() => convert(fc(feature({ type: 'Point', coordinates: [950000, 6000000] })), 'geojson', 'kml'))).toBe(
      'not-wgs84',
    );
    expect(errorCode(() => convert(fc(feature({ type: 'Point', coordinates: [8.5, 91] })), 'geojson', 'kml'))).toBe('not-wgs84');
    // EPSG:4326 spelled the old way is fine.
    const epsg4326 = JSON.stringify({
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'EPSG:4326' } },
      features: [feature({ type: 'Point', coordinates: [8.5, 47.3] })],
    });
    expect(readGeojson(epsg4326).features).toHaveLength(1);
  });
});
