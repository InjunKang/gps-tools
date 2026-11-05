import type { FeatureCollection } from 'geojson';

/** `kmz` is output-only: KMZ input is read by the `kml` tools (see `decodeInput`). */
export type FormatId = 'gpx' | 'kml' | 'kmz' | 'geojson' | 'csv';

export type Reader = (text: string) => FeatureCollection;
export type Writer = (fc: FeatureCollection) => string;

export type ConvertErrorCode = 'invalid-file' | 'wrong-format' | 'empty' | 'unsupported' | 'not-wgs84' | 'too-large';

/** `code` is what the UI translates; `message` is for developers only. */
export class ConvertError extends Error {
  constructor(
    public readonly code: ConvertErrorCode,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'ConvertError';
  }
}

export interface ConvertStats {
  features: number;
  points: number;
}

export interface ConvertResult {
  output: string;
  stats: ConvertStats;
}
