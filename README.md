# GPXKit

**Free GPS file converters that run entirely in your browser: [gpxkit.com](https://gpxkit.com)**

Convert between GPX, KML, GeoJSON and CSV. Files are parsed and converted in a Web Worker on
your own device and are never uploaded — this repository is public so anyone can verify that.
A `connect-src 'self'` Content Security Policy makes it impossible for the page to send data anywhere.

| Tool | |
|---|---|
| [GPX → KML](https://gpxkit.com/gpx-to-kml/) | [KML → GPX](https://gpxkit.com/kml-to-gpx/) |
| [GPX → GeoJSON](https://gpxkit.com/gpx-to-geojson/) | [GeoJSON → GPX](https://gpxkit.com/geojson-to-gpx/) |
| [KML → GeoJSON](https://gpxkit.com/kml-to-geojson/) | [GeoJSON → KML](https://gpxkit.com/geojson-to-kml/) |
| [GPX → CSV](https://gpxkit.com/gpx-to-csv/) | |

Also in [Deutsch](https://gpxkit.com/de/), [日本語](https://gpxkit.com/ja/), [Español](https://gpxkit.com/es/),
[한국어](https://gpxkit.com/ko/), [Français](https://gpxkit.com/fr/), [Italiano](https://gpxkit.com/it/) and
[Português](https://gpxkit.com/pt/).

What survives a conversion: waypoints, routes, multi-segment tracks, elevation, timestamps
(`gx:Track` in KML), heart rate / cadence / temperature / power (Garmin `TrackPointExtension` in
GPX, `coordinateProperties` in GeoJSON), and feature attributes (`ExtendedData` in KML).
Tested against real exports from Strava, Garmin Connect, Komoot, Google Earth and QGIS.

Astro (static build) + TypeScript, deployed to Cloudflare as static assets.
Project rules are in [`CLAUDE.md`](CLAUDE.md), design notes in [`docs/design.md`](docs/design.md),
current status and next steps in [`docs/HANDOFF.md`](docs/HANDOFF.md) (Korean).

## Develop

Requires Node 22.12+.

```sh
npm install
npm run dev       # http://localhost:4321
npm test          # unit + config tests (and dist/ checks if a build exists)
npm run verify    # type-check, build, then all tests — run before every push
```

Adding a tool is one entry in [`src/config/tools.ts`](src/config/tools.ts).

## Configuration

| Variable | Where | Purpose |
|---|---|---|
| `SITE_URL` | build environment | Production origin: `https://gpxkit.com`. Used for canonical URLs, hreflang, `sitemap-index.xml` and `robots.txt`. Local builds and GitHub Actions fall back to `https://example.com`; **a Cloudflare build fails without it**, because such a deploy looks fine while every SEO URL points at the placeholder. |

The site name lives in `src/config/site.ts`.

## Deploy (Cloudflare Workers static assets)

The repository is connected to Cloudflare Workers Builds: every push to `main` builds and deploys,
other branches get preview URLs.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production deploy command | `npx wrangler versions upload` |
| Root directory | `/` |
| Build variable | `SITE_URL` = production origin — under Settings → Build → *Build variables and secrets*, not the runtime *Variables and Secrets* |

`wrangler.jsonc` points Cloudflare at `./dist` and attaches the custom domain `gpxkit.com` (DNS record
and certificate are created on deploy; the `workers.dev` and preview URLs are switched off so the
site is reachable, and indexable, under one origin only). `www.gpxkit.com` is redirected to the apex
by a Cloudflare Redirect Rule, which lives in the dashboard, not in this repo.
 `public/_headers` sets security and cache headers.
Manual deploy from a machine logged in with `npx wrangler login`:

```sh
SITE_URL=https://gpxkit.com npm run deploy
```

GitHub Actions (`.github/workflows/ci.yml`) runs `npm run verify` on every push and pull request.


## License

[MIT](LICENSE). Sample files in `tests/fixtures/` and `public/samples/` are from
placemark/togeojson (BSD 2-Clause).
