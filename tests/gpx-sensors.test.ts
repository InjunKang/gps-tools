import { describe, expect, it } from 'vitest';
import type { FeatureCollection } from 'geojson';
import { convert } from '../src/lib/convert';
import { readGpx } from '../src/lib/convert/readers/gpx';
import { fixture, parseXmlStrict } from './helpers';

const sensors = (fc: FeatureCollection) =>
  fc.features.map((f) => {
    const cp = (f.properties?.coordinateProperties ?? {}) as Record<string, unknown>;
    return { heart: cp.heart, cads: cp.cads, atemps: cp.atemps, powers: cp.powers };
  });

describe('GPX writer: sensor data as Garmin TrackPointExtension', () => {
  it('GPX → GeoJSON → GPX keeps heart rate, cadence, temperature and power (Strava export)', () => {
    const source = readGpx(fixture('strava.gpx'));
    const geojson = convert(fixture('strava.gpx'), 'gpx', 'geojson').output;
    const { output } = convert(geojson, 'geojson', 'gpx');
    parseXmlStrict(output);
    expect(sensors(readGpx(output))).toEqual(sensors(source));
    expect(sensors(source)[0].heart).toEqual([117, 154, 160]); // the test is not vacuous
  });

  it('writes the extension in the schema order and declares the namespace', () => {
    const geojson = convert(fixture('strava.gpx'), 'gpx', 'geojson').output;
    const { output } = convert(geojson, 'geojson', 'gpx');
    expect(output).toContain('xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"');
    // <ele>, <time>, then <extensions> as the last child of <trkpt>; power sits beside the
    // TrackPointExtension, the way Strava writes it.
    expect(output).toContain(
      '<trkpt lat="42.941059" lon="0.963041"><ele>721.2</ele><time>2018-05-14T14:54:21Z</time>' +
        '<extensions><power>75</power><gpxtpx:TrackPointExtension><gpxtpx:hr>117</gpxtpx:hr>' +
        '<gpxtpx:cad>85</gpxtpx:cad><gpxtpx:atemp>22</gpxtpx:atemp></gpxtpx:TrackPointExtension></extensions></trkpt>',
    );
  });

  it('skips missing readings per point instead of writing null', () => {
    // strava.gpx has power only on the first of its three points.
    const geojson = convert(fixture('strava.gpx'), 'gpx', 'geojson').output;
    const { output } = convert(geojson, 'geojson', 'gpx');
    expect(output.match(/<power>/g)).toHaveLength(1);
    expect(output).not.toContain('null');
  });

  it('writes no extension elements and no namespace when there is no sensor data', () => {
    for (const name of ['blue_hills.gpx', 'trek.gpx']) {
      const geojson = convert(fixture(name), 'gpx', 'geojson').output;
      const { output } = convert(geojson, 'geojson', 'gpx');
      expect(output, name).not.toContain('<extensions>');
      expect(output, name).not.toContain('gpxtpx');
    }
  });

  it('keeps per-segment alignment for multi-segment tracks', () => {
    const fc: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [[1, 2], [3, 4]],
              [[5, 6], [7, 8], [9, 10]],
            ],
          },
          properties: {
            name: 'Two segments',
            coordinateProperties: { heart: [[100, 101], [102, null, 104]], cads: [[80, 81], [82, 83, 84]] },
          },
        },
      ],
    };
    const { output } = convert(JSON.stringify(fc), 'geojson', 'gpx');
    parseXmlStrict(output);
    const back = readGpx(output);
    expect(back.features[0].properties?.coordinateProperties).toMatchObject({
      heart: [[100, 101], [102, null, 104]],
      cads: [[80, 81], [82, 83, 84]],
    });
  });

  it('Garmin Connect ns3 file survives GPX → GeoJSON → GPX', () => {
    const garmin = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="Garmin Connect" version="1.1" xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><trkseg>
    <trkpt lat="60.29" lon="25.02"><ele>11.6</ele><time>2018-04-23T15:54:34.000Z</time><extensions><ns3:TrackPointExtension><ns3:hr>61</ns3:hr><ns3:cad>0</ns3:cad></ns3:TrackPointExtension></extensions></trkpt>
    <trkpt lat="60.30" lon="25.03"><ele>11.8</ele><time>2018-04-23T15:54:35.000Z</time><extensions><ns3:TrackPointExtension><ns3:hr>64</ns3:hr><ns3:cad>82</ns3:cad></ns3:TrackPointExtension></extensions></trkpt>
  </trkseg></trk></gpx>`;
    const geojson = convert(garmin, 'gpx', 'geojson').output;
    const { output } = convert(geojson, 'geojson', 'gpx');
    expect(sensors(readGpx(output))).toEqual(sensors(readGpx(garmin)));
    expect(sensors(readGpx(output))[0]).toMatchObject({ heart: [61, 64], cads: [0, 82] });
  });
});
