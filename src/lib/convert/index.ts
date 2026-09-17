import { countPoints } from './geometry';
import { readGpx } from './readers/gpx';
import { readKml } from './readers/kml';
import { ConvertError, type ConvertResult, type FormatId, type Reader, type Writer } from './types';
import { writeGeojson } from './writers/geojson';
import { writeGpx } from './writers/gpx';
import { writeKml } from './writers/kml';

export { ConvertError } from './types';
export type { ConvertErrorCode, ConvertResult, ConvertStats, FormatId } from './types';

// GeoJSON is the pivot: a new format needs one reader and/or one writer, never a pair converter.
export const readers: Partial<Record<FormatId, Reader>> = { gpx: readGpx, kml: readKml };
export const writers: Partial<Record<FormatId, Writer>> = { gpx: writeGpx, kml: writeKml, geojson: writeGeojson };

export function convert(input: string, from: FormatId, to: FormatId): ConvertResult {
  const read = readers[from];
  const write = writers[to];
  if (!read || !write) throw new ConvertError('unsupported', `${from} → ${to}`);

  const fc = read(input);
  if (fc.features.length === 0) throw new ConvertError('empty');
  return { output: write(fc), stats: { features: fc.features.length, points: countPoints(fc) } };
}
