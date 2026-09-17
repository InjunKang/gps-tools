// Single source of truth for every tool page. Adding a tool = adding one entry to `tools`
// (plus a `formats` entry and a reader/writer in src/lib/convert if the format is new).
// `Record<Locale, …>` makes a missing translation a compile error.
import type { FormatId } from '../lib/convert/types';
import type { Locale } from './site';

export interface Faq {
  q: string;
  a: string;
}

export interface FormatDef {
  label: string;
  extension: string;
  mime: string;
  /** Shown in the "about the formats" section of every tool that reads or writes this format. */
  about: Record<Locale, string>;
}

export interface ToolCopy {
  /** <h1> and <title>. */
  title: string;
  /** Meta description and the line under the <h1>. */
  description: string;
  faq: Faq[];
}

export interface ToolDef {
  slug: string;
  from: FormatId;
  to: FormatId;
  i18n: Record<Locale, ToolCopy>;
}

export const formats: Record<FormatId, FormatDef> = {
  gpx: {
    label: 'GPX',
    extension: 'gpx',
    mime: 'application/gpx+xml',
    about: {
      en: 'GPX (GPS Exchange Format) is the open XML standard for GPS data. It stores waypoints, routes and tracks with elevation and timestamps, and is what Garmin, Strava, Komoot, Wahoo and most outdoor apps import and export.',
      de: 'GPX (GPS Exchange Format) ist der offene XML-Standard für GPS-Daten. Es speichert Wegpunkte, Routen und Tracks samt Höhe und Zeitstempel und wird von Garmin, Strava, Komoot, Wahoo und den meisten Outdoor-Apps importiert und exportiert.',
      ja: 'GPX(GPS Exchange Format)は、GPSデータのためのオープンなXML規格です。ウェイポイント、ルート、トラックを標高やタイムスタンプとともに保存でき、Garmin、Strava、Komoot、Wahooなど多くのアウトドアアプリが入出力に対応しています。',
      es: 'GPX (GPS Exchange Format) es el estándar XML abierto para datos GPS. Guarda waypoints, rutas y tracks con altitud y marcas de tiempo, y es el formato que importan y exportan Garmin, Strava, Komoot, Wahoo y la mayoría de apps de actividades al aire libre.',
    },
  },
  kml: {
    label: 'KML',
    extension: 'kml',
    mime: 'application/vnd.google-earth.kml+xml',
    about: {
      en: 'KML (Keyhole Markup Language) is the XML format of Google Earth and Google My Maps. It describes placemarks, paths and polygons, and can carry timestamped tracks through the gx:Track extension.',
      de: 'KML (Keyhole Markup Language) ist das XML-Format von Google Earth und Google My Maps. Es beschreibt Ortsmarken, Pfade und Polygone und kann über die Erweiterung gx:Track auch Tracks mit Zeitstempeln enthalten.',
      ja: 'KML(Keyhole Markup Language)は、Google EarthやGoogleマイマップで使われるXML形式です。目印、パス、ポリゴンを記述でき、gx:Track拡張を使えばタイムスタンプ付きのトラックも保存できます。',
      es: 'KML (Keyhole Markup Language) es el formato XML de Google Earth y Google My Maps. Describe marcadores, rutas y polígonos, y puede incluir tracks con marcas de tiempo mediante la extensión gx:Track.',
    },
  },
  geojson: {
    label: 'GeoJSON',
    extension: 'geojson',
    mime: 'application/geo+json',
    about: {
      en: 'GeoJSON (RFC 7946) is the JSON format for geographic features used by web maps and GIS software such as Leaflet, Mapbox, QGIS and PostGIS. Coordinates are stored as longitude, latitude, elevation.',
      de: 'GeoJSON (RFC 7946) ist das JSON-Format für Geodaten, das Webkarten und GIS-Software wie Leaflet, Mapbox, QGIS und PostGIS verwenden. Koordinaten werden als Längengrad, Breitengrad, Höhe gespeichert.',
      ja: 'GeoJSON(RFC 7946)は、Leaflet、Mapbox、QGIS、PostGISなどのWeb地図やGISソフトで使われる地理データ用のJSON形式です。座標は「経度、緯度、標高」の順で保存されます。',
      es: 'GeoJSON (RFC 7946) es el formato JSON para datos geográficos que usan los mapas web y el software SIG como Leaflet, Mapbox, QGIS y PostGIS. Las coordenadas se guardan como longitud, latitud y altitud.',
    },
  },
};

