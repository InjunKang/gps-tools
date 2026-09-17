import { DOMParser } from '@xmldom/xmldom';
import { ConvertError } from './types';

/**
 * Parses XML without a browser DOM (Web Workers have no DOMParser) and checks the root element.
 * The return type is the standard `Document` because that is what togeojson accepts.
 */
export function parseXml(text: string, expectedRoot: string): Document {
  let doc;
  try {
    // Warnings and recoverable errors are ignored: real-world exports are often sloppy.
    doc = new DOMParser({ onError: () => {} }).parseFromString(text, 'text/xml');
  } catch (e) {
    throw new ConvertError('invalid-file', e instanceof Error ? e.message : String(e));
  }
  const root = doc.documentElement;
  if (!root) throw new ConvertError('invalid-file', 'no root element');
  if (root.localName !== expectedRoot) {
    throw new ConvertError('wrong-format', `expected <${expectedRoot}>, got <${root.localName}>`);
  }
  return doc as unknown as Document;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

// Characters that are illegal in XML 1.0 even when escaped.
const ILLEGAL = /[^\x09\x0A\x0D\x20-퟿-�\u{10000}-\u{10FFFF}]/gu;

export const escapeXml = (value: string): string =>
  value.replace(ILLEGAL, '').replace(/[&<>"]/g, (c) => ESCAPES[c]);

/** `<tag>escaped text</tag>`, or an empty string when there is nothing to write. */
export function el(tag: string, value: unknown): string {
  if (value === undefined || value === null) return '';
  const text = String(value).trim();
  return text === '' ? '' : `<${tag}>${escapeXml(text)}</${tag}>`;
}
