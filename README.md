# GPXKit

https://gpxkit.com

Browser-only GPS file converters (GPX, KML, GeoJSON, CSV). Files are converted in a Web Worker
and never leave the user's browser; a `connect-src 'self'` Content Security Policy enforces that.

Astro (static build) + TypeScript, deployed to Cloudflare as static assets.
Project rules are in [`CLAUDE.md`](CLAUDE.md), design notes in [`docs/design.md`](docs/design.md).

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

## Test fixtures

`tests/fixtures/` contains sample files from placemark/togeojson (BSD 2-Clause, see
`tests/fixtures/LICENSE-togeojson`).
