import type { ConvertErrorCode, ConvertStats, FormatId } from '../lib/convert/types';

export interface ConvertRequest {
  file: File;
  from: FormatId;
  to: FormatId;
  mime: string;
}

export type ConvertResponse =
  | { ok: true; blob: Blob; stats: ConvertStats }
  /** `detail` is the raw exception message for 'unknown', shown small under the translated text. */
  | { ok: false; code: ConvertErrorCode | 'unknown'; detail?: string };
