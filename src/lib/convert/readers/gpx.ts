import { gpx } from '@tmcw/togeojson';
import type { Reader } from '../types';
import { parseXml } from '../xml';

const TRACK_POINT_EXTENSION =
  /xmlns:([\w.-]+)\s*=\s*["']http:\/\/www\.garmin\.com\/xmlschemas\/TrackPointExtension\/v[12]["']/;

// Workaround for togeojson <= 7.1.2: it finds heart rate, cadence, etc. by the literal prefix
// `gpxtpx:` instead of by namespace. Garmin Connect binds that namespace to `ns3`, so its sensor
// data was silently dropped. Rewrite whatever prefix the file uses to `gpxtpx`.
function normalizeExtensionPrefix(text: string): string {
  const prefix = TRACK_POINT_EXTENSION.exec(text.slice(0, 8192))?.[1];
  if (!prefix || prefix === 'gpxtpx') return text;
  // split/join rather than replaceAll: Safari < 13.1 has no replaceAll.
  return text
    .split(`<${prefix}:`).join('<gpxtpx:')
    .split(`</${prefix}:`).join('</gpxtpx:')
    .replace(`xmlns:${prefix}=`, 'xmlns:gpxtpx=');
}

export const readGpx: Reader = (text) => gpx(parseXml(normalizeExtensionPrefix(text), 'gpx'));
