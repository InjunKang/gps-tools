# Test fixtures

Real-world GPX/KML samples copied unmodified from the test suite of
[placemark/togeojson](https://github.com/placemark/togeojson/tree/main/test/data)
(BSD 2-Clause, © 2019 Tom MacWright, Mapbox).

| File | What it exercises |
|---|---|
| `strava.gpx` | Strava export: one track, time, elevation, Garmin extensions |
| `blue_hills.gpx` | Large Garmin-style file: 46 waypoints, 14 track segments, 1243 points |
| `multitrackgpx.gpx` | 3 tracks / segments, 117 points |
| `trek.gpx` | Route (`rte`/`rtept`), 120 points |
| `wpt.gpx` | 40 bare waypoints, no namespace declaration |
| `gxtrack.kml` | `gx:Track` with timestamps and altitude |
| `gxmultitrack.kml` | `gx:MultiTrack` |
| `linestring.kml`, `point.kml`, `polygon.kml`, `multigeometry.kml` | Basic KML geometries |
| `cdata.kml` | CDATA description |
