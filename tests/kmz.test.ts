import { describe, expect, it } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { convert, ConvertError, decodeInput } from '../src/lib/convert';
import { extractKml } from '../src/lib/convert/kmz';
import { fixture, fixtureBytes, parseXmlStrict } from './helpers';

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
