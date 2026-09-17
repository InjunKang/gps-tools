import type { FeatureCollection } from 'geojson';

export type FormatId = 'gpx' | 'kml' | 'geojson' | 'csv';

export type Reader = (text: string) => FeatureCollection;
export type Writer = (fc: FeatureCollection) => string;

export type ConvertErrorCode = 'invalid-file' | 'wrong-format' | 'empty' | 'unsupported' | 'not-wgs84';

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
