import { describe, expect, it } from 'vitest';
import type { FeatureCollection } from 'geojson';
import { convert } from '../src/lib/convert';
import { fixture, positions, times } from './helpers';

/** Minimal RFC 4180 parser: quoted fields, doubled quotes, CRLF, newlines inside quotes. */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [[]];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') (rows.at(-1)!.push(field), (field = ''));
    else if (c === '\r' && text[i + 1] === '\n') {
      rows.at(-1)!.push(field);
      field = '';
      rows.push([]);
      i++;
    } else field += c;
  }
  if (field !== '' || rows.at(-1)!.length) rows.at(-1)!.push(field);
  const [header, ...body] = rows.filter((r) => r.length > 0);
  return body.map((r) => {
    expect(r.length).toBe(header.length);
    return Object.fromEntries(header.map((h, i) => [h, r[i]]));
  });
}

const csv = (name: string) => {
  const { output, stats } = convert(fixture(name), 'gpx', 'csv');
  expect(output.startsWith('﻿')).toBe(true); // BOM so Excel reads UTF-8
  return { rows: parseCsv(output.slice(1)), header: output.slice(1).split('\r\n')[0], stats };
};

describe('GPX → CSV', () => {
  it('strava.gpx: one row per point with elevation, time and sensor columns', () => {
    const { rows, header } = csv('strava.gpx');
    expect(header).toBe(
      'type,name,description,segment,latitude,longitude,elevation,time,heart_rate,cadence,temperature,power',
    );
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      type: 'track',
      name: "120' moderate and hard",
      description: '',
      segment: '1',
      latitude: '42.941059',
      longitude: '0.963041',
      elevation: '721.2',
      time: '2018-05-14T14:54:21Z',
      heart_rate: '117',
      cadence: '85',
      temperature: '22',
      power: '75',
    });
    expect(rows[1].power).toBe(''); // missing sensor value → empty cell, not "null"
  });

  it('blue_hills.gpx: waypoints and numbered track segments', () => {
    const { rows, header, stats } = csv('blue_hills.gpx');
    expect(header).toBe('type,name,description,segment,latitude,longitude,elevation,time');
    expect(rows).toHaveLength(1242 + 46);
    expect(stats.points).toBe(rows.length);

    const waypoints = rows.filter((r) => r.type === 'waypoint');
    expect(waypoints).toHaveLength(46);
    expect(waypoints.every((r) => r.segment === '')).toBe(true);
    expect(waypoints.some((r) => r.description !== '')).toBe(true);

    const buckHill = rows.filter((r) => r.name === 'BUCK HILL');
    expect(buckHill.filter((r) => r.segment === '1')).toHaveLength(172);
    expect(buckHill.filter((r) => r.segment === '2')).toHaveLength(326);
    expect(buckHill[0]).toMatchObject({
      type: 'track',
      latitude: '42.209988',
      longitude: '-71.096585',
      time: '2001-10-13T17:55:59Z',
    });
  });

  it('trek.gpx: route points are labelled as route', () => {
    const { rows } = csv('trek.gpx');
    expect(rows).toHaveLength(120);
    expect(new Set(rows.map((r) => r.type))).toEqual(new Set(['route']));
    expect(rows[0]).toMatchObject({ latitude: '44.907783722', longitude: '6.05487864642', elevation: '1298' });
  });

  it('wpt.gpx: bare waypoints leave optional cells empty', () => {
    const { rows } = csv('wpt.gpx');
    expect(rows).toHaveLength(40);
    expect(rows[0]).toMatchObject({ type: 'waypoint', name: '', elevation: '', time: '', latitude: '51.197953' });
  });

  it('quotes special characters and defuses spreadsheet formulas', () => {
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
      <wpt lat="1" lon="2"><name>Hut, "upper"
second line</name></wpt>
      <wpt lat="3" lon="4"><name>=HYPERLINK("http://evil","x")</name><desc>@cmd</desc></wpt>
      <wpt lat="-5" lon="-6"><name>-12 Peak</name></wpt></gpx>`;
    const rows = parseCsv(convert(gpx, 'gpx', 'csv').output.slice(1));
    expect(rows[0].name).toBe('Hut, "upper"\nsecond line');
    expect(rows[1].name).toBe(`'=HYPERLINK("http://evil","x")`);
    expect(rows[1].description).toBe("'@cmd");
    expect(rows[2].name).toBe("'-12 Peak");
    // Numeric cells we generate ourselves are never prefixed.
    expect(rows[2]).toMatchObject({ latitude: '-5', longitude: '-6' });
  });
});

