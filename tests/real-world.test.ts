// Regressions found by converting real exports from Strava, Garmin Connect, Komoot and Google Earth.
import { describe, expect, it } from 'vitest';
import type { FeatureCollection } from 'geojson';
import { convert, decodeXml } from '../src/lib/convert';

describe('Garmin Connect exports', () => {
  // Garmin Connect binds the TrackPointExtension namespace to `ns3`, not the usual `gpxtpx`.
  // Structure copied from a real export.
  const garmin = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="Garmin Connect" version="1.1"
  xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
  <trk><type>running</type><trkseg>
    <trkpt lat="60.2919866" lon="25.0248552"><ele>11.6</ele><time>2018-04-23T15:54:34.000Z</time>
      <extensions><ns3:TrackPointExtension><ns3:hr>61</ns3:hr><ns3:cad>0</ns3:cad></ns3:TrackPointExtension></extensions></trkpt>
    <trkpt lat="60.2919870" lon="25.0248560"><ele>11.8</ele><time>2018-04-23T15:54:35.000Z</time>
      <extensions><ns3:TrackPointExtension><ns3:hr>64</ns3:hr><ns3:cad>82</ns3:cad></ns3:TrackPointExtension></extensions></trkpt>
  </trkseg></trk></gpx>`;

  it('keeps heart rate and cadence in GeoJSON', () => {
    const fc = JSON.parse(convert(garmin, 'gpx', 'geojson').output) as FeatureCollection;
    expect(fc.features[0].properties?.coordinateProperties).toMatchObject({ heart: [61, 64], cads: [0, 82] });
  });

  it('keeps heart rate and cadence in CSV', () => {
    const [header, first, second] = convert(garmin, 'gpx', 'csv').output.slice(1).split('\r\n');
    expect(header).toBe('type,name,description,segment,latitude,longitude,elevation,time,heart_rate,cadence');
    expect(first.endsWith(',61,0')).toBe(true);
    expect(second.endsWith(',64,82')).toBe(true);
  });
});

describe('Google Earth KML drawn on the ground', () => {
  // Paths and placemarks drawn in Google Earth are clamped to the ground and carry a literal
  // altitude of 0. Written as <ele>0</ele>, GPX editors show a flat 0 m profile and bogus
  // ascent/descent totals, so an all-zero altitude is treated as "no altitude".
  const kml = (coords: string, extra = '') =>
    `<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
      <Placemark><name>Path</name><LineString><tessellate>1</tessellate><coordinates>${coords}</coordinates></LineString></Placemark>
      ${extra}</Document></kml>`;

  it('omits <ele> when every altitude of a feature is 0', () => {
    const { output } = convert(kml('151.83,-26.56,0 151.84,-26.57,0 151.85,-26.58,0'), 'kml', 'gpx');
    expect(output).not.toContain('<ele>');
    expect(output).toContain('<trkpt lat="-26.56" lon="151.83"></trkpt>');
  });

  it('keeps real altitudes, including a genuine 0 among them', () => {
    const { output } = convert(kml('8.5,47.3,412 8.6,47.4,0 8.7,47.5,398'), 'kml', 'gpx');
    expect(output.match(/<ele>/g)).toHaveLength(3);
    expect(output).toContain('<ele>0</ele>');
  });

  it('decides per feature, and also cleans GeoJSON output', () => {
    const point = '<Placemark><name>Summit</name><Point><coordinates>8.5,47.3,2500</coordinates></Point></Placemark>';
    const fc = JSON.parse(convert(kml('1,2,0 3,4,0', point), 'kml', 'geojson').output) as FeatureCollection;
    expect(fc.features[0].geometry).toEqual({ type: 'LineString', coordinates: [[1, 2], [3, 4]] });
    expect(fc.features[1].geometry).toEqual({ type: 'Point', coordinates: [8.5, 47.3, 2500] });
  });
});

describe('decodeXml', () => {
  const bytes = (...parts: (string | number[])[]) =>
    new Uint8Array(parts.flatMap((p) => (typeof p === 'string' ? [...new TextEncoder().encode(p)] : p)));

  it('defaults to UTF-8 and strips a BOM', () => {
    expect(decodeXml(bytes('<gpx><name>Zürich 東京</name></gpx>'))).toContain('Zürich 東京');
    expect(decodeXml(bytes([0xef, 0xbb, 0xbf], '<gpx/>'))).toBe('<gpx/>');
  });

  it('honours the encoding of the XML declaration (older tools write ISO-8859-1)', () => {
    // 0xFC is "ü" in ISO-8859-1 and an invalid byte in UTF-8.
    const latin1 = bytes('<?xml version="1.0" encoding="ISO-8859-1"?><gpx><name>Z', [0xfc], 'rich</name></gpx>');
    expect(decodeXml(latin1)).toContain('<name>Zürich</name>');
    const single = bytes("<?xml version='1.0' encoding='windows-1252'?><gpx><name>caf", [0xe9], '</name></gpx>');
    expect(decodeXml(single)).toContain('café');
  });

  it('reads UTF-16 files by their BOM', () => {
    const text = '<gpx><name>Grüße</name></gpx>';
    const utf16le = [0xff, 0xfe, ...[...text].flatMap((c) => [c.charCodeAt(0) & 0xff, c.charCodeAt(0) >> 8])];
    expect(decodeXml(new Uint8Array(utf16le))).toBe(text);
  });

  it('falls back to UTF-8 for an unknown encoding label', () => {
    expect(decodeXml(bytes('<?xml version="1.0" encoding="x-nonsense"?><gpx/>'))).toContain('<gpx/>');
  });

  it('end to end: a Latin-1 waypoint name survives GPX → KML', () => {
    const latin1 = bytes(
      '<?xml version="1.0" encoding="ISO-8859-1"?><gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><wpt lat="47.37" lon="8.54"><name>Z',
      [0xfc],
      'rich</name></wpt></gpx>',
    );
    expect(convert(decodeXml(latin1), 'gpx', 'kml').output).toContain('<name>Zürich</name>');
  });
});

describe('GPX → KML attributes', () => {
  it('keeps track-level GPX fields as ExtendedData but not stray per-point sensor readings', async () => {
    const { fixture } = await import('./helpers');
    const blueHills = convert(fixture('blue_hills.gpx'), 'gpx', 'kml').output;
    expect(blueHills).toContain('<Data name="cmt"><value>Sun Jun 24 15:08:39 2001</value></Data>');
    const strava = convert(fixture('strava.gpx'), 'gpx', 'kml').output;
    expect(strava).not.toContain('gpxtpx_');
  });
});
