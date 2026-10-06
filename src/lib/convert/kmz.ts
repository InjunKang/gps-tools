import { unzipSync } from 'fflate';
import { ConvertError } from './types';

// A KMZ is a ZIP archive holding one main KML plus the images it references. Not the browser's
// DecompressionStream: that needs Safari 16.4, and fflate is plain JS that also runs in Node tests.

/** Same limit as for the files the page accepts; the archive's own size header bounds the allocation. */
export const MAX_UNZIPPED_BYTES = 200 * 1024 * 1024;

/** ZIP local file header signature "PK\x03\x04". */
export const isZip = (bytes: Uint8Array): boolean =>
  bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

// Windows' Compress-Archive writes "files\notes.txt"; macOS Finder adds "__MACOSX/._doc.kml" forks.
const normalize = (name: string): string => name.replace(/\\/g, '/');
const isKml = (name: string): boolean => /\.kml$/i.test(name) && !/(^|\/)(__MACOSX\/|\._)/.test(name);

function unzip(zip: Uint8Array, filter: (file: { name: string; originalSize: number }) => boolean) {
  try {
    return unzipSync(zip, { filter });
  } catch (e) {
    if (e instanceof ConvertError) throw e;
    throw new ConvertError('invalid-file', `unreadable KMZ: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Returns the bytes of the main KML in a KMZ: `doc.kml` at the root, otherwise the first `.kml`
 * entry, which is what Google Earth opens. The bytes are decoded later like any KML file.
 */
export function extractKml(zip: Uint8Array, maxBytes = MAX_UNZIPPED_BYTES): Uint8Array {
  // First pass reads only the directory, so images in the archive are never inflated.
  const names: string[] = [];
  unzip(zip, ({ name }) => {
    names.push(name);
    return false;
  });
  const main = names.find((n) => normalize(n).toLowerCase() === 'doc.kml') ?? names.find((n) => isKml(normalize(n)));
  if (main === undefined) throw new ConvertError('invalid-file', 'no .kml file in the KMZ');

  const entry = unzip(zip, ({ name, originalSize }) => {
    if (name !== main) return false;
    if (originalSize > maxBytes) throw new ConvertError('too-large', `${main} is ${originalSize} bytes`);
    return true;
  })[main];
  if (!entry) throw new ConvertError('invalid-file', `${main} could not be extracted`);
  return entry;
}
