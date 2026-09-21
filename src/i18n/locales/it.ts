import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: 'Convertitori di file GPS privati',
    homeDescription: 'Strumenti gratuiti per file GPS che funzionano interamente nel tuo browser. Converti GPX, KML, GeoJSON e CSV senza caricare nulla.',
    homeHeading: 'Strumenti GPS che non caricano mai i tuoi file',
    allTools: 'Tutti gli strumenti',
    privacyBadge: 'Il tuo file non lascia mai il browser',
    dropPrompt: 'Trascina qui il tuo file {from}',
    dropHint: 'oppure',
    chooseFile: 'Scegli un file',
    converting: 'Conversione in corso…',
    done: 'Il tuo file {to} è pronto',
    stats: 'Elementi: {features} · Punti: {points}',
    download: 'Scarica {to}',
    share: 'Condividi…',
    renameHint: 'Se il file è stato salvato come «unknown», rinominalo in {name}.',
    convertAnother: 'Converti un altro file',
    tryAgain: 'Prova con un altro file',
    errors: {
      'invalid-file': 'Impossibile leggere questo file. Non sembra un {from} valido.',
      'wrong-format': 'Questo non è un file {from}. Scegli un file .{ext}.',
      empty: 'Questo file {from} non contiene waypoint, percorsi o tracce da convertire.',
      unsupported: 'Questa conversione non è supportata.',
      'not-wgs84': 'Questo file {from} non usa coordinate WGS 84 (longitudine/latitudine). Esportalo di nuovo in EPSG:4326 e riprova.',
      'too-large': 'Questo file supera i 200 MB e non può essere convertito nel browser.',
      unknown: 'Qualcosa è andato storto durante la conversione. Non è stato caricato nulla.',
    },
    howToHeading: 'Come convertire {from} in {to}',
    howToSteps: [
      'Trascina il tuo file {from} nel riquadro qui sopra, oppure clicca per sceglierlo dal tuo dispositivo.',
      'La conversione avviene all’istante nel tuo browser. Non viene caricato nulla.',
      'Clicca su «Scarica {to}» per salvare il file convertito.',
    ],
    formatsHeading: 'Informazioni sui formati',
    faqHeading: 'Domande frequenti',
    relatedHeading: 'Strumenti correlati',
    adLabel: 'Pubblicità',
    language: 'Lingua',
    footerPrivacy: 'Tutte le conversioni avvengono in locale nel tuo browser. Nessun file viene caricato o conservato.',
  },
  formats: {
    gpx: 'GPX (GPS Exchange Format) è lo standard XML aperto per i dati GPS. Memorizza waypoint, percorsi e tracce con quota e orari, ed è il formato che Garmin, Strava, Komoot, Wahoo e la maggior parte delle app outdoor importano ed esportano.',
    kml: 'KML (Keyhole Markup Language) è il formato XML di Google Earth e Google My Maps. Descrive segnaposto, percorsi e poligoni e può contenere tracce con orari tramite l’estensione gx:Track.',
    geojson: 'GeoJSON (RFC 7946) è il formato JSON per i dati geografici usato da mappe web e software GIS come Leaflet, Mapbox, QGIS e PostGIS. Le coordinate sono memorizzate come longitudine, latitudine, quota.',
    csv: 'CSV (valori separati da virgola) è il formato tabellare in testo semplice che Excel, Google Fogli, LibreOffice, R e pandas leggono tutti. Non ha alcuna nozione di geometria, quindi i dati GPS sono scritti con una riga per punto e colonne di latitudine e longitudine.',
  },
  commonFaq: [
    {
      q: 'I miei file vengono caricati su un server?',
      a: 'No. La conversione avviene interamente nel tuo browser e la pagina non è autorizzata a inviare il tuo file da nessuna parte. Puoi verificarlo nella scheda Rete degli strumenti per sviluppatori del browser: nessuna richiesta contiene il tuo file.',
    },
    {
      q: 'C’è un limite di dimensione?',
      a: 'Sono accettati file fino a 200 MB. Poiché tutto avviene sul tuo dispositivo, per i file molto grandi il limite è la memoria del browser, non una quota di caricamento.',
    },
  ],
  tools: {
    'gpx-to-kml': {
      title: 'Convertitore da GPX a KML',
      description: 'Converti tracce, percorsi e waypoint GPX in KML per Google Earth e Google My Maps. Gratuito, istantaneo, e il tuo file non lascia mai il browser.',
      faq: [
        {
          q: 'Cosa viene conservato convertendo da GPX a KML?',
          a: 'Waypoint, percorsi e tracce con nomi, descrizioni, quota e orari. Le tracce con orari vengono scritte come gx:Track, così Google Earth può riprodurle con il cursore temporale. Le tracce con più segmenti mantengono i segmenti.',
        },
        {
          q: 'Cosa si perde?',
          a: 'I dati dei sensori memorizzati nelle estensioni GPX, come frequenza cardiaca, cadenza e temperatura, non hanno equivalente in KML e non vengono trasferiti. Un segmento di traccia con un solo punto viene saltato perché non può formare una linea.',
        },
        {
          q: 'Come apro il file KML in Google Earth?',
          a: 'In Google Earth sul web scegli File → Importa file KML; in Google Earth Pro usa File → Apri. In Google My Maps aggiungi un livello e fai clic su Importa.',
        },
      ],
    },
    'kml-to-gpx': {
      title: 'Convertitore da KML a GPX',
      description: 'Converti KML da Google Earth o Google My Maps in GPX per Garmin, Komoot, Strava e altri dispositivi e app GPS. Gratuito, istantaneo e privato: non viene caricato nulla.',
      faq: [
        {
          q: 'Come vengono trasferiti gli elementi KML in GPX?',
          a: 'I segnaposto puntuali diventano waypoint. I percorsi (LineString) e i gx:Track diventano tracce, conservando la quota e, per gx:Track, gli orari. Un gx:MultiTrack diventa una traccia con più segmenti. Nomi e descrizioni vengono conservati. I percorsi disegnati a terra in Google Earth hanno quota 0 invece di una quota reale, quindi per essi non viene scritta alcuna quota.',
        },
        {
          q: 'Cosa succede a poligoni e stili?',
          a: 'GPX non ha poligoni, quindi il contorno di ogni poligono viene scritto come traccia. Colori, icone e altri stili KML non hanno equivalente in GPX e vengono scartati.',
        },
        {
          q: 'Posso convertire un file KMZ?',
          a: 'Non ancora direttamente. Un KMZ è un archivio ZIP: rinominalo in .zip, estrailo e converti il file doc.kml al suo interno.',
        },
      ],
    },
    'gpx-to-geojson': {
      title: 'Convertitore da GPX a GeoJSON',
      description: 'Converti tracce, percorsi e waypoint GPX in GeoJSON per Leaflet, Mapbox, QGIS e PostGIS. Gratuito, istantaneo, e il tuo file non lascia mai il browser.',
      faq: [
        {
          q: 'Come viene rappresentato il GPX in GeoJSON?',
          a: 'I waypoint diventano elementi Point, i percorsi LineString, e le tracce LineString oppure, con più segmenti, MultiLineString. Le coordinate sono scritte come longitudine, latitudine, quota, come richiede la RFC 7946.',
        },
        {
          q: 'Dove finiscono orari e frequenza cardiaca?',
          a: 'Le coordinate GeoJSON non possono contenerli, quindi i valori per punto sono memorizzati in properties.coordinateProperties dell’elemento, in array paralleli alle coordinate: times per gli orari, e frequenza cardiaca, cadenza o temperatura quando il file GPX li contiene.',
        },
        {
          q: 'Quale sistema di coordinate viene usato?',
          a: 'WGS 84 (EPSG:4326), il sistema in cui sono definiti sia GPX sia GeoJSON. Non avviene alcuna riproiezione e le coordinate non vengono arrotondate.',
        },
      ],
    },
    'gpx-to-csv': {
      title: 'Convertitore da GPX a CSV',
      description: 'Converti tracce, percorsi e waypoint GPX in una tabella CSV per Excel, Google Fogli o Python. Una riga per punto, e il tuo file non lascia mai il browser.',
      faq: [
        {
          q: 'Quali colonne contiene il CSV?',
          a: 'Una riga per punto con type (waypoint, route o track), name, description, segment, latitude, longitude, elevation e time. Se il file GPX contiene dati dei sensori, vengono aggiunte le colonne heart_rate, cadence, temperature e power. Le descrizioni compaiono solo nelle righe dei waypoint.',
        },
        {
          q: 'Come vengono gestite le tracce con più segmenti?',
          a: 'I punti restano nell’ordine di registrazione e la colonna segment numera i segmenti di ogni traccia a partire da 1, così pause e interruzioni della registrazione restano visibili.',
        },
        {
          q: 'Si apre correttamente in Excel?',
          a: 'Sì. Il file è in UTF-8 con byte order mark, quindi Excel mostra correttamente accenti e nomi giapponesi. Gli orari sono in ISO 8601, in UTC. Il testo che inizia con =, +, - o @ riceve un apostrofo iniziale, così un foglio di calcolo non può eseguirlo come formula.',
        },
      ],
    },
    'kml-to-geojson': {
      title: 'Convertitore da KML a GeoJSON',
      description: 'Converti KML da Google Earth o Google My Maps in GeoJSON per Leaflet, Mapbox, QGIS e PostGIS. Gratuito, istantaneo e privato: non viene caricato nulla.',
      faq: [
        {
          q: 'Come vengono convertite le geometrie KML in GeoJSON?',
          a: 'Point, LineString e Polygon (fori compresi) mantengono il loro tipo. Un gx:Track diventa un LineString e un gx:MultiTrack un MultiLineString, con gli orari in properties.coordinateProperties.times. Una MultiGeometry con tipi misti diventa una GeometryCollection.',
        },
        {
          q: 'Cosa succede a nomi, descrizioni e stili?',
          a: 'Nome, descrizione, orari e campi ExtendedData diventano proprietà dell’elemento. Gli stili di linea e riempimento vengono scritti come proprietà simplestyle (stroke, stroke-width, fill, fill-opacity), comprese da geojson.io, Mapbox e GitHub.',
        },
        {
          q: 'Cosa non viene convertito?',
          a: 'I network link non vengono seguiti, perché questa pagina non può scaricare nulla; ne restano solo il contorno della regione e l’URL. Un ground overlay diventa un poligono della sua area con l’URL dell’immagine nella proprietà icon, ma l’immagine stessa non è inclusa. Modelli 3D e tour vengono saltati. I file KMZ vanno prima decompressi: rinomina in .zip, estrai e converti il doc.kml contenuto.',
        },
      ],
    },
    'geojson-to-gpx': {
      title: 'Convertitore da GeoJSON a GPX',
      description: 'Converti GeoJSON da QGIS, geojson.io o Mapbox in GPX per Garmin, Komoot, Strava e altri dispositivi e app GPS. Gratuito, istantaneo e privato: non viene caricato nulla.',
      faq: [
        {
          q: 'Come vengono trasferiti gli elementi GeoJSON in GPX?',
          a: 'I punti diventano waypoint, i LineString tracce, e un MultiLineString una traccia con più segmenti. GPX non ha poligoni, quindi i contorni dei poligoni, fori compresi, vengono scritti come segmenti di traccia. Il nome viene letto dalla proprietà name o title, la descrizione da description e la quota dalla terza coordinata. Funzionano un Feature, una FeatureCollection o una geometria singola.',
        },
        {
          q: 'Il file GPX può contenere orari?',
          a: 'Il GeoJSON semplice non ha un orario per punto. Se il file contiene orari in properties.coordinateProperties.times, il formato scritto dal convertitore da GPX a GeoJSON di questo sito, diventano orari GPX, e frequenza cardiaca, cadenza, temperatura e potenza nello stesso posto diventano elementi Garmin TrackPointExtension che Strava, Garmin Connect e Komoot leggono. Un ciclo GPX → GeoJSON → GPX conserva quindi waypoint, percorsi, segmenti, quota, orari e dati dei sensori.',
        },
        {
          q: 'Perché dice che il mio file non usa WGS 84?',
          a: 'GPX supporta solo longitudine e latitudine WGS 84 in gradi. Un GeoJSON esportato da QGIS o ogr2ogr in un sistema proiettato come EPSG:3857 contiene metri e produrrebbe un GPX inutilizzabile, quindi viene rifiutato. Esporta di nuovo il layer con il SR impostato su EPSG:4326.',
        },
      ],
    },
    'geojson-to-kml': {
      title: 'Convertitore da GeoJSON a KML',
      description: 'Converti GeoJSON da QGIS, geojson.io o Mapbox in KML per Google Earth e Google My Maps, mantenendo gli attributi. Gratuito, istantaneo, e non viene caricato nulla.',
      faq: [
        {
          q: 'Come vengono convertite le geometrie GeoJSON in KML?',
          a: 'Point, LineString e Polygon (fori compresi) mantengono il loro tipo. MultiPoint, MultiLineString, MultiPolygon e GeometryCollection diventano una MultiGeometry KML. Una linea con orari per punto in properties.coordinateProperties.times viene scritta come gx:Track, così Google Earth può animarla.',
        },
        {
          q: 'Le proprietà degli elementi vengono conservate?',
          a: 'Sì. name (o title) e description diventano nome e descrizione del segnaposto, e ogni altra proprietà di tipo testo, numero o vero/falso viene scritta in ExtendedData, che Google Earth mostra nel fumetto del segnaposto. Oggetti annidati, array e valori vuoti vengono saltati. I colori simplestyle come stroke o marker-color restano come dati ma non cambiano l’aspetto del segnaposto.',
        },
        {
          q: 'Perché dice che il mio file non usa WGS 84?',
          a: 'KML supporta solo longitudine e latitudine WGS 84 in gradi. Un GeoJSON esportato da QGIS o ogr2ogr in un sistema proiettato come EPSG:3857 contiene metri e finirebbe nel posto sbagliato, quindi viene rifiutato. Esporta di nuovo il layer con il SR impostato su EPSG:4326.',
        },
      ],
    },
  },
};
