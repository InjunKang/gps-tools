// `Blob.text()` always decodes as UTF-8, but XML files say what they are: older GPS tools
// write ISO-8859-1 / windows-1252, and some Windows tools write UTF-16.

const DECLARED = /^<\?xml[^>]*?encoding\s*=\s*["']([\w.-]+)["']/i;

function detectEncoding(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return 'utf-16le';
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return 'utf-16be';
  // The declaration itself is ASCII in every encoding we can get here, so latin1 reads it safely.
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 200)).replace(/^﻿|^ï»¿/, '');
  return DECLARED.exec(head)?.[1] ?? 'utf-8';
}

/** Decodes an XML file using its BOM or the encoding named in its XML declaration. */
export function decodeXml(bytes: Uint8Array): string {
  let decoder: TextDecoder;
  try {
    decoder = new TextDecoder(detectEncoding(bytes));
  } catch {
    decoder = new TextDecoder('utf-8'); // unknown label
  }
  return decoder.decode(bytes); // TextDecoder strips the BOM
}
