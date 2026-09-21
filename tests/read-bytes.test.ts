import { afterEach, describe, expect, it, vi } from 'vitest';
import { readBytes } from '../src/workers/read-bytes';

const bytes = new Uint8Array([60, 103, 112, 120, 47, 62]); // "<gpx/>"

describe('readBytes', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses Blob.arrayBuffer() where it exists', async () => {
    expect(await readBytes(new Blob([bytes]))).toEqual(bytes);
  });

  // iPadOS 13: no Blob.arrayBuffer(), but FileReader is there.
  it('falls back to FileReader on browsers without Blob.arrayBuffer()', async () => {
    const blob = new Blob([bytes]);
    Object.defineProperty(blob, 'arrayBuffer', { value: undefined });
    vi.stubGlobal(
      'FileReader',
      class {
        result: ArrayBuffer | null = null;
        error: Error | null = null;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        readAsArrayBuffer(b: Blob) {
          Blob.prototype.arrayBuffer.call(b).then((buf) => {
            this.result = buf;
            this.onload?.();
          });
        }
      },
    );
    expect(await readBytes(blob)).toEqual(bytes);
  });
});
