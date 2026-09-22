// Prints gpxkit.com traffic from Cloudflare zone analytics, with a rough bot/human split.
// Needs a one-time `npx wrangler login` on this machine (uses its OAuth token; no secrets here).
// Usage: node scripts/traffic.mjs [days]   (default 7)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ZONE = 'gpxkit.com';
const days = Number(process.argv[2] ?? 7);

const configPath = join(process.env.APPDATA ?? '', 'xdg.config', '.wrangler', 'config', 'default.toml');
const token = readFileSync(configPath, 'utf8').match(/^oauth_token\s*=\s*"([^"]+)"/m)?.[1];
if (!token) throw new Error(`no oauth_token in ${configPath}; run: npx wrangler login`);
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

const zones = await (await fetch(`https://api.cloudflare.com/client/v4/zones?name=${ZONE}`, { headers })).json();
if (!zones.success) throw new Error(JSON.stringify(zones.errors));
const zoneTag = zones.result[0].id;

async function gql(query) {
  const res = await (await fetch('https://api.cloudflare.com/client/v4/graphql', { headers, method: 'POST', body: JSON.stringify({ query }) })).json();
  if (res.errors) throw new Error(JSON.stringify(res.errors));
  return res.data.viewer.zones[0];
}
const since = new Date(Date.now() - days * 864e5);
const day = since.toISOString().slice(0, 10);
const iso = `${day}T00:00:00Z`;
const adaptive = (dims, extra = '', limit = 15) =>
  gql(`{ viewer { zones(filter:{zoneTag:"${zoneTag}"}) { httpRequestsAdaptiveGroups(limit:${limit}, orderBy:[count_DESC],
    filter:{datetime_geq:"${iso}", requestSource:"eyeball" ${extra}}) { count dimensions { ${dims} } } } } }`).then((z) => z.httpRequestsAdaptiveGroups);

console.log(`gpxkit.com — last ${days} days (since ${day}), Cloudflare edge data\n`);

const daily = (await gql(`{ viewer { zones(filter:{zoneTag:"${zoneTag}"}) { httpRequests1dGroups(limit:60, orderBy:[date_ASC],
  filter:{date_geq:"${day}"}) { dimensions { date } sum { requests pageViews } uniq { uniques } } } } }`)).httpRequests1dGroups;
console.log('date        requests  pageViews  uniqueIPs');
for (const r of daily) console.log(r.dimensions.date.padEnd(12), String(r.sum.requests).padStart(8), String(r.sum.pageViews).padStart(10), String(r.uniq.uniques).padStart(10));

// Human-looking page views: HTML, on a real page, not from an obvious bot UA. Rough, but the
// raw "unique visitors" number is mostly vulnerability scanners on a new domain.
const botUA = /bot|crawl|spider|curl|python|wget|headless|lighthouse|scan|http|Chrome\/(?:[1-9]|[1-9]\d|1[01]\d)\.|OS 13_/i;
const pages = await adaptive('clientRequestPath userAgent', ', edgeResponseContentTypeName:"html", edgeResponseStatus:200', 500);
const human = new Map();
let humanTotal = 0, botTotal = 0;
for (const r of pages) {
  const path = r.dimensions.clientRequestPath;
  if (botUA.test(r.dimensions.userAgent) || !/^\/(?:[a-z]{2}\/)?(?:[a-z-]+\/)?$/.test(path)) { botTotal += r.count; continue; }
  humanTotal += r.count;
  human.set(path, (human.get(path) ?? 0) + r.count);
}
console.log(`\nHTML page views (200): ~${humanTotal} human-looking, ${botTotal} bot-looking (includes the owner's own visits)`);
console.log('\ntop pages, human-looking:');
for (const [path, n] of [...human].sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(String(n).padStart(6), path);

console.log('\ntop countries (all requests):');
for (const r of await adaptive('clientCountryName', '', 8)) console.log(String(r.count).padStart(6), r.dimensions.clientCountryName);

console.log('\nscanner probes (404 paths):');
for (const r of await adaptive('clientRequestPath', ', edgeResponseStatus:404', 6)) console.log(String(r.count).padStart(6), r.dimensions.clientRequestPath);
console.log('\nFor real search visitors use Search Console → Performance → Clicks (bots excluded, 2–3 days delayed).');
