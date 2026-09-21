import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: "Private GPS-Dateikonverter",
    homeDescription: "Kostenlose GPS-Dateitools, die vollständig in Ihrem Browser laufen. GPX, KML, GeoJSON und CSV umwandeln, ohne etwas hochzuladen.",
    homeHeading: "GPS-Dateitools, die Ihre Dateien nie hochladen",
    allTools: "Alle Tools",
    privacyBadge: "Ihre Datei verlässt nie den Browser",
    dropPrompt: "{from}-Datei hier ablegen",
    dropHint: "oder",
    chooseFile: "Datei auswählen",
    converting: "Wird umgewandelt …",
    done: "Ihre {to}-Datei ist fertig",
    stats: "Objekte: {features} · Punkte: {points}",
    download: "{to} herunterladen",
    convertAnother: "Weitere Datei umwandeln",
    tryAgain: "Andere Datei versuchen",
    errors: {
      'invalid-file': "Diese Datei konnte nicht gelesen werden. Sie scheint kein gültiges {from} zu sein.",
      'wrong-format': "Das ist keine {from}-Datei. Bitte wählen Sie eine .{ext}-Datei.",
      empty: "Diese {from}-Datei enthält keine Wegpunkte, Routen oder Tracks.",
      unsupported: "Diese Umwandlung wird nicht unterstützt.",
      'not-wgs84': "Diese {from}-Datei verwendet keine WGS-84-Koordinaten (Längen-/Breitengrad). Exportieren Sie sie erneut als EPSG:4326.",
      'too-large': "Diese Datei ist größer als 200 MB und kann nicht im Browser umgewandelt werden.",
      unknown: "Bei der Umwandlung ist ein Fehler aufgetreten. Es wurde nichts hochgeladen."
    },
    howToHeading: "So wandeln Sie {from} in {to} um",
    howToSteps: [
      "Ziehen Sie Ihre {from}-Datei in das Feld oben oder klicken Sie, um sie auf Ihrem Gerät auszuwählen.",
      "Die Umwandlung läuft sofort in Ihrem Browser. Es wird nichts hochgeladen.",
      "Klicken Sie auf „{to} herunterladen“, um die umgewandelte Datei zu speichern."
    ],
    formatsHeading: "Über die Formate",
    faqHeading: "Häufige Fragen",
    relatedHeading: "Verwandte Tools",
    adLabel: "Anzeige",
    language: "Sprache",
    footerPrivacy: "Alle Umwandlungen laufen lokal in Ihrem Browser. Es werden keine Dateien hochgeladen oder gespeichert."
  },
  formats: {
    gpx: "GPX (GPS Exchange Format) ist der offene XML-Standard für GPS-Daten. Es speichert Wegpunkte, Routen und Tracks samt Höhe und Zeitstempel und wird von Garmin, Strava, Komoot, Wahoo und den meisten Outdoor-Apps importiert und exportiert.",
    kml: "KML (Keyhole Markup Language) ist das XML-Format von Google Earth und Google My Maps. Es beschreibt Ortsmarken, Pfade und Polygone und kann über die Erweiterung gx:Track auch Tracks mit Zeitstempeln enthalten.",
    geojson: "GeoJSON (RFC 7946) ist das JSON-Format für Geodaten, das Webkarten und GIS-Software wie Leaflet, Mapbox, QGIS und PostGIS verwenden. Koordinaten werden als Längengrad, Breitengrad, Höhe gespeichert.",
    csv: "CSV (Comma-Separated Values) ist das Tabellenformat in Klartext, das Excel, Google Sheets, LibreOffice, R und pandas lesen. Es kennt keine Geometrien, daher werden GPS-Daten als eine Zeile pro Punkt mit Spalten für Breiten- und Längengrad geschrieben."
  },
  commonFaq: [
    {
      q: "Werden meine Dateien auf einen Server hochgeladen?",
      a: "Nein. Die Umwandlung läuft vollständig in Ihrem Browser, und die Seite darf Ihre Datei nirgendwohin senden. Sie können das im Netzwerk-Tab der Entwicklertools Ihres Browsers prüfen: Keine Anfrage enthält Ihre Datei."
    },
    {
      q: "Gibt es eine Größenbeschränkung?",
      a: "Dateien bis 200 MB werden akzeptiert. Da alles auf Ihrem Gerät passiert, begrenzt bei sehr großen Dateien der Arbeitsspeicher des Browsers und kein Upload-Limit."
    }
  ],
  tools: {
    'gpx-to-kml': {
      title: "GPX in KML umwandeln",
      description: "GPX-Tracks, Routen und Wegpunkte in KML für Google Earth und Google My Maps umwandeln. Kostenlos, sofort – und Ihre Datei verlässt nie den Browser.",
      faq: [
        {
          q: "Was bleibt bei der Umwandlung von GPX in KML erhalten?",
          a: "Wegpunkte, Routen und Tracks mit Namen, Beschreibungen, Höhe und Zeitstempeln. Tracks mit Zeitstempeln werden als gx:Track geschrieben, sodass Google Earth sie über den Zeitschieberegler abspielen kann. Tracks mit mehreren Segmenten behalten ihre Segmente."
        },
        {
          q: "Was geht verloren?",
          a: "Sensordaten aus GPX-Erweiterungen wie Herzfrequenz, Trittfrequenz und Temperatur haben in KML keine Entsprechung und werden nicht übernommen. Ein Tracksegment mit nur einem Punkt wird übersprungen, da es keine Linie bilden kann."
        },
        {
          q: "Wie öffne ich die KML-Datei in Google Earth?",
          a: "In Google Earth im Web wählen Sie Datei → KML-Datei importieren, in Google Earth Pro Datei → Öffnen. In Google My Maps fügen Sie eine Ebene hinzu und klicken auf Importieren."
        }
      ]
    },
    'kml-to-gpx': {
      title: "KML in GPX umwandeln",
      description: "KML aus Google Earth oder Google My Maps in GPX für Garmin, Komoot, Strava und andere GPS-Geräte und Apps umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.",
      faq: [
        {
          q: "Wie werden KML-Elemente in GPX übertragen?",
          a: "Ortsmarken mit einem Punkt werden zu Wegpunkten. Pfade (LineString) und gx:Track werden zu Tracks; die Höhe und bei gx:Track auch die Zeitstempel bleiben erhalten. Ein gx:MultiTrack wird zu einem Track mit mehreren Segmenten. Namen und Beschreibungen bleiben erhalten. In Google Earth auf den Boden gezeichnete Pfade haben die Höhe 0 statt einer echten Höhe; für sie wird daher keine Höhe geschrieben."
        },
        {
          q: "Was passiert mit Polygonen und Stilen?",
          a: "GPX kennt keine Polygone, daher wird jeder Polygonumriss als Track geschrieben. Farben, Symbole und andere KML-Stile haben in GPX keine Entsprechung und entfallen."
        },
        {
          q: "Kann ich eine KMZ-Datei umwandeln?",
          a: "Noch nicht direkt. Eine KMZ-Datei ist ein ZIP-Archiv: Benennen Sie sie in .zip um, entpacken Sie sie und wandeln Sie die enthaltene doc.kml um."
        }
      ]
    },
    'gpx-to-geojson': {
      title: "GPX in GeoJSON umwandeln",
      description: "GPX-Tracks, Routen und Wegpunkte in GeoJSON für Leaflet, Mapbox, QGIS und PostGIS umwandeln. Kostenlos, sofort – und Ihre Datei verlässt nie den Browser.",
      faq: [
        {
          q: "Wie wird GPX in GeoJSON abgebildet?",
          a: "Wegpunkte werden zu Point-Features, Routen zu LineString-Features und Tracks zu LineString- oder, bei mehreren Segmenten, MultiLineString-Features. Koordinaten werden gemäß RFC 7946 als Längengrad, Breitengrad, Höhe geschrieben."
        },
        {
          q: "Wo landen Zeitstempel und Herzfrequenz?",
          a: "GeoJSON-Koordinaten können sie nicht aufnehmen. Werte pro Punkt stehen deshalb in properties.coordinateProperties des Features, in Arrays parallel zu den Koordinaten: times für Zeitstempel sowie Herzfrequenz, Trittfrequenz oder Temperatur, sofern die GPX-Datei sie enthält."
        },
        {
          q: "Welches Koordinatenreferenzsystem wird verwendet?",
          a: "WGS 84 (EPSG:4326) – das System, in dem GPX und GeoJSON definiert sind. Es findet keine Umprojektion statt, und Koordinaten werden nicht gerundet."
        }
      ]
    },
    'gpx-to-csv': {
      title: "GPX in CSV umwandeln",
      description: "GPX-Tracks, Routen und Wegpunkte in eine CSV-Tabelle für Excel, Google Sheets oder Python umwandeln. Eine Zeile pro Punkt – und Ihre Datei verlässt nie den Browser.",
      faq: [
        {
          q: "Welche Spalten enthält die CSV-Datei?",
          a: "Eine Zeile pro Punkt mit type (waypoint, route oder track), name, description, segment, latitude, longitude, elevation und time. Enthält die GPX-Datei Sensordaten, kommen die Spalten heart_rate, cadence, temperature und power hinzu. Beschreibungen stehen nur in Wegpunkt-Zeilen."
        },
        {
          q: "Wie werden Tracks mit mehreren Segmenten behandelt?",
          a: "Die Punkte bleiben in der aufgezeichneten Reihenfolge, und die Spalte segment nummeriert die Segmente jedes Tracks ab 1. Pausen und Lücken in der Aufzeichnung bleiben so erkennbar."
        },
        {
          q: "Lässt sich die Datei korrekt in Excel öffnen?",
          a: "Ja. Die Datei ist UTF-8 mit Byte Order Mark, sodass Excel Umlaute und japanische Namen richtig anzeigt. Zeiten stehen im ISO-8601-Format in UTC. Text, der mit =, +, - oder @ beginnt, erhält ein vorangestelltes Apostroph, damit eine Tabellenkalkulation ihn nicht als Formel ausführt."
        }
      ]
    },
    'kml-to-geojson': {
      title: "KML in GeoJSON umwandeln",
      description: "KML aus Google Earth oder Google My Maps in GeoJSON für Leaflet, Mapbox, QGIS und PostGIS umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.",
      faq: [
        {
          q: "Wie werden KML-Geometrien in GeoJSON abgebildet?",
          a: "Punkte, LineStrings und Polygone (auch mit Löchern) behalten ihren Typ. Ein gx:Track wird zu einem LineString und ein gx:MultiTrack zu einem MultiLineString, mit Zeitstempeln in properties.coordinateProperties.times. Eine MultiGeometry mit gemischten Typen wird zu einer GeometryCollection."
        },
        {
          q: "Was passiert mit Namen, Beschreibungen und Stilen?",
          a: "Name, Beschreibung, Zeitstempel und ExtendedData-Felder werden zu Feature-Properties. Linien- und Füllstile werden als simplestyle-Properties wie stroke, stroke-width, fill und fill-opacity geschrieben, die geojson.io, Mapbox und GitHub verstehen."
        },
        {
          q: "Was wird nicht umgewandelt?",
          a: "Netzwerklinks werden nicht verfolgt, da diese Seite nichts herunterladen kann; nur ihr Regionsumriss und ihre URL bleiben erhalten. Ein Boden-Overlay wird zu einem Polygon seiner Grundfläche mit der Bild-URL in der Property icon, das Bild selbst ist nicht enthalten. 3D-Modelle und Touren werden übersprungen. KMZ-Dateien müssen zuerst entpackt werden: in .zip umbenennen, entpacken und die enthaltene doc.kml umwandeln."
        }
      ]
    },
    'geojson-to-gpx': {
      title: "GeoJSON in GPX umwandeln",
      description: "GeoJSON aus QGIS, geojson.io oder Mapbox in GPX für Garmin, Komoot, Strava und andere GPS-Geräte und Apps umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.",
      faq: [
        {
          q: "Wie werden GeoJSON-Features in GPX übertragen?",
          a: "Punkte werden zu Wegpunkten, LineStrings zu Tracks, und ein MultiLineString wird zu einem Track mit mehreren Segmenten. GPX kennt keine Polygone, daher werden Polygonumrisse einschließlich Löchern als Tracksegmente geschrieben. Der Name stammt aus der Property name oder title, die Beschreibung aus description und die Höhe aus der dritten Koordinate. Ein Feature, eine FeatureCollection oder eine einzelne Geometrie funktionieren gleichermaßen."
        },
        {
          q: "Kann die GPX-Datei Zeitstempel enthalten?",
          a: "Einfaches GeoJSON kennt keine Zeit pro Punkt. Enthält die Datei Zeiten in properties.coordinateProperties.times – so schreibt sie der GPX-in-GeoJSON-Konverter dieser Seite –, werden daraus GPX-Zeitstempel. Herzfrequenz, Trittfrequenz, Temperatur und Leistung an derselben Stelle werden zu Garmin-TrackPointExtension-Elementen, die Strava, Garmin Connect und Komoot lesen. Ein Durchlauf GPX → GeoJSON → GPX erhält so Wegpunkte, Routen, Segmente, Höhe, Zeit und Sensordaten."
        },
        {
          q: "Warum heißt es, meine Datei verwende kein WGS 84?",
          a: "GPX unterstützt nur WGS-84-Längen- und Breitengrade in Grad. GeoJSON, das aus QGIS oder ogr2ogr in einem projizierten System wie EPSG:3857 exportiert wurde, enthält Meter und ergäbe eine unbrauchbare GPX-Datei; deshalb wird es abgelehnt. Exportieren Sie den Layer erneut mit dem KBS EPSG:4326."
        }
      ]
    },
    'geojson-to-kml': {
      title: "GeoJSON in KML umwandeln",
      description: "GeoJSON aus QGIS, geojson.io oder Mapbox in KML für Google Earth und Google My Maps umwandeln – Attribute bleiben erhalten. Kostenlos, sofort, und nichts wird hochgeladen.",
      faq: [
        {
          q: "Wie werden GeoJSON-Geometrien in KML abgebildet?",
          a: "Punkte, LineStrings und Polygone einschließlich Löchern behalten ihren Typ. MultiPoint, MultiLineString, MultiPolygon und GeometryCollection werden zu einer KML-MultiGeometry. Eine Linie mit Zeiten pro Punkt in properties.coordinateProperties.times wird als gx:Track geschrieben, sodass Google Earth sie animieren kann."
        },
        {
          q: "Bleiben die Properties der Features erhalten?",
          a: "Ja. name (oder title) und description werden zu Name und Beschreibung der Ortsmarke, und jede weitere Property mit Text, Zahl oder Wahrheitswert wird in ExtendedData geschrieben, das Google Earth im Infofenster anzeigt. Verschachtelte Objekte, Arrays und leere Werte werden übersprungen. simplestyle-Farben wie stroke oder marker-color bleiben als Daten erhalten, ändern aber nicht die Darstellung der Ortsmarke."
        },
        {
          q: "Warum heißt es, meine Datei verwende kein WGS 84?",
          a: "KML unterstützt nur WGS-84-Längen- und Breitengrade in Grad. GeoJSON, das aus QGIS oder ogr2ogr in einem projizierten System wie EPSG:3857 exportiert wurde, enthält Meter und würde an der falschen Stelle landen; deshalb wird es abgelehnt. Exportieren Sie den Layer erneut mit dem KBS EPSG:4326."
        }
      ]
    }
  }
};
