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
  return text
    .replaceAll(`<${prefix}:`, '<gpxtpx:')
    .replaceAll(`</${prefix}:`, '</gpxtpx:')
    .replace(`xmlns:${prefix}=`, 'xmlns:gpxtpx=');
}

export const readGpx: Reader = (text) => gpx(parseXml(normalizeExtensionPrefix(text), 'gpx'));
