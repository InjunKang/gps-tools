# Design

Browser-only GPS file converters. Files are never sent to a server. Rules for working in this
repo are in [`CLAUDE.md`](../CLAUDE.md); this document records why the structure is what it is.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Conversion engine | GeoJSON pivot: one reader and one writer per format | N formats cost 2N modules instead of N² converters; a new tool is one config entry |
| XML parsing | `@xmldom/xmldom` + `@tmcw/togeojson` inside the worker | Web Workers have no `DOMParser` |
| Writers | Hand-written GPX / KML / GeoJSON serializers | `tokml` / `togpx` are unmaintained; own writers keep elevation, time (`gx:Track`) and segments |
| Client code | Vanilla TS, no UI framework | Page-load JS is a ~2 KB inline script; the 100 KB worker loads only after a file is chosen |
| URL slugs | English in every locale (`/de/gpx-to-kml/`) | One slug per tool keeps config and hreflang trivial |
| Privacy enforcement | CSP `connect-src 'self'` via Astro `security.csp` (meta tag with hashes) | Makes "no upload" a technical guarantee, independent of hosting |
| Hosting | Cloudflare static assets (`wrangler.jsonc` → `dist/`) | No adapter or server code needed |

## Data flow

```
File (drop / picker)
  └─ main thread: size check only, never reads contents
       └─ postMessage({ file, from, to, mime }) ─▶ convert.worker.ts
            file.text() → readers[from] → GeoJSON → writers[to] → Blob
       ◀─ { ok, blob, stats } | { ok: false, code }
  └─ object URL on the download link; error codes map to translated messages
```

## Page generation

`src/config/tools.ts` (formats + tools + per-locale copy) drives everything:
`[...locale]/[tool].astro` builds locales × tools, `[...locale]/index.astro` builds the home pages,
related tools are derived from shared formats, and `@astrojs/sitemap` emits hreflang alternates.
`Record<Locale, …>` types make a missing translation a compile error.

## What conversions keep and lose

- Kept: waypoints, routes, tracks, multi-segment structure, names, descriptions, elevation, per-point time.
- GPX → GeoJSON also keeps heart rate / cadence / temperature in `coordinateProperties`.
- Lost: GPX sensor extensions when writing KML; KML styles; polygons become tracks in GPX.
- A track segment with a single point is dropped (not a valid GeoJSON line).

## Not in v1

Batch conversion / zip, KMZ, map preview, service worker for offline use, automated browser E2E
(the worker path was verified manually with headless Chrome), real deployment.

## Open items for the owner

- Site name and domain are placeholders in `src/config/site.ts`.
- de / ja / es copy was machine-written; have a native speaker review before launch.
- Choosing an ad network means adding its domains to the CSP, which weakens the `connect-src 'self'`
  guarantee. Decide how to word the privacy claim at that point.
