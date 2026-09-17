import type { Writer } from '../types';

// One feature per line: readable and diffable without the size blow-up of fully
// pretty-printed coordinate arrays (tracks routinely have tens of thousands of points).
export const writeGeojson: Writer = (fc) =>
  `{"type":"FeatureCollection","features":[\n${fc.features.map((f) => JSON.stringify(f)).join(',\n')}\n]}\n`;