/** Appended to the FAQ of every tool. */
export const commonFaq: Record<Locale, Faq[]> = {
  en: [
    {
      q: 'Are my files uploaded to a server?',
      a: 'No. The conversion runs entirely in your browser, and the page is not allowed to send your file anywhere. You can verify this in the Network tab of your browser’s developer tools: no request carries your file.',
    },
    {
      q: 'Is there a file size limit?',
      a: 'Files up to 200 MB are accepted. Because everything happens on your device, very large files are limited by your browser’s memory rather than by an upload quota.',
    },
  ],
  de: [
    {
      q: 'Werden meine Dateien auf einen Server hochgeladen?',
      a: 'Nein. Die Umwandlung läuft vollständig in Ihrem Browser, und die Seite darf Ihre Datei nirgendwohin senden. Sie können das im Netzwerk-Tab der Entwicklertools Ihres Browsers prüfen: Keine Anfrage enthält Ihre Datei.',
    },
    {
      q: 'Gibt es eine Größenbeschränkung?',
      a: 'Dateien bis 200 MB werden akzeptiert. Da alles auf Ihrem Gerät passiert, begrenzt bei sehr großen Dateien der Arbeitsspeicher des Browsers und kein Upload-Limit.',
    },
  ],
  ja: [
    {
      q: 'ファイルはサーバーにアップロードされますか?',
      a: 'いいえ。変換はすべてブラウザ内で実行され、このページはファイルを外部に送信できないよう制限されています。ブラウザの開発者ツールの「ネットワーク」タブで、ファイルを含む通信が一切ないことをご自身で確認できます。',
    },
    {
      q: 'ファイルサイズの上限はありますか?',
      a: '200 MBまでのファイルに対応しています。すべてお使いの端末上で処理するため、非常に大きなファイルではアップロード容量ではなくブラウザのメモリが上限になります。',
    },
  ],
  es: [
    {
      q: '¿Se suben mis archivos a un servidor?',
      a: 'No. La conversión se ejecuta por completo en tu navegador y la página no tiene permitido enviar tu archivo a ningún sitio. Puedes comprobarlo en la pestaña Red de las herramientas para desarrolladores del navegador: ninguna petición contiene tu archivo.',
    },
    {
      q: '¿Hay un límite de tamaño de archivo?',
      a: 'Se aceptan archivos de hasta 200 MB. Como todo ocurre en tu dispositivo, con archivos muy grandes el límite lo pone la memoria del navegador y no una cuota de subida.',
    },
  ],
};

