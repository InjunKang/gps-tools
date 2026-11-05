import { describe, expect, it } from 'vitest';
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { convert, ConvertError, decodeInput, encodeOutput } from '../src/lib/convert';
import { extractKml, isZip } from '../src/lib/convert/kmz';
import { readGpx } from '../src/lib/convert/readers/gpx';
import { readKml } from '../src/lib/convert/readers/kml';
import { fixture, fixtureBytes, parseXmlStrict, positions, times } from './helpers';

const kml = (name: string) =>
  `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>${name}</name><Point><coordinates>10,20</coordinates></Point></Placemark></kml>`;

const names = (text: string) => [...text.matchAll(/<name>([^<]*)<\/name>/g)].map((m) => m[1]);

const codeOf = (fn: () => unknown): string => {
  try {
    fn();
  } catch (e) {
    if (e instanceof ConvertError) return e.code;
    throw e;
  }
  throw new Error('did not throw');
};

describe('KMZ input', () => {
  it('gxtrack.kmz (Windows Compress-Archive: backslash paths, doc.kml not first) reads like the KML', () => {
    const bytes = fixtureBytes('gxtrack.kmz');
    expect(decodeInput(bytes, 'kml')).toBe(fixture('gxtrack.kml'));

    const gpx = parseXmlStrict(convert(decodeInput(bytes, 'kml'), 'kml', 'gpx').output);
    const points = Array.from(gpx.getElementsByTagName('trkpt'));
    expect(points.length).toBe(7);
    expect(points[0].getAttribute('lon')).toBe('-122.207881');
    expect(points[0].getElementsByTagName('time')[0].textContent).toBe('2010-05-28T02:02:09Z');
  });

  it('prefers doc.kml at the root over other KML files in the archive', () => {
    const zip = zipSync({ 'layers/extra.kml': strToU8(kml('extra')), 'doc.kml': strToU8(kml('main')) });
    expect(names(decodeInput(zip, 'kml'))).toEqual(['main']);
  });

  it('without doc.kml, uses the first .kml entry and ignores macOS resource forks', () => {
    const zip = zipSync({
      '__MACOSX/._Track.KML': new Uint8Array([0, 5, 22, 7]),
      'images/pin.png': new Uint8Array([137, 80, 78, 71]),
      'Track.KML': strToU8(kml('first')),
      'second.kml': strToU8(kml('second')),
    });
    expect(names(decodeInput(zip, 'kml'))).toEqual(['first']);
  });

  it('reads stored (uncompressed) entries', () => {
    const zip = zipSync({ 'doc.kml': [strToU8(kml('stored')), { level: 0 }] });
    expect(names(decodeInput(zip, 'kml'))).toEqual(['stored']);
  });

  it('honours the encoding declared by the KML inside the archive', () => {
    const latin1 = `<?xml version="1.0" encoding="ISO-8859-1"?><kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Zürich</name><Point><coordinates>8.5,47.4</coordinates></Point></Placemark></kml>`;
    const bytes = Uint8Array.from(latin1, (c) => c.charCodeAt(0));
    expect(names(decodeInput(zipSync({ 'doc.kml': bytes }), 'kml'))).toEqual(['Zürich']);
  });

  it('still reads plain KML on the same tools', () => {
    expect(decodeInput(strToU8(kml('plain')), 'kml')).toBe(kml('plain'));
  });

  it('rejects an archive without a KML file', () => {
    const zip = zipSync({ 'images/pin.png': new Uint8Array([137, 80, 78, 71]) });
    expect(codeOf(() => decodeInput(zip, 'kml'))).toBe('invalid-file');
  });

  it('rejects a truncated archive', () => {
    const zip = zipSync({ 'doc.kml': strToU8(kml('cut')) });
    expect(codeOf(() => decodeInput(zip.subarray(0, zip.length - 30), 'kml'))).toBe('invalid-file');
  });

  it('refuses to inflate a KML larger than the limit', () => {
    const zip = zipSync({ 'doc.kml': strToU8(kml('x'.repeat(5000))) });
    expect(codeOf(() => extractKml(zip, 1000))).toBe('too-large');
  });

  it('does not unzip on GPX tools: a KMZ there is simply not a GPX file', () => {
    const zip = zipSync({ 'doc.kml': strToU8(kml('nope')) });
    expect(() => convert(decodeInput(zip, 'gpx'), 'gpx', 'kml')).toThrow(ConvertError);
  });
});

describe('KMZ output', () => {
  const toKmz = (gpx: string): Uint8Array => {
    const bytes = encodeOutput(convert(gpx, 'gpx', 'kmz').output, 'kmz');
    if (typeof bytes === 'string') throw new Error('KMZ output must be binary');
    return bytes;
  };

  it('blue_hills.gpx: one doc.kml at the root holding exactly the GPX → KML output', () => {
    const zip = toKmz(fixture('blue_hills.gpx'));
    expect(isZip(zip)).toBe(true);

    const entries = unzipSync(zip);
    expect(Object.keys(entries)).toEqual(['doc.kml']);
    expect(strFromU8(entries['doc.kml'])).toBe(convert(fixture('blue_hills.gpx'), 'gpx', 'kml').output);
  });

  it('blue_hills.gpx: reads back with all 46 waypoints, 3 tracks and 1242 track points', () => {
    const result = readKml(decodeInput(toKmz(fixture('blue_hills.gpx')), 'kml'));
    const points = result.features.filter((f) => f.geometry.type === 'Point');
    const lines = result.features.filter((f) => f.geometry.type !== 'Point');
    expect(points).toHaveLength(46);
    expect(lines.map((f) => f.properties?.name)).toEqual(['BIG LOOP', 'BUCK HILL', 'SHORT LOOP']);
    expect(lines.flatMap(positions)).toHaveLength(1242);
  });

  it('strava.gpx: keeps per-point time and elevation through the archive', () => {
    const [track] = readKml(decodeInput(toKmz(fixture('strava.gpx')), 'kml')).features;
    expect(times(track)).toEqual(times(readGpx(fixture('strava.gpx')).features[0]));
    expect(positions(track)[0]).toEqual([0.963041, 42.941059, 721.2]);
  });

  // Backs the FAQ claim that a track's KMZ is "a quarter of the size or less" (measured: ~16%).
  it('is compressed: a real track (blue_hills.gpx) is under a quarter of the size of its KML', () => {
    const kmlBytes = strToU8(convert(fixture('blue_hills.gpx'), 'gpx', 'kml').output).length;
    expect(toKmz(fixture('blue_hills.gpx')).length).toBeLessThan(kmlBytes / 4);
  });

  it('stores non-ASCII names as UTF-8, matching the declaration of the KML inside', () => {
    const gpx = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><wpt lat="47.4" lon="8.5"><name>Zürich 東京</name></wpt></gpx>`;
    expect(names(decodeInput(toKmz(gpx), 'kml'))).toEqual(['Zürich 東京']);
  });

  it('leaves text formats untouched', () => {
    expect(encodeOutput('<kml/>', 'kml')).toBe('<kml/>');
    expect(encodeOutput('a,b', 'csv')).toBe('a,b');
  });
});
