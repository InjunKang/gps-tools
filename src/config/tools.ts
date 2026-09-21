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
  /** Other extensions the same format is commonly saved with; offered in the file picker. */
  alsoAccepts?: string[];
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
    alsoAccepts: ['json'],
    mime: 'application/geo+json',
    about: {
      en: 'GeoJSON (RFC 7946) is the JSON format for geographic features used by web maps and GIS software such as Leaflet, Mapbox, QGIS and PostGIS. Coordinates are stored as longitude, latitude, elevation.',
      de: 'GeoJSON (RFC 7946) ist das JSON-Format für Geodaten, das Webkarten und GIS-Software wie Leaflet, Mapbox, QGIS und PostGIS verwenden. Koordinaten werden als Längengrad, Breitengrad, Höhe gespeichert.',
      ja: 'GeoJSON(RFC 7946)は、Leaflet、Mapbox、QGIS、PostGISなどのWeb地図やGISソフトで使われる地理データ用のJSON形式です。座標は「経度、緯度、標高」の順で保存されます。',
      es: 'GeoJSON (RFC 7946) es el formato JSON para datos geográficos que usan los mapas web y el software SIG como Leaflet, Mapbox, QGIS y PostGIS. Las coordenadas se guardan como longitud, latitud y altitud.',
    },
  },
  csv: {
    label: 'CSV',
    extension: 'csv',
    mime: 'text/csv',
    about: {
      en: 'CSV (comma-separated values) is the plain-text table format that Excel, Google Sheets, LibreOffice, R and pandas all read. It has no notion of geometry, so GPS data is written as one row per point with latitude and longitude columns.',
      de: 'CSV (Comma-Separated Values) ist das Tabellenformat in Klartext, das Excel, Google Sheets, LibreOffice, R und pandas lesen. Es kennt keine Geometrien, daher werden GPS-Daten als eine Zeile pro Punkt mit Spalten für Breiten- und Längengrad geschrieben.',
      ja: 'CSV(カンマ区切り値)は、Excel、Googleスプレッドシート、LibreOffice、R、pandasなどで読み込めるプレーンテキストの表形式です。ジオメトリの概念がないため、GPSデータは緯度・経度の列を持つ1点1行の形式で出力されます。',
      es: 'CSV (valores separados por comas) es el formato de tabla en texto plano que leen Excel, Google Sheets, LibreOffice, R y pandas. No tiene noción de geometría, así que los datos GPS se escriben como una fila por punto con columnas de latitud y longitud.',
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
            a: 'Placemarks with a point become waypoints. Paths (LineString) and gx:Track become tracks, keeping elevation and, for gx:Track, timestamps. A gx:MultiTrack becomes one track with several segments. Names and descriptions are kept. Paths drawn on the ground in Google Earth carry an altitude of 0 rather than a real elevation, so no elevation is written for them.',
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
            a: 'Ortsmarken mit einem Punkt werden zu Wegpunkten. Pfade (LineString) und gx:Track werden zu Tracks; die Höhe und bei gx:Track auch die Zeitstempel bleiben erhalten. Ein gx:MultiTrack wird zu einem Track mit mehreren Segmenten. Namen und Beschreibungen bleiben erhalten. In Google Earth auf den Boden gezeichnete Pfade haben die Höhe 0 statt einer echten Höhe; für sie wird daher keine Höhe geschrieben.',
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
            a: 'ポイントの目印はウェイポイントになります。パス(LineString)とgx:Trackはトラックになり、標高と、gx:Trackの場合はタイムスタンプも保持されます。gx:MultiTrackは複数セグメントを持つ1つのトラックになります。名前と説明も引き継がれます。Google Earthで地面に沿って描いたパスは実際の標高ではなく高度0を持つため、標高は出力されません。',
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
            a: 'Los marcadores con un punto se convierten en waypoints. Las rutas (LineString) y gx:Track se convierten en tracks, conservando la altitud y, en gx:Track, las marcas de tiempo. Un gx:MultiTrack pasa a ser un track con varios segmentos. Se conservan nombres y descripciones. Las rutas dibujadas sobre el terreno en Google Earth tienen altitud 0 en lugar de una altitud real, por lo que no se escribe altitud para ellas.',
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
  {
    slug: 'gpx-to-csv',
    from: 'gpx',
    to: 'csv',
    i18n: {
      en: {
        title: 'GPX to CSV Converter',
        description:
          'Convert GPX tracks, routes and waypoints to a CSV spreadsheet for Excel, Google Sheets or Python. One row per point, and your file never leaves your browser.',
        faq: [
          {
            q: 'Which columns does the CSV contain?',
            a: 'One row per point with type (waypoint, route or track), name, description, segment, latitude, longitude, elevation and time. If the GPX file contains sensor data, heart_rate, cadence, temperature and power columns are added. Descriptions are written on waypoint rows only.',
          },
          {
            q: 'How are tracks with several segments handled?',
            a: 'Points stay in their recorded order, and the segment column numbers the segments of each track from 1, so pauses and gaps in a recording remain visible.',
          },
          {
            q: 'Will it open correctly in Excel?',
            a: 'Yes. The file is UTF-8 with a byte order mark, so Excel shows accented and Japanese names correctly. Times are ISO 8601 in UTC. Text starting with =, +, - or @ is prefixed with an apostrophe so a spreadsheet cannot run it as a formula.',
          },
        ],
      },
      de: {
        title: 'GPX in CSV umwandeln',
        description:
          'GPX-Tracks, Routen und Wegpunkte in eine CSV-Tabelle für Excel, Google Sheets oder Python umwandeln. Eine Zeile pro Punkt – und Ihre Datei verlässt nie den Browser.',
        faq: [
          {
            q: 'Welche Spalten enthält die CSV-Datei?',
            a: 'Eine Zeile pro Punkt mit type (waypoint, route oder track), name, description, segment, latitude, longitude, elevation und time. Enthält die GPX-Datei Sensordaten, kommen die Spalten heart_rate, cadence, temperature und power hinzu. Beschreibungen stehen nur in Wegpunkt-Zeilen.',
          },
          {
            q: 'Wie werden Tracks mit mehreren Segmenten behandelt?',
            a: 'Die Punkte bleiben in der aufgezeichneten Reihenfolge, und die Spalte segment nummeriert die Segmente jedes Tracks ab 1. Pausen und Lücken in der Aufzeichnung bleiben so erkennbar.',
          },
          {
            q: 'Lässt sich die Datei korrekt in Excel öffnen?',
            a: 'Ja. Die Datei ist UTF-8 mit Byte Order Mark, sodass Excel Umlaute und japanische Namen richtig anzeigt. Zeiten stehen im ISO-8601-Format in UTC. Text, der mit =, +, - oder @ beginnt, erhält ein vorangestelltes Apostroph, damit eine Tabellenkalkulation ihn nicht als Formel ausführt.',
          },
        ],
      },
      ja: {
        title: 'GPX CSV 変換ツール',
        description:
          'GPXのトラック、ルート、ウェイポイントを、ExcelやGoogleスプレッドシート、Pythonで使えるCSVに変換します。1点につき1行で出力し、ファイルがブラウザの外に出ることはありません。',
        faq: [
          {
            q: 'CSVにはどの列が含まれますか?',
            a: '1点につき1行で、type(waypoint、route、track)、name、description、segment、latitude、longitude、elevation、timeの各列が出力されます。GPXにセンサーデータがある場合は、heart_rate、cadence、temperature、powerの列が追加されます。descriptionはウェイポイントの行にのみ出力されます。',
          },
          {
            q: '複数セグメントのトラックはどう扱われますか?',
            a: 'ポイントは記録された順序のまま出力され、segment列にトラックごとに1から始まるセグメント番号が入ります。記録の一時停止や途切れもそのまま確認できます。',
          },
          {
            q: 'Excelで正しく開けますか?',
            a: 'はい。BOM付きのUTF-8で出力するため、Excelでも日本語やアクセント付きの名前が文字化けしません。時刻はISO 8601形式のUTCです。=、+、-、@で始まるテキストは、表計算ソフトで数式として実行されないよう先頭にアポストロフィを付けます。',
          },
        ],
      },
      es: {
        title: 'Convertir GPX a CSV',
        description:
          'Convierte tracks, rutas y waypoints GPX a una hoja CSV para Excel, Google Sheets o Python. Una fila por punto, y tu archivo nunca sale de tu navegador.',
        faq: [
          {
            q: '¿Qué columnas contiene el CSV?',
            a: 'Una fila por punto con type (waypoint, route o track), name, description, segment, latitude, longitude, elevation y time. Si el archivo GPX incluye datos de sensores, se añaden las columnas heart_rate, cadence, temperature y power. Las descripciones solo se escriben en las filas de waypoints.',
          },
          {
            q: '¿Cómo se tratan los tracks con varios segmentos?',
            a: 'Los puntos conservan el orden en que se grabaron y la columna segment numera los segmentos de cada track desde 1, de modo que las pausas y los cortes de la grabación siguen siendo visibles.',
          },
          {
            q: '¿Se abrirá correctamente en Excel?',
            a: 'Sí. El archivo es UTF-8 con marca de orden de bytes, así que Excel muestra bien los nombres con acentos o en japonés. Las horas están en ISO 8601 y UTC. El texto que empieza por =, +, - o @ lleva un apóstrofo delante para que la hoja de cálculo no lo ejecute como fórmula.',
          },
        ],
      },
    },
  },
  {
    slug: 'kml-to-geojson',
    from: 'kml',
    to: 'geojson',
    i18n: {
      en: {
        title: 'KML to GeoJSON Converter',
        description:
          'Convert KML from Google Earth or Google My Maps to GeoJSON for Leaflet, Mapbox, QGIS and PostGIS. Free, instant, and private — nothing is uploaded.',
        faq: [
          {
            q: 'How are KML geometries mapped to GeoJSON?',
            a: 'Points, LineStrings and Polygons (including holes) keep their type. A gx:Track becomes a LineString and a gx:MultiTrack a MultiLineString, with timestamps in properties.coordinateProperties.times. A MultiGeometry of mixed types becomes a GeometryCollection.',
          },
          {
            q: 'What happens to names, descriptions and styles?',
            a: 'Name, description, timestamps and ExtendedData fields become feature properties. Line and fill styles are written as simplestyle properties such as stroke, stroke-width, fill and fill-opacity, which geojson.io, Mapbox and GitHub understand.',
          },
          {
            q: 'What is not converted?',
            a: 'Network links are not followed, because this page cannot download anything; only their region outline and URL are kept. A ground overlay becomes a polygon of its footprint with the image URL in the icon property, but the image itself is not included. 3D models and tours are skipped. KMZ files must be unzipped first: rename to .zip, extract, and convert the doc.kml inside.',
          },
        ],
      },
      de: {
        title: 'KML in GeoJSON umwandeln',
        description:
          'KML aus Google Earth oder Google My Maps in GeoJSON für Leaflet, Mapbox, QGIS und PostGIS umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.',
        faq: [
          {
            q: 'Wie werden KML-Geometrien in GeoJSON abgebildet?',
            a: 'Punkte, LineStrings und Polygone (auch mit Löchern) behalten ihren Typ. Ein gx:Track wird zu einem LineString und ein gx:MultiTrack zu einem MultiLineString, mit Zeitstempeln in properties.coordinateProperties.times. Eine MultiGeometry mit gemischten Typen wird zu einer GeometryCollection.',
          },
          {
            q: 'Was passiert mit Namen, Beschreibungen und Stilen?',
            a: 'Name, Beschreibung, Zeitstempel und ExtendedData-Felder werden zu Feature-Properties. Linien- und Füllstile werden als simplestyle-Properties wie stroke, stroke-width, fill und fill-opacity geschrieben, die geojson.io, Mapbox und GitHub verstehen.',
          },
          {
            q: 'Was wird nicht umgewandelt?',
            a: 'Netzwerklinks werden nicht verfolgt, da diese Seite nichts herunterladen kann; nur ihr Regionsumriss und ihre URL bleiben erhalten. Ein Boden-Overlay wird zu einem Polygon seiner Grundfläche mit der Bild-URL in der Property icon, das Bild selbst ist nicht enthalten. 3D-Modelle und Touren werden übersprungen. KMZ-Dateien müssen zuerst entpackt werden: in .zip umbenennen, entpacken und die enthaltene doc.kml umwandeln.',
          },
        ],
      },
      ja: {
        title: 'KML GeoJSON 変換ツール',
        description:
          'Google EarthやGoogleマイマップのKMLを、Leaflet、Mapbox、QGIS、PostGISで使えるGeoJSONに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。',
        faq: [
          {
            q: 'KMLのジオメトリはGeoJSONでどう表現されますか?',
            a: 'Point、LineString、Polygon(穴を含む)はそのままの型で出力されます。gx:TrackはLineString、gx:MultiTrackはMultiLineStringになり、タイムスタンプはproperties.coordinateProperties.timesに入ります。型が混在するMultiGeometryはGeometryCollectionになります。',
          },
          {
            q: '名前、説明、スタイルはどうなりますか?',
            a: '名前、説明、タイムスタンプ、ExtendedDataの各フィールドはフィーチャーのpropertiesになります。線や塗りのスタイルは、stroke、stroke-width、fill、fill-opacityなどのsimplestyleプロパティとして出力され、geojson.io、Mapbox、GitHubで表示に反映されます。',
          },
          {
            q: '変換されないものはありますか?',
            a: 'このページは外部からデータを取得できないため、ネットワークリンクは読み込まれず、領域の輪郭とURLのみが保持されます。地面オーバーレイは表示範囲のポリゴンになり、画像のURLがiconプロパティに入りますが、画像そのものは含まれません。3Dモデルとツアーはスキップされます。KMZファイルは先に展開が必要です。拡張子を.zipに変更して展開し、中のdoc.kmlを変換してください。',
          },
        ],
      },
      es: {
        title: 'Convertir KML a GeoJSON',
        description:
          'Convierte KML de Google Earth o Google My Maps a GeoJSON para Leaflet, Mapbox, QGIS y PostGIS. Gratis, al instante y privado: no se sube nada.',
        faq: [
          {
            q: '¿Cómo se representan las geometrías KML en GeoJSON?',
            a: 'Los puntos, LineString y polígonos (con sus huecos) conservan su tipo. Un gx:Track pasa a ser un LineString y un gx:MultiTrack un MultiLineString, con las marcas de tiempo en properties.coordinateProperties.times. Una MultiGeometry de tipos mixtos se convierte en una GeometryCollection.',
          },
          {
            q: '¿Qué ocurre con los nombres, las descripciones y los estilos?',
            a: 'El nombre, la descripción, las marcas de tiempo y los campos ExtendedData pasan a ser propiedades de la entidad. Los estilos de línea y relleno se escriben como propiedades simplestyle (stroke, stroke-width, fill, fill-opacity), que entienden geojson.io, Mapbox y GitHub.',
          },
          {
            q: '¿Qué no se convierte?',
            a: 'Los enlaces de red no se siguen, porque esta página no puede descargar nada; solo se conservan el contorno de su región y su URL. Una superposición de imagen se convierte en un polígono de su huella con la URL de la imagen en la propiedad icon, pero la imagen no se incluye. Los modelos 3D y los recorridos se omiten. Los archivos KMZ deben descomprimirse antes: cambia la extensión a .zip, extrae y convierte el doc.kml que contiene.',
          },
        ],
      },
    },
  },
  {
    slug: 'geojson-to-gpx',
    from: 'geojson',
    to: 'gpx',
    i18n: {
      en: {
        title: 'GeoJSON to GPX Converter',
        description:
          'Convert GeoJSON from QGIS, geojson.io or Mapbox to GPX for Garmin, Komoot, Strava and other GPS devices and apps. Free, instant, and private — nothing is uploaded.',
        faq: [
          {
            q: 'How are GeoJSON features mapped to GPX?',
            a: 'Points become waypoints, LineStrings become tracks, and a MultiLineString becomes one track with several segments. GPX has no polygons, so polygon outlines, including holes, are written as track segments. The name is read from the name or title property, the description from description, and elevation from the third coordinate. A Feature, a FeatureCollection or a bare geometry all work.',
          },
          {
            q: 'Can the GPX file contain timestamps?',
            a: 'Plain GeoJSON has no per-point time. If the file carries times in properties.coordinateProperties.times, the layout written by this site’s GPX to GeoJSON converter, they become GPX timestamps, and heart rate, cadence, temperature and power in the same place become Garmin TrackPointExtension elements that Strava, Garmin Connect and Komoot read. A GPX → GeoJSON → GPX round trip therefore keeps waypoints, routes, segments, elevation, time and sensor data.',
          },
          {
            q: 'Why does it say my file does not use WGS 84?',
            a: 'GPX only supports WGS 84 longitude and latitude in degrees. GeoJSON exported from QGIS or ogr2ogr in a projected system such as EPSG:3857 contains metres, which would produce an unusable GPX file, so it is rejected. Export the layer again with the CRS set to EPSG:4326.',
          },
        ],
      },
      de: {
        title: 'GeoJSON in GPX umwandeln',
        description:
          'GeoJSON aus QGIS, geojson.io oder Mapbox in GPX für Garmin, Komoot, Strava und andere GPS-Geräte und Apps umwandeln. Kostenlos, sofort und privat – nichts wird hochgeladen.',
        faq: [
          {
            q: 'Wie werden GeoJSON-Features in GPX übertragen?',
            a: 'Punkte werden zu Wegpunkten, LineStrings zu Tracks, und ein MultiLineString wird zu einem Track mit mehreren Segmenten. GPX kennt keine Polygone, daher werden Polygonumrisse einschließlich Löchern als Tracksegmente geschrieben. Der Name stammt aus der Property name oder title, die Beschreibung aus description und die Höhe aus der dritten Koordinate. Ein Feature, eine FeatureCollection oder eine einzelne Geometrie funktionieren gleichermaßen.',
          },
          {
            q: 'Kann die GPX-Datei Zeitstempel enthalten?',
            a: 'Einfaches GeoJSON kennt keine Zeit pro Punkt. Enthält die Datei Zeiten in properties.coordinateProperties.times – so schreibt sie der GPX-in-GeoJSON-Konverter dieser Seite –, werden daraus GPX-Zeitstempel. Herzfrequenz, Trittfrequenz, Temperatur und Leistung an derselben Stelle werden zu Garmin-TrackPointExtension-Elementen, die Strava, Garmin Connect und Komoot lesen. Ein Durchlauf GPX → GeoJSON → GPX erhält so Wegpunkte, Routen, Segmente, Höhe, Zeit und Sensordaten.',
          },
          {
            q: 'Warum heißt es, meine Datei verwende kein WGS 84?',
            a: 'GPX unterstützt nur WGS-84-Längen- und Breitengrade in Grad. GeoJSON, das aus QGIS oder ogr2ogr in einem projizierten System wie EPSG:3857 exportiert wurde, enthält Meter und ergäbe eine unbrauchbare GPX-Datei; deshalb wird es abgelehnt. Exportieren Sie den Layer erneut mit dem KBS EPSG:4326.',
          },
        ],
      },
      ja: {
        title: 'GeoJSON GPX 変換ツール',
        description:
          'QGIS、geojson.io、MapboxなどのGeoJSONを、Garmin、Komoot、StravaなどのGPS機器やアプリで使えるGPXに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。',
        faq: [
          {
            q: 'GeoJSONのフィーチャーはGPXでどう扱われますか?',
            a: 'Pointはウェイポイント、LineStringはトラックになり、MultiLineStringは複数セグメントを持つ1つのトラックになります。GPXにはポリゴンがないため、ポリゴンの輪郭(穴を含む)はトラックセグメントとして出力されます。名前はnameまたはtitleプロパティ、説明はdescription、標高は3番目の座標値から読み取ります。Feature、FeatureCollection、単体のジオメトリのいずれにも対応しています。',
          },
          {
            q: 'GPXにタイムスタンプを含められますか?',
            a: '通常のGeoJSONには点ごとの時刻がありません。properties.coordinateProperties.times(このサイトのGPX→GeoJSON変換が出力する形式)に時刻が入っている場合は、GPXのタイムスタンプになります。同じ場所にある心拍数、ケイデンス、気温、パワーは、Strava、Garmin Connect、Komootが読み取れるGarmin TrackPointExtension要素として出力されます。そのためGPX→GeoJSON→GPXと往復しても、ウェイポイント、ルート、セグメント、標高、時刻、センサー値が保持されます。',
          },
          {
            q: '「WGS 84ではありません」と表示されるのはなぜですか?',
            a: 'GPXが扱えるのは、度単位のWGS 84経度・緯度だけです。QGISやogr2ogrからEPSG:3857などの投影座標系で書き出したGeoJSONにはメートル単位の値が入っており、そのまま変換すると使えないGPXになるため受け付けません。座標参照系をEPSG:4326にしてレイヤを書き出し直してください。',
          },
        ],
      },
      es: {
        title: 'Convertir GeoJSON a GPX',
        description:
          'Convierte GeoJSON de QGIS, geojson.io o Mapbox a GPX para Garmin, Komoot, Strava y otros dispositivos y apps GPS. Gratis, al instante y privado: no se sube nada.',
        faq: [
          {
            q: '¿Cómo se trasladan las entidades GeoJSON a GPX?',
            a: 'Los puntos se convierten en waypoints, los LineString en tracks y un MultiLineString en un track con varios segmentos. GPX no tiene polígonos, así que los contornos de los polígonos, incluidos los huecos, se escriben como segmentos de track. El nombre se lee de la propiedad name o title, la descripción de description y la altitud de la tercera coordenada. Sirven tanto un Feature como una FeatureCollection o una geometría suelta.',
          },
          {
            q: '¿Puede el archivo GPX contener marcas de tiempo?',
            a: 'El GeoJSON normal no tiene hora por punto. Si el archivo lleva horas en properties.coordinateProperties.times, el formato que escribe el conversor de GPX a GeoJSON de este sitio, se convierten en marcas de tiempo GPX, y la frecuencia cardíaca, la cadencia, la temperatura y la potencia guardadas en el mismo lugar pasan a ser elementos Garmin TrackPointExtension, que leen Strava, Garmin Connect y Komoot. Un ciclo GPX → GeoJSON → GPX conserva así waypoints, rutas, segmentos, altitud, hora y datos de sensores.',
          },
          {
            q: '¿Por qué dice que mi archivo no usa WGS 84?',
            a: 'GPX solo admite longitud y latitud WGS 84 en grados. Un GeoJSON exportado desde QGIS u ogr2ogr en un sistema proyectado como EPSG:3857 contiene metros y daría un GPX inservible, por eso se rechaza. Vuelve a exportar la capa con el SRC EPSG:4326.',
          },
        ],
      },
    },
  },
  {
    slug: 'geojson-to-kml',
    from: 'geojson',
    to: 'kml',
    i18n: {
      en: {
        title: 'GeoJSON to KML Converter',
        description:
          'Convert GeoJSON from QGIS, geojson.io or Mapbox to KML for Google Earth and Google My Maps, keeping feature attributes. Free, instant, and nothing is uploaded.',
        faq: [
          {
            q: 'How are GeoJSON geometries mapped to KML?',
            a: 'Points, LineStrings and Polygons, including holes, keep their type. MultiPoint, MultiLineString, MultiPolygon and GeometryCollection become a KML MultiGeometry. A line that carries per-point times in properties.coordinateProperties.times is written as gx:Track so Google Earth can animate it.',
          },
          {
            q: 'Are feature properties kept?',
            a: 'Yes. name (or title) and description become the placemark’s name and description, and every other text, number or true/false property is written to ExtendedData, which Google Earth shows in the placemark balloon. Nested objects, arrays and empty values are skipped, and simplestyle colors such as stroke or marker-color are kept as data but do not change how the placemark is drawn.',
          },
          {
            q: 'Why does it say my file does not use WGS 84?',
            a: 'KML only supports WGS 84 longitude and latitude in degrees. GeoJSON exported from QGIS or ogr2ogr in a projected system such as EPSG:3857 contains metres and would land in the wrong place, so it is rejected. Export the layer again with the CRS set to EPSG:4326.',
          },
        ],
      },
      de: {
        title: 'GeoJSON in KML umwandeln',
        description:
          'GeoJSON aus QGIS, geojson.io oder Mapbox in KML für Google Earth und Google My Maps umwandeln – Attribute bleiben erhalten. Kostenlos, sofort, und nichts wird hochgeladen.',
        faq: [
          {
            q: 'Wie werden GeoJSON-Geometrien in KML abgebildet?',
            a: 'Punkte, LineStrings und Polygone einschließlich Löchern behalten ihren Typ. MultiPoint, MultiLineString, MultiPolygon und GeometryCollection werden zu einer KML-MultiGeometry. Eine Linie mit Zeiten pro Punkt in properties.coordinateProperties.times wird als gx:Track geschrieben, sodass Google Earth sie animieren kann.',
          },
          {
            q: 'Bleiben die Properties der Features erhalten?',
            a: 'Ja. name (oder title) und description werden zu Name und Beschreibung der Ortsmarke, und jede weitere Property mit Text, Zahl oder Wahrheitswert wird in ExtendedData geschrieben, das Google Earth im Infofenster anzeigt. Verschachtelte Objekte, Arrays und leere Werte werden übersprungen. simplestyle-Farben wie stroke oder marker-color bleiben als Daten erhalten, ändern aber nicht die Darstellung der Ortsmarke.',
          },
          {
            q: 'Warum heißt es, meine Datei verwende kein WGS 84?',
            a: 'KML unterstützt nur WGS-84-Längen- und Breitengrade in Grad. GeoJSON, das aus QGIS oder ogr2ogr in einem projizierten System wie EPSG:3857 exportiert wurde, enthält Meter und würde an der falschen Stelle landen; deshalb wird es abgelehnt. Exportieren Sie den Layer erneut mit dem KBS EPSG:4326.',
          },
        ],
      },
      ja: {
        title: 'GeoJSON KML 変換ツール',
        description:
          'QGIS、geojson.io、MapboxなどのGeoJSONを、属性を保ったままGoogle EarthやGoogleマイマップ用のKMLに変換します。無料・即時変換で、ファイルはアップロードされません。',
        faq: [
          {
            q: 'GeoJSONのジオメトリはKMLでどう表現されますか?',
            a: 'Point、LineString、Polygon(穴を含む)はそのままの型で出力されます。MultiPoint、MultiLineString、MultiPolygon、GeometryCollectionはKMLのMultiGeometryになります。properties.coordinateProperties.timesに点ごとの時刻を持つラインはgx:Trackとして出力され、Google Earthでアニメーション再生できます。',
          },
          {
            q: 'フィーチャーのプロパティは保持されますか?',
            a: 'はい。name(またはtitle)とdescriptionは目印の名前と説明になり、それ以外の文字列・数値・真偽値のプロパティはすべてExtendedDataに出力され、Google Earthの吹き出しに表示されます。入れ子のオブジェクト、配列、空の値はスキップされます。strokeやmarker-colorなどのsimplestyleの色はデータとしては残りますが、目印の見た目には反映されません。',
          },
          {
            q: '「WGS 84ではありません」と表示されるのはなぜですか?',
            a: 'KMLが扱えるのは、度単位のWGS 84経度・緯度だけです。QGISやogr2ogrからEPSG:3857などの投影座標系で書き出したGeoJSONにはメートル単位の値が入っており、誤った位置に表示されてしまうため受け付けません。座標参照系をEPSG:4326にしてレイヤを書き出し直してください。',
          },
        ],
      },
      es: {
        title: 'Convertir GeoJSON a KML',
        description:
          'Convierte GeoJSON de QGIS, geojson.io o Mapbox a KML para Google Earth y Google My Maps conservando los atributos. Gratis, al instante, y no se sube nada.',
        faq: [
          {
            q: '¿Cómo se representan las geometrías GeoJSON en KML?',
            a: 'Los puntos, LineString y polígonos, con sus huecos, conservan su tipo. MultiPoint, MultiLineString, MultiPolygon y GeometryCollection pasan a ser una MultiGeometry de KML. Una línea con hora por punto en properties.coordinateProperties.times se escribe como gx:Track para que Google Earth pueda animarla.',
          },
          {
            q: '¿Se conservan las propiedades de las entidades?',
            a: 'Sí. name (o title) y description pasan a ser el nombre y la descripción del marcador, y cualquier otra propiedad de texto, número o verdadero/falso se escribe en ExtendedData, que Google Earth muestra en el globo del marcador. Los objetos anidados, los arrays y los valores vacíos se omiten. Los colores simplestyle como stroke o marker-color se conservan como datos, pero no cambian el aspecto del marcador.',
          },
          {
            q: '¿Por qué dice que mi archivo no usa WGS 84?',
            a: 'KML solo admite longitud y latitud WGS 84 en grados. Un GeoJSON exportado desde QGIS u ogr2ogr en un sistema proyectado como EPSG:3857 contiene metros y aparecería en el lugar equivocado, por eso se rechaza. Vuelve a exportar la capa con el SRC EPSG:4326.',
          },
        ],
      },
    },
  },
];

export const getTool = (slug: string): ToolDef | undefined => tools.find((t) => t.slug === slug);

const MAX_RELATED = 4;

/** Up to four tools that share a format with `tool`; the exact reverse conversion comes first. */
export function relatedTools(tool: ToolDef): ToolDef[] {
  const score = (t: ToolDef): number =>
    (t.from === tool.to && t.to === tool.from ? 4 : 0) +
    (t.from === tool.from ? 2 : 0) +
    (t.to === tool.to || t.from === tool.to || t.to === tool.from ? 1 : 0);
  return tools
    .filter((t) => t !== tool && score(t) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, MAX_RELATED);
}