export const tools: ToolDef[] = [
  {
    slug: 'gpx-to-kml',
    from: 'gpx',
    to: 'kml',
    i18n: {
      en: {
        title: 'GPX to KML Converter',
        description:
          'Convert GPX tracks, routes and waypoints to KML for Google Earth and Google My Maps. Free, instant, and your file never leaves your browser.',
        faq: [
          {
            q: 'What is kept when converting GPX to KML?',
            a: 'Waypoints, routes and tracks with their names, descriptions, elevation and timestamps. Tracks with timestamps are written as gx:Track, so Google Earth can play them back on its time slider. Multi-segment tracks stay multi-segment.',
          },
          {
            q: 'What is lost?',
            a: 'Sensor data stored in GPX extensions, such as heart rate, cadence and temperature, has no equivalent in KML and is not carried over. A track segment containing a single point is skipped because it cannot form a line.',
          },
          {
            q: 'How do I open the KML file in Google Earth?',
            a: 'In Google Earth on the web choose File → Import KML file; in Google Earth Pro use File → Open. In Google My Maps, add a layer and click Import.',
          },
        ],
      },
      de: {
        title: 'GPX in KML umwandeln',
        description:
          'GPX-Tracks, Routen und Wegpunkte in KML für Google Earth und Google My Maps umwandeln. Kostenlos, sofort – und Ihre Datei verlässt nie den Browser.',
        faq: [
          {
            q: 'Was bleibt bei der Umwandlung von GPX in KML erhalten?',
            a: 'Wegpunkte, Routen und Tracks mit Namen, Beschreibungen, Höhe und Zeitstempeln. Tracks mit Zeitstempeln werden als gx:Track geschrieben, sodass Google Earth sie über den Zeitschieberegler abspielen kann. Tracks mit mehreren Segmenten behalten ihre Segmente.',
          },
          {
            q: 'Was geht verloren?',
            a: 'Sensordaten aus GPX-Erweiterungen wie Herzfrequenz, Trittfrequenz und Temperatur haben in KML keine Entsprechung und werden nicht übernommen. Ein Tracksegment mit nur einem Punkt wird übersprungen, da es keine Linie bilden kann.',
          },
          {
            q: 'Wie öffne ich die KML-Datei in Google Earth?',
            a: 'In Google Earth im Web wählen Sie Datei → KML-Datei importieren, in Google Earth Pro Datei → Öffnen. In Google My Maps fügen Sie eine Ebene hinzu und klicken auf Importieren.',
          },
        ],
      },
      ja: {
        title: 'GPX KML 変換ツール',
        description:
          'GPXのトラック、ルート、ウェイポイントをGoogle EarthやGoogleマイマップ用のKMLに変換します。無料・即時変換で、ファイルがブラウザの外に出ることはありません。',
        faq: [
          {
            q: 'GPXからKMLへの変換で何が保持されますか?',
            a: 'ウェイポイント、ルート、トラックと、その名前、説明、標高、タイムスタンプが保持されます。タイムスタンプ付きのトラックはgx:Trackとして出力されるため、Google Earthのタイムスライダーで再生できます。複数セグメントのトラックもセグメント構造を維持します。',
          },
          {
            q: '失われる情報はありますか?',
            a: '心拍数、ケイデンス、気温などGPX拡張に保存されたセンサーデータは、KMLに対応する要素がないため引き継がれません。また、1点しかないトラックセグメントは線にならないためスキップされます。',
          },
          {
            q: 'KMLファイルをGoogle Earthで開くには?',
            a: 'Web版Google Earthでは「ファイル」→「KMLファイルをインポート」、Google Earth Proでは「ファイル」→「開く」を選びます。Googleマイマップではレイヤを追加して「インポート」をクリックします。',
          },
        ],
      },
      es: {
        title: 'Convertir GPX a KML',
        description:
          'Convierte tracks, rutas y waypoints GPX a KML para Google Earth y Google My Maps. Gratis, al instante, y tu archivo nunca sale de tu navegador.',
        faq: [
          {
            q: '¿Qué se conserva al convertir de GPX a KML?',
            a: 'Waypoints, rutas y tracks con sus nombres, descripciones, altitud y marcas de tiempo. Los tracks con marcas de tiempo se escriben como gx:Track, de modo que Google Earth puede reproducirlos con su control de tiempo. Los tracks de varios segmentos conservan sus segmentos.',
          },
          {
            q: '¿Qué se pierde?',
            a: 'Los datos de sensores guardados en extensiones GPX, como frecuencia cardíaca, cadencia y temperatura, no tienen equivalente en KML y no se trasladan. Un segmento de track con un solo punto se omite porque no puede formar una línea.',
          },
          {
            q: '¿Cómo abro el archivo KML en Google Earth?',
            a: 'En Google Earth para web elige Archivo → Importar archivo KML; en Google Earth Pro usa Archivo → Abrir. En Google My Maps, añade una capa y haz clic en Importar.',
          },
        ],
      },
    },
  },
  {
    slug: 'kml-to-gpx',
    from: 'kml',
    to: 'gpx',
    i18n: {
      en: {
        title: 'KML to GPX Converter',
        description:
          'Convert KML from Google Earth or Google My Maps to GPX for Garmin, Komoot, Strava and other GPS devices and apps. Free, instant, and private — nothing is uploaded.',
        faq: [
          {
            q: 'How are KML features mapped to GPX?',
            a: 'Placemarks with a point become waypoints. Paths (LineString) and gx:Track become tracks, keeping elevation and, for gx:Track, timestamps. A gx:MultiTrack becomes one track with several segments. Names and descriptions are kept.',
          },
          {
            q: 'What happens to polygons and styles?',
            a: 'GPX has no polygons, so each polygon outline is written as a track. Colors, icons and other KML styling have no GPX equivalent and are dropped.',
          },
          {
            q: 'Can I convert a KMZ file?',
            a: 'Not directly yet. A KMZ is a ZIP archive: rename it to .zip, extract it, and convert the doc.kml file inside.',
          },
        ],
      },
      de: {
        title: 'KML in GPX umwandeln',
        description:
          'KML aus Google Earth oder Google My Maps in GPX für Garmin, Komoot, Strava und andere GPS-Geräte und Apps umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.',
        faq: [
          {
            q: 'Wie werden KML-Elemente in GPX übertragen?',
            a: 'Ortsmarken mit einem Punkt werden zu Wegpunkten. Pfade (LineString) und gx:Track werden zu Tracks; die Höhe und bei gx:Track auch die Zeitstempel bleiben erhalten. Ein gx:MultiTrack wird zu einem Track mit mehreren Segmenten. Namen und Beschreibungen bleiben erhalten.',
          },
          {
            q: 'Was passiert mit Polygonen und Stilen?',
            a: 'GPX kennt keine Polygone, daher wird jeder Polygonumriss als Track geschrieben. Farben, Symbole und andere KML-Stile haben in GPX keine Entsprechung und entfallen.',
          },
          {
            q: 'Kann ich eine KMZ-Datei umwandeln?',
            a: 'Noch nicht direkt. Eine KMZ-Datei ist ein ZIP-Archiv: Benennen Sie sie in .zip um, entpacken Sie sie und wandeln Sie die enthaltene doc.kml um.',
          },
        ],
      },
      ja: {
        title: 'KML GPX 変換ツール',
        description:
          'Google EarthやGoogleマイマップのKMLを、Garmin、Komoot、StravaなどのGPS機器やアプリで使えるGPXに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。',
        faq: [
          {
            q: 'KMLの要素はGPXでどう扱われますか?',
            a: 'ポイントの目印はウェイポイントになります。パス(LineString)とgx:Trackはトラックになり、標高と、gx:Trackの場合はタイムスタンプも保持されます。gx:MultiTrackは複数セグメントを持つ1つのトラックになります。名前と説明も引き継がれます。',
          },
          {
            q: 'ポリゴンやスタイルはどうなりますか?',
            a: 'GPXにはポリゴンがないため、ポリゴンの輪郭はトラックとして出力されます。色やアイコンなどのKMLスタイルはGPXに対応する要素がないため破棄されます。',
          },
          {
            q: 'KMZファイルは変換できますか?',
            a: '現時点では直接変換できません。KMZはZIPアーカイブなので、拡張子を.zipに変更して展開し、中にあるdoc.kmlを変換してください。',
          },
        ],
      },
      es: {
        title: 'Convertir KML a GPX',
        description:
          'Convierte KML de Google Earth o Google My Maps a GPX para Garmin, Komoot, Strava y otros dispositivos y apps GPS. Gratis, al instante y privado: no se sube nada.',
        faq: [
          {
            q: '¿Cómo se trasladan los elementos KML a GPX?',
            a: 'Los marcadores con un punto se convierten en waypoints. Las rutas (LineString) y gx:Track se convierten en tracks, conservando la altitud y, en gx:Track, las marcas de tiempo. Un gx:MultiTrack pasa a ser un track con varios segmentos. Se conservan nombres y descripciones.',
          },
          {
            q: '¿Qué ocurre con los polígonos y los estilos?',
            a: 'GPX no tiene polígonos, así que el contorno de cada polígono se escribe como un track. Los colores, iconos y demás estilos KML no tienen equivalente en GPX y se descartan.',
          },
          {
            q: '¿Puedo convertir un archivo KMZ?',
            a: 'Todavía no directamente. Un KMZ es un archivo ZIP: cámbiale la extensión a .zip, descomprímelo y convierte el archivo doc.kml que contiene.',
          },
        ],
      },
    },
  },
  {
    slug: 'gpx-to-geojson',
    from: 'gpx',
    to: 'geojson',
    i18n: {
      en: {
        title: 'GPX to GeoJSON Converter',
        description:
          'Convert GPX tracks, routes and waypoints to GeoJSON for Leaflet, Mapbox, QGIS and PostGIS. Free, instant, and your file never leaves your browser.',
        faq: [
          {
            q: 'How is GPX mapped to GeoJSON?',
            a: 'Waypoints become Point features, routes become LineString features, and tracks become LineString or, with several segments, MultiLineString features. Coordinates are written as longitude, latitude, elevation, as RFC 7946 requires.',
          },
          {
            q: 'Where do timestamps and heart rate go?',
            a: 'GeoJSON coordinates cannot hold them, so per-point values are stored in the feature’s properties.coordinateProperties, in arrays parallel to the coordinates: times for timestamps, and heart rate, cadence or temperature when the GPX file contains them.',
          },
          {
            q: 'Which coordinate reference system is used?',
            a: 'WGS 84 (EPSG:4326) — the system both GPX and GeoJSON are defined in — so no reprojection takes place and coordinates are not rounded.',
          },
        ],
      },
      de: {
        title: 'GPX in GeoJSON umwandeln',
        description:
          'GPX-Tracks, Routen und Wegpunkte in GeoJSON für Leaflet, Mapbox, QGIS und PostGIS umwandeln. Kostenlos, sofort – und Ihre Datei verlässt nie den Browser.',
        faq: [
          {
            q: 'Wie wird GPX in GeoJSON abgebildet?',
            a: 'Wegpunkte werden zu Point-Features, Routen zu LineString-Features und Tracks zu LineString- oder, bei mehreren Segmenten, MultiLineString-Features. Koordinaten werden gemäß RFC 7946 als Längengrad, Breitengrad, Höhe geschrieben.',
          },
          {
            q: 'Wo landen Zeitstempel und Herzfrequenz?',
            a: 'GeoJSON-Koordinaten können sie nicht aufnehmen. Werte pro Punkt stehen deshalb in properties.coordinateProperties des Features, in Arrays parallel zu den Koordinaten: times für Zeitstempel sowie Herzfrequenz, Trittfrequenz oder Temperatur, sofern die GPX-Datei sie enthält.',
          },
          {
            q: 'Welches Koordinatenreferenzsystem wird verwendet?',
            a: 'WGS 84 (EPSG:4326) – das System, in dem GPX und GeoJSON definiert sind. Es findet keine Umprojektion statt, und Koordinaten werden nicht gerundet.',
          },
        ],
      },
      ja: {
        title: 'GPX GeoJSON 変換ツール',
        description:
          'GPXのトラック、ルート、ウェイポイントを、Leaflet、Mapbox、QGIS、PostGISで使えるGeoJSONに変換します。無料・即時変換で、ファイルがブラウザの外に出ることはありません。',
        faq: [
          {
            q: 'GPXはGeoJSONでどう表現されますか?',
            a: 'ウェイポイントはPoint、ルートはLineString、トラックはLineString(複数セグメントの場合はMultiLineString)のフィーチャーになります。座標はRFC 7946に従い「経度、緯度、標高」の順で出力されます。',
          },
          {
            q: 'タイムスタンプや心拍数はどこに入りますか?',
            a: 'GeoJSONの座標には含められないため、各点の値はフィーチャーのproperties.coordinatePropertiesに、座標と同じ並びの配列として保存されます。タイムスタンプはtimesに入り、GPXに心拍数、ケイデンス、気温が含まれていればそれらも保存されます。',
          },
          {
            q: '座標参照系は何ですか?',
            a: 'GPXとGeoJSONの両方が採用しているWGS 84(EPSG:4326)です。再投影は行わず、座標を丸めることもありません。',
          },
        ],
      },
      es: {
        title: 'Convertir GPX a GeoJSON',
        description:
          'Convierte tracks, rutas y waypoints GPX a GeoJSON para Leaflet, Mapbox, QGIS y PostGIS. Gratis, al instante, y tu archivo nunca sale de tu navegador.',
        faq: [
          {
            q: '¿Cómo se representa GPX en GeoJSON?',
            a: 'Los waypoints pasan a ser entidades Point, las rutas LineString y los tracks LineString o, si tienen varios segmentos, MultiLineString. Las coordenadas se escriben como longitud, latitud y altitud, tal como exige el RFC 7946.',
          },
          {
            q: '¿Dónde quedan las marcas de tiempo y la frecuencia cardíaca?',
            a: 'Las coordenadas GeoJSON no pueden contenerlas, así que los valores por punto se guardan en properties.coordinateProperties de la entidad, en arrays paralelos a las coordenadas: times para las marcas de tiempo, y frecuencia cardíaca, cadencia o temperatura si el archivo GPX las incluye.',
          },
          {
            q: '¿Qué sistema de referencia de coordenadas se usa?',
            a: 'WGS 84 (EPSG:4326), el sistema en el que están definidos tanto GPX como GeoJSON. No se reproyecta nada ni se redondean las coordenadas.',
          },
        ],
      },
    },
  },
];

export const getTool = (slug: string): ToolDef | undefined => tools.find((t) => t.slug === slug);

/** Tools that share a format with `tool`; the exact reverse conversion comes first. */
export function relatedTools(tool: ToolDef): ToolDef[] {
  const score = (t: ToolDef): number =>
    (t.from === tool.to && t.to === tool.from ? 4 : 0) +
    (t.from === tool.from ? 2 : 0) +
    (t.to === tool.to || t.from === tool.to || t.to === tool.from ? 1 : 0);
  return tools
    .filter((t) => t !== tool && score(t) > 0)
    .sort((a, b) => score(b) - score(a));
}
