import { describe, expect, it } from 'vitest';
import type { FeatureCollection } from 'geojson';
import { convert, ConvertError } from '../src/lib/convert';
import { readGpx } from '../src/lib/convert/readers/gpx';
import { readKml } from '../src/lib/convert/readers/kml';
import { fixture, parseXmlStrict, positions, times } from './helpers';

const expectClose = (actual: number[][], expected: number[][]) => {
  expect(actual.length).toBe(expected.length);
  actual.forEach((pos, i) => {
    expect(pos.length).toBe(expected[i].length);
    pos.forEach((n, j) => expect(n).toBeCloseTo(expected[i][j], 7));
  });
};

describe('GPX → KML', () => {
  it('strava.gpx: keeps name, coordinates, elevation and per-point time', () => {
    const { output, stats } = convert(fixture('strava.gpx'), 'gpx', 'kml');
    const doc = parseXmlStrict(output);
    expect(doc.documentElement?.localName).toBe('kml');
    expect(doc.documentElement?.namespaceURI).toBe('http://www.opengis.net/kml/2.2');

    const [track] = readKml(output).features;
    expect(track.properties?.name).toBe("120' moderate and hard");
    expectClose(positions(track), [
      [0.963041, 42.941059, 721.2],
      [0.945471, 42.907866, 1118.8],
      [0.962304, 42.936951, 592.2],
    ]);
    expect(times(track)).toEqual(times(readGpx(fixture('strava.gpx')).features[0]));
    expect(times(track)[0]).toBe('2018-05-14T14:54:21Z');
    expect(stats).toEqual({ features: 1, points: 3 });
  });

  it('blue_hills.gpx: 46 waypoints + 3 multi-segment tracks, 1243 track points', () => {
    const source = readGpx(fixture('blue_hills.gpx'));
    const { output, stats } = convert(fixture('blue_hills.gpx'), 'gpx', 'kml');
    parseXmlStrict(output);
    const result = readKml(output);

    const points = result.features.filter((f) => f.geometry.type === 'Point');
    const lines = result.features.filter((f) => f.geometry.type !== 'Point');
    expect(points).toHaveLength(46);
    expect(lines.map((f) => f.properties?.name)).toEqual(['BIG LOOP', 'BUCK HILL', 'SHORT LOOP']);
    // The file has 1243 <trkpt>, but one segment holds a single point. A one-point line is
    // not valid GeoJSON (the pivot format), so that segment is dropped: 1242 points remain.
    expect(lines.flatMap(positions)).toHaveLength(1242);
    expect(stats.points).toBe(1242 + 46);

    // Segment structure survives: BUCK HILL has 2 segments, SHORT LOOP has 3.
    const srcLines = source.features.filter((f) => f.geometry.type !== 'Point');
    lines.forEach((line, i) => {
      expect(line.geometry).toMatchObject({ type: srcLines[i].geometry.type });
      expectClose(positions(line), positions(srcLines[i]));
      expect(times(line)).toEqual(times(srcLines[i]));
    });

    const wp = points[0];
    const srcWp = source.features.find((f) => f.geometry.type === 'Point')!;
    expect(wp.properties?.name).toBe(srcWp.properties?.name);
    expectClose(positions(wp), positions(srcWp));
  });

  it('trek.gpx: a route becomes a plain LineString', () => {
    const [line] = readKml(convert(fixture('trek.gpx'), 'gpx', 'kml').output).features;
    expect(line.geometry.type).toBe('LineString');
    expect(positions(line)).toHaveLength(120);
    expectClose([positions(line)[0]], [[6.05487864642, 44.907783722, 1298]]);
  });

  it('wpt.gpx: 40 bare waypoints without a namespace', () => {
    const result = readKml(convert(fixture('wpt.gpx'), 'gpx', 'kml').output);
    expect(result.features).toHaveLength(40);
    expectClose(positions(result.features[0]), [[6.679844, 51.197953]]);
  });
});

describe('KML → GPX', () => {
  it('gxtrack.kml: gx:Track becomes a track with time and elevation', () => {
    const { output } = convert(fixture('gxtrack.kml'), 'kml', 'gpx');
    const doc = parseXmlStrict(output);
    expect(doc.documentElement?.localName).toBe('gpx');
    expect(doc.documentElement?.getAttribute('version')).toBe('1.1');
    expect(doc.documentElement?.namespaceURI).toBe('http://www.topografix.com/GPX/1/1');
    expect(doc.getElementsByTagName('trkpt')).toHaveLength(7);

    const [track] = readGpx(output).features;
    expect(track.properties?._gpxType).toBe('trk');
    expectClose(positions(track).slice(0, 2), [
      [-122.207881, 37.371915, 156],
      [-122.205712, 37.373288, 152],
    ]);
    expect(times(track)).toEqual([
      '2010-05-28T02:02:09Z',
      '2010-05-28T02:02:35Z',
      '2010-05-28T02:02:44Z',
      '2010-05-28T02:02:53Z',
      '2010-05-28T02:02:54Z',
      '2010-05-28T02:02:55Z',
      '2010-05-28T02:02:56Z',
    ]);
  });

  it('gxmultitrack.kml: points become waypoints, the multi-track becomes segments', () => {
    const source = readKml(fixture('gxmultitrack.kml'));
    const result = readGpx(convert(fixture('gxmultitrack.kml'), 'kml', 'gpx').output);
    expect(result.features.map((f) => f.geometry.type).sort()).toEqual(
      source.features.map((f) => f.geometry.type).sort(),
    );
    expect(result.features.flatMap(positions)).toHaveLength(source.features.flatMap(positions).length);
    const wp = result.features.find((f) => f.geometry.type === 'Point')!;
    expect(wp.properties?.name).toBe('12/04/2014 11:24 AM (départ)'); // trimmed
  });

  it('point / linestring / polygon / multigeometry: every coordinate is carried over', () => {
    for (const name of ['point.kml', 'linestring.kml', 'polygon.kml', 'multigeometry.kml']) {
      const source = readKml(fixture(name));
      const { output } = convert(fixture(name), 'kml', 'gpx');
      parseXmlStrict(output);
      const result = readGpx(output);
      expectClose(result.features.flatMap(positions), source.features.flatMap(positions));
    }
  });

  it('reads a two-point gx:Track as a line (togeojson alone drops the second point)', () => {
    const kml = `<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
      <Placemark><gx:Track>
        <when>2020-01-01T00:00:00Z</when><when>2020-01-01T00:00:05Z</when>
        <gx:coord>10 50 100</gx:coord><gx:coord>10.001 50.001 101</gx:coord>
      </gx:Track></Placemark></kml>`;
    const [line] = readKml(kml).features;
    expect(line.geometry).toEqual({
      type: 'LineString',
      coordinates: [
        [10, 50, 100],
        [10.001, 50.001, 101],
      ],
    });
    expect(times(line)).toEqual(['2020-01-01T00:00:00Z', '2020-01-01T00:00:05Z']);
  });

  it('GPX element order follows the schema: wpt, then rte, then trk', () => {
    const { output } = convert(fixture('gxmultitrack.kml'), 'kml', 'gpx');
    expect(output.lastIndexOf('<wpt')).toBeLessThan(output.indexOf('<trk>'));
  });
});

