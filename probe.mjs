import { gpx, kml } from '@tmcw/togeojson';
import { DOMParser } from '@xmldom/xmldom';
import fs from 'node:fs';
for (const f of process.argv.slice(2)) {
  const doc = new DOMParser().parseFromString(fs.readFileSync('tests/fixtures/' + f, 'utf8'), 'text/xml');
  const fc = (f.endsWith('gpx') ? gpx : kml)(doc);
  console.log('==', f, fc.features.length);
  for (const ft of fc.features.slice(0, 3)) {
    const g = ft.geometry;
    const p = JSON.stringify(ft.properties, (k, v) => Array.isArray(v) && v.length > 3 ? `[${v.length} items: ${JSON.stringify(v[0]).slice(0,60)}]` : v);
    console.log(' ', g?.type, g && JSON.stringify(g.coordinates).slice(0, 90), '\n    props', p.slice(0, 400));
  }
}
