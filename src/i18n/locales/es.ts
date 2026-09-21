import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: "Conversores privados de archivos GPS",
    homeDescription: "Herramientas gratuitas para archivos GPS que funcionan por completo en tu navegador. Convierte entre GPX, KML, GeoJSON y CSV sin subir nada.",
    homeHeading: "Herramientas GPS que nunca suben tus archivos",
    allTools: "Todas las herramientas",
    privacyBadge: "Tu archivo nunca sale de tu navegador",
    dropPrompt: "Suelta aquí tu archivo {from}",
    dropHint: "o",
    chooseFile: "Elegir un archivo",
    converting: "Convirtiendo…",
    done: "Tu archivo {to} está listo",
    stats: "Elementos: {features} · Puntos: {points}",
    download: "Descargar {to}",
    convertAnother: "Convertir otro archivo",
    tryAgain: "Probar con otro archivo",
    errors: {
      'invalid-file': "No se pudo leer este archivo. No parece un {from} válido.",
      'wrong-format': "Esto no es un archivo {from}. Elige un archivo .{ext}.",
      empty: "Este archivo {from} no contiene waypoints, rutas ni tracks que convertir.",
      unsupported: "Esta conversión no es compatible.",
      'not-wgs84': "Este archivo {from} no usa coordenadas WGS 84 de longitud y latitud. Vuelve a exportarlo como EPSG:4326 e inténtalo de nuevo.",
      'too-large': "Este archivo supera los 200 MB y no se puede convertir en el navegador.",
      unknown: "Algo salió mal durante la conversión. No se subió nada."
    },
    howToHeading: "Cómo convertir {from} a {to}",
    howToSteps: [
      "Suelta tu archivo {from} en el recuadro de arriba o haz clic para elegirlo en tu dispositivo.",
      "La conversión se ejecuta al instante en tu navegador. No se sube nada.",
      "Haz clic en «Descargar {to}» para guardar el archivo convertido."
    ],
    formatsHeading: "Sobre los formatos",
    faqHeading: "Preguntas frecuentes",
    relatedHeading: "Herramientas relacionadas",
    adLabel: "Publicidad",
    language: "Idioma",
    footerPrivacy: "Todas las conversiones se ejecutan en tu navegador. No se sube ni se guarda ningún archivo."
  },
  formats: {
    gpx: "GPX (GPS Exchange Format) es el estándar XML abierto para datos GPS. Guarda waypoints, rutas y tracks con altitud y marcas de tiempo, y es el formato que importan y exportan Garmin, Strava, Komoot, Wahoo y la mayoría de apps de actividades al aire libre.",
    kml: "KML (Keyhole Markup Language) es el formato XML de Google Earth y Google My Maps. Describe marcadores, rutas y polígonos, y puede incluir tracks con marcas de tiempo mediante la extensión gx:Track.",
    geojson: "GeoJSON (RFC 7946) es el formato JSON para datos geográficos que usan los mapas web y el software SIG como Leaflet, Mapbox, QGIS y PostGIS. Las coordenadas se guardan como longitud, latitud y altitud.",
    csv: "CSV (valores separados por comas) es el formato de tabla en texto plano que leen Excel, Google Sheets, LibreOffice, R y pandas. No tiene noción de geometría, así que los datos GPS se escriben como una fila por punto con columnas de latitud y longitud."
  },
  commonFaq: [
    {
      q: "¿Se suben mis archivos a un servidor?",
      a: "No. La conversión se ejecuta por completo en tu navegador y la página no tiene permitido enviar tu archivo a ningún sitio. Puedes comprobarlo en la pestaña Red de las herramientas para desarrolladores del navegador: ninguna petición contiene tu archivo."
    },
    {
      q: "¿Hay un límite de tamaño de archivo?",
      a: "Se aceptan archivos de hasta 200 MB. Como todo ocurre en tu dispositivo, con archivos muy grandes el límite lo pone la memoria del navegador y no una cuota de subida."
    }
  ],
  tools: {
    'gpx-to-kml': {
      title: "Convertir GPX a KML",
      description: "Convierte tracks, rutas y waypoints GPX a KML para Google Earth y Google My Maps. Gratis, al instante, y tu archivo nunca sale de tu navegador.",
      faq: [
        {
          q: "¿Qué se conserva al convertir de GPX a KML?",
          a: "Waypoints, rutas y tracks con sus nombres, descripciones, altitud y marcas de tiempo. Los tracks con marcas de tiempo se escriben como gx:Track, de modo que Google Earth puede reproducirlos con su control de tiempo. Los tracks de varios segmentos conservan sus segmentos."
        },
        {
          q: "¿Qué se pierde?",
          a: "Los datos de sensores guardados en extensiones GPX, como frecuencia cardíaca, cadencia y temperatura, no tienen equivalente en KML y no se trasladan. Un segmento de track con un solo punto se omite porque no puede formar una línea."
        },
        {
          q: "¿Cómo abro el archivo KML en Google Earth?",
          a: "En Google Earth para web elige Archivo → Importar archivo KML; en Google Earth Pro usa Archivo → Abrir. En Google My Maps, añade una capa y haz clic en Importar."
        }
      ]
    },
    'kml-to-gpx': {
      title: "Convertir KML a GPX",
      description: "Convierte KML de Google Earth o Google My Maps a GPX para Garmin, Komoot, Strava y otros dispositivos y apps GPS. Gratis, al instante y privado: no se sube nada.",
      faq: [
        {
          q: "¿Cómo se trasladan los elementos KML a GPX?",
          a: "Los marcadores con un punto se convierten en waypoints. Las rutas (LineString) y gx:Track se convierten en tracks, conservando la altitud y, en gx:Track, las marcas de tiempo. Un gx:MultiTrack pasa a ser un track con varios segmentos. Se conservan nombres y descripciones. Las rutas dibujadas sobre el terreno en Google Earth tienen altitud 0 en lugar de una altitud real, por lo que no se escribe altitud para ellas."
        },
        {
          q: "¿Qué ocurre con los polígonos y los estilos?",
          a: "GPX no tiene polígonos, así que el contorno de cada polígono se escribe como un track. Los colores, iconos y demás estilos KML no tienen equivalente en GPX y se descartan."
        },
        {
          q: "¿Puedo convertir un archivo KMZ?",
          a: "Todavía no directamente. Un KMZ es un archivo ZIP: cámbiale la extensión a .zip, descomprímelo y convierte el archivo doc.kml que contiene."
        }
      ]
    },
    'gpx-to-geojson': {
      title: "Convertir GPX a GeoJSON",
      description: "Convierte tracks, rutas y waypoints GPX a GeoJSON para Leaflet, Mapbox, QGIS y PostGIS. Gratis, al instante, y tu archivo nunca sale de tu navegador.",
      faq: [
        {
          q: "¿Cómo se representa GPX en GeoJSON?",
          a: "Los waypoints pasan a ser entidades Point, las rutas LineString y los tracks LineString o, si tienen varios segmentos, MultiLineString. Las coordenadas se escriben como longitud, latitud y altitud, tal como exige el RFC 7946."
        },
        {
          q: "¿Dónde quedan las marcas de tiempo y la frecuencia cardíaca?",
          a: "Las coordenadas GeoJSON no pueden contenerlas, así que los valores por punto se guardan en properties.coordinateProperties de la entidad, en arrays paralelos a las coordenadas: times para las marcas de tiempo, y frecuencia cardíaca, cadencia o temperatura si el archivo GPX las incluye."
        },
        {
          q: "¿Qué sistema de referencia de coordenadas se usa?",
          a: "WGS 84 (EPSG:4326), el sistema en el que están definidos tanto GPX como GeoJSON. No se reproyecta nada ni se redondean las coordenadas."
        }
      ]
    },
    'gpx-to-csv': {
      title: "Convertir GPX a CSV",
      description: "Convierte tracks, rutas y waypoints GPX a una hoja CSV para Excel, Google Sheets o Python. Una fila por punto, y tu archivo nunca sale de tu navegador.",
      faq: [
        {
          q: "¿Qué columnas contiene el CSV?",
          a: "Una fila por punto con type (waypoint, route o track), name, description, segment, latitude, longitude, elevation y time. Si el archivo GPX incluye datos de sensores, se añaden las columnas heart_rate, cadence, temperature y power. Las descripciones solo se escriben en las filas de waypoints."
        },
        {
          q: "¿Cómo se tratan los tracks con varios segmentos?",
          a: "Los puntos conservan el orden en que se grabaron y la columna segment numera los segmentos de cada track desde 1, de modo que las pausas y los cortes de la grabación siguen siendo visibles."
        },
        {
          q: "¿Se abrirá correctamente en Excel?",
          a: "Sí. El archivo es UTF-8 con marca de orden de bytes, así que Excel muestra bien los nombres con acentos o en japonés. Las horas están en ISO 8601 y UTC. El texto que empieza por =, +, - o @ lleva un apóstrofo delante para que la hoja de cálculo no lo ejecute como fórmula."
        }
      ]
    },
    'kml-to-geojson': {
      title: "Convertir KML a GeoJSON",
      description: "Convierte KML de Google Earth o Google My Maps a GeoJSON para Leaflet, Mapbox, QGIS y PostGIS. Gratis, al instante y privado: no se sube nada.",
      faq: [
        {
          q: "¿Cómo se representan las geometrías KML en GeoJSON?",
          a: "Los puntos, LineString y polígonos (con sus huecos) conservan su tipo. Un gx:Track pasa a ser un LineString y un gx:MultiTrack un MultiLineString, con las marcas de tiempo en properties.coordinateProperties.times. Una MultiGeometry de tipos mixtos se convierte en una GeometryCollection."
        },
        {
          q: "¿Qué ocurre con los nombres, las descripciones y los estilos?",
          a: "El nombre, la descripción, las marcas de tiempo y los campos ExtendedData pasan a ser propiedades de la entidad. Los estilos de línea y relleno se escriben como propiedades simplestyle (stroke, stroke-width, fill, fill-opacity), que entienden geojson.io, Mapbox y GitHub."
        },
        {
          q: "¿Qué no se convierte?",
          a: "Los enlaces de red no se siguen, porque esta página no puede descargar nada; solo se conservan el contorno de su región y su URL. Una superposición de imagen se convierte en un polígono de su huella con la URL de la imagen en la propiedad icon, pero la imagen no se incluye. Los modelos 3D y los recorridos se omiten. Los archivos KMZ deben descomprimirse antes: cambia la extensión a .zip, extrae y convierte el doc.kml que contiene."
        }
      ]
    },
    'geojson-to-gpx': {
      title: "Convertir GeoJSON a GPX",
      description: "Convierte GeoJSON de QGIS, geojson.io o Mapbox a GPX para Garmin, Komoot, Strava y otros dispositivos y apps GPS. Gratis, al instante y privado: no se sube nada.",
      faq: [
        {
          q: "¿Cómo se trasladan las entidades GeoJSON a GPX?",
          a: "Los puntos se convierten en waypoints, los LineString en tracks y un MultiLineString en un track con varios segmentos. GPX no tiene polígonos, así que los contornos de los polígonos, incluidos los huecos, se escriben como segmentos de track. El nombre se lee de la propiedad name o title, la descripción de description y la altitud de la tercera coordenada. Sirven tanto un Feature como una FeatureCollection o una geometría suelta."
        },
        {
          q: "¿Puede el archivo GPX contener marcas de tiempo?",
          a: "El GeoJSON normal no tiene hora por punto. Si el archivo lleva horas en properties.coordinateProperties.times, el formato que escribe el conversor de GPX a GeoJSON de este sitio, se convierten en marcas de tiempo GPX, y la frecuencia cardíaca, la cadencia, la temperatura y la potencia guardadas en el mismo lugar pasan a ser elementos Garmin TrackPointExtension, que leen Strava, Garmin Connect y Komoot. Un ciclo GPX → GeoJSON → GPX conserva así waypoints, rutas, segmentos, altitud, hora y datos de sensores."
        },
        {
          q: "¿Por qué dice que mi archivo no usa WGS 84?",
          a: "GPX solo admite longitud y latitud WGS 84 en grados. Un GeoJSON exportado desde QGIS u ogr2ogr en un sistema proyectado como EPSG:3857 contiene metros y daría un GPX inservible, por eso se rechaza. Vuelve a exportar la capa con el SRC EPSG:4326."
        }
      ]
    },
    'geojson-to-kml': {
      title: "Convertir GeoJSON a KML",
      description: "Convierte GeoJSON de QGIS, geojson.io o Mapbox a KML para Google Earth y Google My Maps conservando los atributos. Gratis, al instante, y no se sube nada.",
      faq: [
        {
          q: "¿Cómo se representan las geometrías GeoJSON en KML?",
          a: "Los puntos, LineString y polígonos, con sus huecos, conservan su tipo. MultiPoint, MultiLineString, MultiPolygon y GeometryCollection pasan a ser una MultiGeometry de KML. Una línea con hora por punto en properties.coordinateProperties.times se escribe como gx:Track para que Google Earth pueda animarla."
        },
        {
          q: "¿Se conservan las propiedades de las entidades?",
          a: "Sí. name (o title) y description pasan a ser el nombre y la descripción del marcador, y cualquier otra propiedad de texto, número o verdadero/falso se escribe en ExtendedData, que Google Earth muestra en el globo del marcador. Los objetos anidados, los arrays y los valores vacíos se omiten. Los colores simplestyle como stroke o marker-color se conservan como datos, pero no cambian el aspecto del marcador."
        },
        {
          q: "¿Por qué dice que mi archivo no usa WGS 84?",
          a: "KML solo admite longitud y latitud WGS 84 en grados. Un GeoJSON exportado desde QGIS u ogr2ogr en un sistema proyectado como EPSG:3857 contiene metros y aparecería en el lugar equivocado, por eso se rechaza. Vuelve a exportar la capa con el SRC EPSG:4326."
        }
      ]
    }
  }
};