describe('GPX → GeoJSON', () => {
  it('produces RFC 7946 GeoJSON in lon/lat order', () => {
    const { output } = convert(fixture('multitrackgpx.gpx'), 'gpx', 'geojson');
    const fc = JSON.parse(output) as FeatureCollection;
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features).toHaveLength(3);
    expect(fc.features.map((f) => f.properties?.name)).toEqual(['Tag 1', 'Tag 2', 'Tag 3']);
    expect(fc.features.flatMap(positions)).toHaveLength(117);
    const [lon, lat, ele] = positions(fc.features[0])[0];
    expect([lon, lat]).toEqual([8.1783223, 48.2805591]); // Black Forest: lon ≈ 8, lat ≈ 48
    expect(ele).toBeCloseTo(258.7319336, 6);
    expect(times(fc.features[0])).toHaveLength(38);
  });
});

describe('GPX → GeoJSON sensor data', () => {
  // The GPX → GeoJSON FAQ promises this; keep the promise honest.
  it('strava.gpx: heart rate, cadence and temperature survive in coordinateProperties', () => {
    const fc = JSON.parse(convert(fixture('strava.gpx'), 'gpx', 'geojson').output) as FeatureCollection;
    expect(fc.features[0].properties?.coordinateProperties).toMatchObject({
      heart: [117, 154, 160],
      cads: [85, 79, 85],
      atemps: [22, 20, 21],
    });
  });
});

describe('round trip', () => {
  it('GPX → KML → GPX preserves geometry, names and times', () => {
    for (const name of ['strava.gpx', 'blue_hills.gpx', 'multitrackgpx.gpx']) {
      const source = readGpx(fixture(name));
      const kml = convert(fixture(name), 'gpx', 'kml').output;
      const back = readGpx(convert(kml, 'kml', 'gpx').output);
      expect(back.features).toHaveLength(source.features.length);
      const key = (fc: FeatureCollection) =>
        fc.features.map((f) => `${f.geometry.type}:${f.properties?.name ?? ''}`).sort();
      expect(key(back)).toEqual(key(source));
      const lines = (fc: FeatureCollection) => fc.features.filter((f) => f.geometry.type !== 'Point');
      expectClose(lines(back).flatMap(positions), lines(source).flatMap(positions));
      expect(lines(back).flatMap(times)).toEqual(lines(source).flatMap(times));
    }
  });
});

describe('escaping and errors', () => {
  it('escapes XML special characters and CDATA content', () => {
    const gpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
      <wpt lat="1" lon="2"><name>Tom &amp; Jerry &lt;café&gt; "x"</name><desc><![CDATA[a ]]]]><![CDATA[> b <b>&</b>]]></desc></wpt></gpx>`;
    const { output } = convert(gpx, 'gpx', 'kml');
    parseXmlStrict(output);
    const [p] = readKml(output).features;
    expect(p.properties?.name).toBe('Tom & Jerry <café> "x"');
    expect(p.properties?.description).toBe('a ]]> b <b>&</b>');

    const cdata = readGpx(convert(fixture('cdata.kml'), 'kml', 'gpx').output).features[0];
    expect(cdata.properties?.desc).toBe('Here is some text');
  });

  const code = (fn: () => unknown) => {
    try {
      fn();
    } catch (e) {
      expect(e).toBeInstanceOf(ConvertError);
      return (e as ConvertError).code;
    }
    return 'no error';
  };

  it('reports malformed XML', () => {
    expect(code(() => convert('<gpx><trk></gpx', 'gpx', 'kml'))).toBe('invalid-file');
    expect(code(() => convert('not xml at all', 'gpx', 'kml'))).toBe('invalid-file');
    expect(code(() => convert('', 'kml', 'gpx'))).toBe('invalid-file');
  });

  it('reports a file of the wrong format', () => {
    expect(code(() => convert(fixture('point.kml'), 'gpx', 'kml'))).toBe('wrong-format');
    expect(code(() => convert(fixture('strava.gpx'), 'kml', 'gpx'))).toBe('wrong-format');
  });

  it('reports a valid file with nothing to convert', () => {
    const empty = '<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"></gpx>';
    expect(code(() => convert(empty, 'gpx', 'geojson'))).toBe('empty');
  });
});
