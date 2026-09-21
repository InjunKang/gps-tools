import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: "Private GPS File Converters",
    homeDescription: "Free GPS file tools that run entirely in your browser. Convert between GPX, KML, GeoJSON and CSV without uploading anything.",
    homeHeading: "GPS file tools that never upload your files",
    allTools: "All tools",
    privacyBadge: "Your file never leaves your browser",
    dropPrompt: "Drop your {from} file here",
    dropHint: "or",
    chooseFile: "Choose a file",
    converting: "Converting…",
    done: "Your {to} file is ready",
    stats: "Features: {features} · Points: {points}",
    download: "Download {to}",
    convertAnother: "Convert another file",
    tryAgain: "Try another file",
    errors: {
      'invalid-file': "This file could not be read. It does not look like valid {from}.",
      'wrong-format': "This is not a {from} file. Please choose a .{ext} file.",
      empty: "This {from} file contains no waypoints, routes or tracks to convert.",
      unsupported: "This conversion is not supported.",
      'not-wgs84': "This {from} file does not use WGS 84 longitude/latitude coordinates. Export it again as EPSG:4326 and retry.",
      'too-large': "This file is larger than 200 MB and cannot be converted in the browser.",
      unknown: "Something went wrong while converting. Nothing was uploaded."
    },
    howToHeading: "How to convert {from} to {to}",
    howToSteps: [
      "Drop your {from} file into the box above, or click to choose it from your device.",
      "The conversion runs instantly inside your browser. Nothing is uploaded.",
      "Click “Download {to}” to save the converted file."
    ],
    formatsHeading: "About the formats",
    faqHeading: "Frequently asked questions",
    relatedHeading: "Related tools",
    adLabel: "Advertisement",
    language: "Language",
    footerPrivacy: "All conversions run locally in your browser. No files are uploaded or stored."
  },
  formats: {
    gpx: "GPX (GPS Exchange Format) is the open XML standard for GPS data. It stores waypoints, routes and tracks with elevation and timestamps, and is what Garmin, Strava, Komoot, Wahoo and most outdoor apps import and export.",
    kml: "KML (Keyhole Markup Language) is the XML format of Google Earth and Google My Maps. It describes placemarks, paths and polygons, and can carry timestamped tracks through the gx:Track extension.",
    geojson: "GeoJSON (RFC 7946) is the JSON format for geographic features used by web maps and GIS software such as Leaflet, Mapbox, QGIS and PostGIS. Coordinates are stored as longitude, latitude, elevation.",
    csv: "CSV (comma-separated values) is the plain-text table format that Excel, Google Sheets, LibreOffice, R and pandas all read. It has no notion of geometry, so GPS data is written as one row per point with latitude and longitude columns."
  },
  commonFaq: [
    {
      q: "Are my files uploaded to a server?",
      a: "No. The conversion runs entirely in your browser, and the page is not allowed to send your file anywhere. You can verify this in the Network tab of your browser’s developer tools: no request carries your file."
    },
    {
      q: "Is there a file size limit?",
      a: "Files up to 200 MB are accepted. Because everything happens on your device, very large files are limited by your browser’s memory rather than by an upload quota."
    }
  ],
  tools: {
    'gpx-to-kml': {
      title: "GPX to KML Converter",
      description: "Convert GPX tracks, routes and waypoints to KML for Google Earth and Google My Maps. Free, instant, and your file never leaves your browser.",
      faq: [
        {
          q: "What is kept when converting GPX to KML?",
          a: "Waypoints, routes and tracks with their names, descriptions, elevation and timestamps. Tracks with timestamps are written as gx:Track, so Google Earth can play them back on its time slider. Multi-segment tracks stay multi-segment."
        },
        {
          q: "What is lost?",
          a: "Sensor data stored in GPX extensions, such as heart rate, cadence and temperature, has no equivalent in KML and is not carried over. A track segment containing a single point is skipped because it cannot form a line."
        },
        {
          q: "How do I open the KML file in Google Earth?",
          a: "In Google Earth on the web choose File → Import KML file; in Google Earth Pro use File → Open. In Google My Maps, add a layer and click Import."
        }
      ]
    },
    'kml-to-gpx': {
      title: "KML to GPX Converter",
      description: "Convert KML from Google Earth or Google My Maps to GPX for Garmin, Komoot, Strava and other GPS devices and apps. Free, instant, and private — nothing is uploaded.",
      faq: [
        {
          q: "How are KML features mapped to GPX?",
          a: "Placemarks with a point become waypoints. Paths (LineString) and gx:Track become tracks, keeping elevation and, for gx:Track, timestamps. A gx:MultiTrack becomes one track with several segments. Names and descriptions are kept. Paths drawn on the ground in Google Earth carry an altitude of 0 rather than a real elevation, so no elevation is written for them."
        },
        {
          q: "What happens to polygons and styles?",
          a: "GPX has no polygons, so each polygon outline is written as a track. Colors, icons and other KML styling have no GPX equivalent and are dropped."
        },
        {
          q: "Can I convert a KMZ file?",
          a: "Not directly yet. A KMZ is a ZIP archive: rename it to .zip, extract it, and convert the doc.kml file inside."
        }
      ]
    },
    'gpx-to-geojson': {
      title: "GPX to GeoJSON Converter",
      description: "Convert GPX tracks, routes and waypoints to GeoJSON for Leaflet, Mapbox, QGIS and PostGIS. Free, instant, and your file never leaves your browser.",
      faq: [
        {
          q: "How is GPX mapped to GeoJSON?",
          a: "Waypoints become Point features, routes become LineString features, and tracks become LineString or, with several segments, MultiLineString features. Coordinates are written as longitude, latitude, elevation, as RFC 7946 requires."
        },
        {
          q: "Where do timestamps and heart rate go?",
          a: "GeoJSON coordinates cannot hold them, so per-point values are stored in the feature’s properties.coordinateProperties, in arrays parallel to the coordinates: times for timestamps, and heart rate, cadence or temperature when the GPX file contains them."
        },
        {
          q: "Which coordinate reference system is used?",
          a: "WGS 84 (EPSG:4326) — the system both GPX and GeoJSON are defined in — so no reprojection takes place and coordinates are not rounded."
        }
      ]
    },
    'gpx-to-csv': {
      title: "GPX to CSV Converter",
      description: "Convert GPX tracks, routes and waypoints to a CSV spreadsheet for Excel, Google Sheets or Python. One row per point, and your file never leaves your browser.",
      faq: [
        {
          q: "Which columns does the CSV contain?",
          a: "One row per point with type (waypoint, route or track), name, description, segment, latitude, longitude, elevation and time. If the GPX file contains sensor data, heart_rate, cadence, temperature and power columns are added. Descriptions are written on waypoint rows only."
        },
        {
          q: "How are tracks with several segments handled?",
          a: "Points stay in their recorded order, and the segment column numbers the segments of each track from 1, so pauses and gaps in a recording remain visible."
        },
        {
          q: "Will it open correctly in Excel?",
          a: "Yes. The file is UTF-8 with a byte order mark, so Excel shows accented and Japanese names correctly. Times are ISO 8601 in UTC. Text starting with =, +, - or @ is prefixed with an apostrophe so a spreadsheet cannot run it as a formula."
        }
      ]
    },
    'kml-to-geojson': {
      title: "KML to GeoJSON Converter",
      description: "Convert KML from Google Earth or Google My Maps to GeoJSON for Leaflet, Mapbox, QGIS and PostGIS. Free, instant, and private — nothing is uploaded.",
      faq: [
        {
          q: "How are KML geometries mapped to GeoJSON?",
          a: "Points, LineStrings and Polygons (including holes) keep their type. A gx:Track becomes a LineString and a gx:MultiTrack a MultiLineString, with timestamps in properties.coordinateProperties.times. A MultiGeometry of mixed types becomes a GeometryCollection."
        },
        {
          q: "What happens to names, descriptions and styles?",
          a: "Name, description, timestamps and ExtendedData fields become feature properties. Line and fill styles are written as simplestyle properties such as stroke, stroke-width, fill and fill-opacity, which geojson.io, Mapbox and GitHub understand."
        },
        {
          q: "What is not converted?",
          a: "Network links are not followed, because this page cannot download anything; only their region outline and URL are kept. A ground overlay becomes a polygon of its footprint with the image URL in the icon property, but the image itself is not included. 3D models and tours are skipped. KMZ files must be unzipped first: rename to .zip, extract, and convert the doc.kml inside."
        }
      ]
    },
    'geojson-to-gpx': {
      title: "GeoJSON to GPX Converter",
      description: "Convert GeoJSON from QGIS, geojson.io or Mapbox to GPX for Garmin, Komoot, Strava and other GPS devices and apps. Free, instant, and private — nothing is uploaded.",
      faq: [
        {
          q: "How are GeoJSON features mapped to GPX?",
          a: "Points become waypoints, LineStrings become tracks, and a MultiLineString becomes one track with several segments. GPX has no polygons, so polygon outlines, including holes, are written as track segments. The name is read from the name or title property, the description from description, and elevation from the third coordinate. A Feature, a FeatureCollection or a bare geometry all work."
        },
        {
          q: "Can the GPX file contain timestamps?",
          a: "Plain GeoJSON has no per-point time. If the file carries times in properties.coordinateProperties.times, the layout written by this site’s GPX to GeoJSON converter, they become GPX timestamps, and heart rate, cadence, temperature and power in the same place become Garmin TrackPointExtension elements that Strava, Garmin Connect and Komoot read. A GPX → GeoJSON → GPX round trip therefore keeps waypoints, routes, segments, elevation, time and sensor data."
        },
        {
          q: "Why does it say my file does not use WGS 84?",
          a: "GPX only supports WGS 84 longitude and latitude in degrees. GeoJSON exported from QGIS or ogr2ogr in a projected system such as EPSG:3857 contains metres, which would produce an unusable GPX file, so it is rejected. Export the layer again with the CRS set to EPSG:4326."
        }
      ]
    },
    'geojson-to-kml': {
      title: "GeoJSON to KML Converter",
      description: "Convert GeoJSON from QGIS, geojson.io or Mapbox to KML for Google Earth and Google My Maps, keeping feature attributes. Free, instant, and nothing is uploaded.",
      faq: [
        {
          q: "How are GeoJSON geometries mapped to KML?",
          a: "Points, LineStrings and Polygons, including holes, keep their type. MultiPoint, MultiLineString, MultiPolygon and GeometryCollection become a KML MultiGeometry. A line that carries per-point times in properties.coordinateProperties.times is written as gx:Track so Google Earth can animate it."
        },
        {
          q: "Are feature properties kept?",
          a: "Yes. name (or title) and description become the placemark’s name and description, and every other text, number or true/false property is written to ExtendedData, which Google Earth shows in the placemark balloon. Nested objects, arrays and empty values are skipped, and simplestyle colors such as stroke or marker-color are kept as data but do not change how the placemark is drawn."
        },
        {
          q: "Why does it say my file does not use WGS 84?",
          a: "KML only supports WGS 84 longitude and latitude in degrees. GeoJSON exported from QGIS or ogr2ogr in a projected system such as EPSG:3857 contains metres and would land in the wrong place, so it is rejected. Export the layer again with the CRS set to EPSG:4326."
        }
      ]
    }
  }
};
