/// <reference lib="webworker" />
import { convert, ConvertError, decodeXml } from '../lib/convert';
import type { ConvertRequest, ConvertResponse } from './protocol';
import { readBytes } from './read-bytes';

// The File is read here, not on the main thread, and nothing in this worker touches the network.
self.onmessage = async (event: MessageEvent<ConvertRequest>) => {
  const { file, from, to, mime } = event.data;
  let response: ConvertResponse;
  try {
    // Not file.text(): that always assumes UTF-8, and XML files declare their own encoding.
    const input = decodeXml(await readBytes(file));
    const { output, stats } = convert(input, from, to);
    response = { ok: true, blob: new Blob([output], { type: mime }), stats };
  } catch (e) {
    response =
      e instanceof ConvertError
        ? { ok: false, code: e.code }
        : { ok: false, code: 'unknown', detail: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
  }
  self.postMessage(response);
};