describe('KML → GeoJSON', () => {
  const geojson = (name: string) => JSON.parse(convert(fixture(name), 'kml', 'geojson').output) as FeatureCollection;

  it('gxtrack.kml: a timed track becomes a LineString with coordinateProperties.times', () => {
    const [track] = geojson('gxtrack.kml').features;
    expect(track.geometry.type).toBe('LineString');
    expect(positions(track)[0]).toEqual([-122.207881, 37.371915, 156]);
    expect(times(track)).toHaveLength(7);
  });

  it('gxmultitrack.kml: a multi-track becomes a MultiLineString', () => {
    const fc = geojson('gxmultitrack.kml');
    expect(fc.features.map((f) => f.geometry.type).sort()).toEqual(['MultiLineString', 'Point', 'Point']);
  });

  it('polygon.kml / multigeometry.kml: polygons and collections stay intact', () => {
    const [polygon] = geojson('polygon.kml').features;
    if (polygon.geometry.type !== 'Polygon') throw new Error(`expected Polygon, got ${polygon.geometry.type}`);
    expect(polygon.geometry.coordinates).toHaveLength(2); // outer boundary + one hole
    // Every ring is closed, as RFC 7946 requires.
    polygon.geometry.coordinates.forEach((ring) => expect(ring[0]).toEqual(ring.at(-1)));
    // A MultiGeometry of lines only is a MultiLineString…
    expect(geojson('multigeometry.kml').features[0].geometry.type).toBe('MultiLineString');
    // …while mixed types stay a GeometryCollection.
    const mixed = `<kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><MultiGeometry>
      <Point><coordinates>1,2</coordinates></Point>
      <LineString><coordinates>1,2 3,4</coordinates></LineString></MultiGeometry></Placemark></kml>`;
    const [feature] = (JSON.parse(convert(mixed, 'kml', 'geojson').output) as FeatureCollection).features;
    expect(feature.geometry).toMatchObject({
      type: 'GeometryCollection',
      geometries: [{ type: 'Point' }, { type: 'LineString' }],
    });
  });

  // The next three tests back factual claims made in the KML → GeoJSON FAQ.
  it('extended_data.kml: ExtendedData fields become properties', () => {
    const [feature] = geojson('extended_data.kml').features;
    expect(feature.properties).toMatchObject({ name: 'Extended data placemark', foo: 'bar' });
  });

  it('gxmultitrack.kml: line styles become simplestyle properties', () => {
    const track = geojson('gxmultitrack.kml').features.find((f) => f.geometry.type === 'MultiLineString')!;
    expect(track.properties).toMatchObject({ stroke: '#ff0000', 'stroke-width': 4 });
    expect(track.properties?.['stroke-opacity']).toBeCloseTo(0.498, 3);
  });

  it('ground overlays and network links keep only an outline and a URL', () => {
    const [overlay] = geojson('ground_overlay.kml').features;
    expect(overlay.geometry.type).toBe('Polygon');
    expect(overlay.properties?.icon).toMatch(/^https:\/\/.+\.jpg$/);
    const [link] = geojson('networklink.kml').features;
    expect(link.geometry.type).toBe('Polygon');
    expect(link.properties?.href).toBe('https://tiny.url');
  });

  it('never leaks the two-point-track sentinel (NaN serializes as null)', () => {
    const kml = `<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
      <Placemark><gx:Track><when>2020-01-01T00:00:00Z</when><when>2020-01-01T00:00:05Z</when>
      <gx:coord>10 50 100</gx:coord><gx:coord>10.001 50.001 101</gx:coord></gx:Track></Placemark></kml>`;
    const { output } = convert(kml, 'kml', 'geojson');
    expect(output).not.toContain('null');
    expect(positions((JSON.parse(output) as FeatureCollection).features[0])).toHaveLength(2);
  });
});
