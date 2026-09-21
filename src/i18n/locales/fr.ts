import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: 'Convertisseurs de fichiers GPS privés',
    homeDescription: 'Outils gratuits pour fichiers GPS qui fonctionnent entièrement dans votre navigateur. Convertissez GPX, KML, GeoJSON et CSV sans rien envoyer.',
    homeHeading: 'Des outils GPS qui n’envoient jamais vos fichiers',
    allTools: 'Tous les outils',
    privacyBadge: 'Votre fichier ne quitte jamais votre navigateur',
    dropPrompt: 'Déposez votre fichier {from} ici',
    dropHint: 'ou',
    chooseFile: 'Choisir un fichier',
    converting: 'Conversion en cours…',
    done: 'Votre fichier {to} est prêt',
    stats: 'Objets : {features} · Points : {points}',
    download: 'Télécharger le {to}',
    share: 'Partager…',
    renameHint: 'Si le fichier a été enregistré sous le nom « unknown », renommez-le en {name}.',
    convertAnother: 'Convertir un autre fichier',
    tryAgain: 'Essayer un autre fichier',
    errors: {
      'invalid-file': 'Ce fichier n’a pas pu être lu. Il ne ressemble pas à un {from} valide.',
      'wrong-format': 'Ce n’est pas un fichier {from}. Veuillez choisir un fichier .{ext}.',
      empty: 'Ce fichier {from} ne contient aucun waypoint, itinéraire ou trace à convertir.',
      unsupported: 'Cette conversion n’est pas prise en charge.',
      'not-wgs84': 'Ce fichier {from} n’utilise pas des coordonnées WGS 84 (longitude/latitude). Exportez-le à nouveau en EPSG:4326 et réessayez.',
      'too-large': 'Ce fichier dépasse 200 Mo et ne peut pas être converti dans le navigateur.',
      unknown: 'Une erreur s’est produite pendant la conversion. Rien n’a été envoyé.',
    },
    howToHeading: 'Comment convertir un {from} en {to}',
    howToSteps: [
      'Déposez votre fichier {from} dans la zone ci-dessus, ou cliquez pour le choisir sur votre appareil.',
      'La conversion s’exécute instantanément dans votre navigateur. Rien n’est envoyé.',
      'Cliquez sur « Télécharger le {to} » pour enregistrer le fichier converti.',
    ],
    formatsHeading: 'À propos des formats',
    faqHeading: 'Questions fréquentes',
    relatedHeading: 'Outils associés',
    adLabel: 'Publicité',
    language: 'Langue',
    footerPrivacy: 'Toutes les conversions s’exécutent localement dans votre navigateur. Aucun fichier n’est envoyé ni conservé.',
  },
  formats: {
    gpx: 'GPX (GPS Exchange Format) est le standard XML ouvert pour les données GPS. Il stocke des waypoints, des itinéraires et des traces avec altitude et horodatage, et c’est le format qu’importent et exportent Garmin, Strava, Komoot, Wahoo et la plupart des applications de plein air.',
    kml: 'KML (Keyhole Markup Language) est le format XML de Google Earth et Google My Maps. Il décrit des repères, des tracés et des polygones, et peut contenir des traces horodatées grâce à l’extension gx:Track.',
    geojson: 'GeoJSON (RFC 7946) est le format JSON des données géographiques utilisé par les cartes web et les logiciels SIG comme Leaflet, Mapbox, QGIS et PostGIS. Les coordonnées sont stockées dans l’ordre longitude, latitude, altitude.',
    csv: 'CSV (valeurs séparées par des virgules) est le format de tableau en texte brut que lisent Excel, Google Sheets, LibreOffice, R et pandas. Il n’a pas de notion de géométrie : les données GPS sont écrites à raison d’une ligne par point, avec des colonnes latitude et longitude.',
  },
  commonFaq: [
    {
      q: 'Mes fichiers sont-ils envoyés sur un serveur ?',
      a: 'Non. La conversion s’exécute entièrement dans votre navigateur, et la page n’est pas autorisée à envoyer votre fichier où que ce soit. Vous pouvez le vérifier dans l’onglet Réseau des outils de développement de votre navigateur : aucune requête ne contient votre fichier.',
    },
    {
      q: 'Y a-t-il une limite de taille ?',
      a: 'Les fichiers jusqu’à 200 Mo sont acceptés. Comme tout se passe sur votre appareil, la limite pour les très gros fichiers est la mémoire de votre navigateur, pas un quota d’envoi.',
    },
  ],
  tools: {
    'gpx-to-kml': {
      title: 'Convertisseur GPX vers KML',
      description: 'Convertissez des traces, itinéraires et waypoints GPX en KML pour Google Earth et Google My Maps. Gratuit, instantané, et votre fichier ne quitte jamais votre navigateur.',
      faq: [
        {
          q: 'Que conserve la conversion de GPX en KML ?',
          a: 'Les waypoints, itinéraires et traces avec leurs noms, descriptions, altitudes et horodatages. Les traces horodatées sont écrites en gx:Track, ce qui permet à Google Earth de les rejouer avec son curseur temporel. Les traces à plusieurs segments gardent leurs segments.',
        },
        {
          q: 'Qu’est-ce qui est perdu ?',
          a: 'Les données de capteurs stockées dans les extensions GPX, comme la fréquence cardiaque, la cadence et la température, n’ont pas d’équivalent en KML et ne sont pas reprises. Un segment de trace ne contenant qu’un seul point est ignoré, car il ne peut pas former une ligne.',
        },
        {
          q: 'Comment ouvrir le fichier KML dans Google Earth ?',
          a: 'Dans Google Earth sur le web, choisissez Fichier → Importer un fichier KML ; dans Google Earth Pro, Fichier → Ouvrir. Dans Google My Maps, ajoutez un calque et cliquez sur Importer.',
        },
      ],
    },
    'kml-to-gpx': {
      title: 'Convertisseur KML vers GPX',
      description: 'Convertissez du KML de Google Earth ou Google My Maps en GPX pour Garmin, Komoot, Strava et d’autres appareils et applications GPS. Gratuit, instantané et privé : rien n’est envoyé.',
      faq: [
        {
          q: 'Comment les éléments KML sont-ils convertis en GPX ?',
          a: 'Les repères ponctuels deviennent des waypoints. Les tracés (LineString) et les gx:Track deviennent des traces, en conservant l’altitude et, pour gx:Track, les horodatages. Un gx:MultiTrack devient une trace à plusieurs segments. Les noms et descriptions sont conservés. Les tracés dessinés au sol dans Google Earth ont une altitude de 0 au lieu d’une altitude réelle ; aucune altitude n’est donc écrite pour eux.',
        },
        {
          q: 'Que deviennent les polygones et les styles ?',
          a: 'GPX n’a pas de polygones : le contour de chaque polygone est écrit comme une trace. Les couleurs, icônes et autres styles KML n’ont pas d’équivalent en GPX et sont abandonnés.',
        },
        {
          q: 'Puis-je convertir un fichier KMZ ?',
          a: 'Pas encore directement. Un KMZ est une archive ZIP : renommez-le en .zip, décompressez-le et convertissez le fichier doc.kml qu’il contient.',
        },
      ],
    },
    'gpx-to-geojson': {
      title: 'Convertisseur GPX vers GeoJSON',
      description: 'Convertissez des traces, itinéraires et waypoints GPX en GeoJSON pour Leaflet, Mapbox, QGIS et PostGIS. Gratuit, instantané, et votre fichier ne quitte jamais votre navigateur.',
      faq: [
        {
          q: 'Comment le GPX est-il représenté en GeoJSON ?',
          a: 'Les waypoints deviennent des objets Point, les itinéraires des LineString, et les traces des LineString ou, avec plusieurs segments, des MultiLineString. Les coordonnées sont écrites dans l’ordre longitude, latitude, altitude, comme l’exige la RFC 7946.',
        },
        {
          q: 'Où vont les horodatages et la fréquence cardiaque ?',
          a: 'Les coordonnées GeoJSON ne peuvent pas les contenir : les valeurs par point sont stockées dans properties.coordinateProperties de l’objet, dans des tableaux parallèles aux coordonnées. times pour les horodatages, et la fréquence cardiaque, la cadence ou la température lorsque le fichier GPX les contient.',
        },
        {
          q: 'Quel système de coordonnées est utilisé ?',
          a: 'WGS 84 (EPSG:4326), le système dans lequel GPX et GeoJSON sont définis. Aucune reprojection n’a lieu et les coordonnées ne sont pas arrondies.',
        },
      ],
    },
    'gpx-to-csv': {
      title: 'Convertisseur GPX vers CSV',
      description: 'Convertissez des traces, itinéraires et waypoints GPX en tableau CSV pour Excel, Google Sheets ou Python. Une ligne par point, et votre fichier ne quitte jamais votre navigateur.',
      faq: [
        {
          q: 'Quelles colonnes contient le CSV ?',
          a: 'Une ligne par point avec type (waypoint, route ou track), name, description, segment, latitude, longitude, elevation et time. Si le fichier GPX contient des données de capteurs, les colonnes heart_rate, cadence, temperature et power sont ajoutées. Les descriptions ne figurent que sur les lignes de waypoints.',
        },
        {
          q: 'Comment sont traitées les traces à plusieurs segments ?',
          a: 'Les points restent dans l’ordre d’enregistrement, et la colonne segment numérote les segments de chaque trace à partir de 1 ; les pauses et coupures de l’enregistrement restent visibles.',
        },
        {
          q: 'Le fichier s’ouvre-t-il correctement dans Excel ?',
          a: 'Oui. Le fichier est en UTF-8 avec marque d’ordre des octets, donc Excel affiche correctement les accents et les noms japonais. Les heures sont en ISO 8601, en UTC. Un texte commençant par =, +, - ou @ reçoit une apostrophe devant, pour qu’un tableur ne l’exécute pas comme une formule.',
        },
      ],
    },
    'kml-to-geojson': {
      title: 'Convertisseur KML vers GeoJSON',
      description: 'Convertissez du KML de Google Earth ou Google My Maps en GeoJSON pour Leaflet, Mapbox, QGIS et PostGIS. Gratuit, instantané et privé : rien n’est envoyé.',
      faq: [
        {
          q: 'Comment les géométries KML sont-elles converties en GeoJSON ?',
          a: 'Les Point, LineString et Polygon (trous compris) gardent leur type. Un gx:Track devient un LineString et un gx:MultiTrack un MultiLineString, avec les horodatages dans properties.coordinateProperties.times. Une MultiGeometry de types mixtes devient une GeometryCollection.',
        },
        {
          q: 'Que deviennent les noms, descriptions et styles ?',
          a: 'Le nom, la description, les horodatages et les champs ExtendedData deviennent des propriétés de l’objet. Les styles de ligne et de remplissage sont écrits comme propriétés simplestyle (stroke, stroke-width, fill, fill-opacity), comprises par geojson.io, Mapbox et GitHub.',
        },
        {
          q: 'Qu’est-ce qui n’est pas converti ?',
          a: 'Les liens réseau ne sont pas suivis, car cette page ne peut rien télécharger ; seuls leur contour de région et leur URL sont conservés. Une superposition au sol devient un polygone de son emprise avec l’URL de l’image dans la propriété icon, mais l’image elle-même n’est pas incluse. Les modèles 3D et les visites sont ignorés. Les fichiers KMZ doivent d’abord être décompressés : renommez en .zip, extrayez et convertissez le doc.kml qu’il contient.',
        },
      ],
    },
    'geojson-to-gpx': {
      title: 'Convertisseur GeoJSON vers GPX',
      description: 'Convertissez du GeoJSON de QGIS, geojson.io ou Mapbox en GPX pour Garmin, Komoot, Strava et d’autres appareils et applications GPS. Gratuit, instantané et privé : rien n’est envoyé.',
      faq: [
        {
          q: 'Comment les objets GeoJSON sont-ils convertis en GPX ?',
          a: 'Les points deviennent des waypoints, les LineString des traces, et un MultiLineString une trace à plusieurs segments. GPX n’a pas de polygones : leurs contours, trous compris, sont écrits comme segments de trace. Le nom est lu dans la propriété name ou title, la description dans description, et l’altitude dans la troisième coordonnée. Un Feature, une FeatureCollection ou une géométrie seule fonctionnent tous.',
        },
        {
          q: 'Le fichier GPX peut-il contenir des horodatages ?',
          a: 'Le GeoJSON ordinaire n’a pas d’heure par point. Si le fichier contient des heures dans properties.coordinateProperties.times, le format qu’écrit le convertisseur GPX vers GeoJSON de ce site, elles deviennent des horodatages GPX, et la fréquence cardiaque, la cadence, la température et la puissance au même endroit deviennent des éléments Garmin TrackPointExtension que lisent Strava, Garmin Connect et Komoot. Un aller-retour GPX → GeoJSON → GPX conserve donc waypoints, itinéraires, segments, altitude, heure et données de capteurs.',
        },
        {
          q: 'Pourquoi le message dit-il que mon fichier n’utilise pas WGS 84 ?',
          a: 'GPX n’accepte que des longitudes et latitudes WGS 84 en degrés. Un GeoJSON exporté depuis QGIS ou ogr2ogr dans un système projeté comme EPSG:3857 contient des mètres et donnerait un GPX inutilisable ; il est donc refusé. Exportez à nouveau la couche avec le SCR EPSG:4326.',
        },
      ],
    },
    'geojson-to-kml': {
      title: 'Convertisseur GeoJSON vers KML',
      description: 'Convertissez du GeoJSON de QGIS, geojson.io ou Mapbox en KML pour Google Earth et Google My Maps, en conservant les attributs. Gratuit, instantané, et rien n’est envoyé.',
      faq: [
        {
          q: 'Comment les géométries GeoJSON sont-elles converties en KML ?',
          a: 'Les Point, LineString et Polygon (trous compris) gardent leur type. MultiPoint, MultiLineString, MultiPolygon et GeometryCollection deviennent une MultiGeometry KML. Une ligne avec des heures par point dans properties.coordinateProperties.times est écrite en gx:Track, pour que Google Earth puisse l’animer.',
        },
        {
          q: 'Les propriétés des objets sont-elles conservées ?',
          a: 'Oui. name (ou title) et description deviennent le nom et la description du repère, et toute autre propriété texte, nombre ou vrai/faux est écrite dans ExtendedData, que Google Earth affiche dans l’infobulle du repère. Les objets imbriqués, les tableaux et les valeurs vides sont ignorés. Les couleurs simplestyle comme stroke ou marker-color sont conservées comme données mais ne changent pas l’apparence du repère.',
        },
        {
          q: 'Pourquoi le message dit-il que mon fichier n’utilise pas WGS 84 ?',
          a: 'KML n’accepte que des longitudes et latitudes WGS 84 en degrés. Un GeoJSON exporté depuis QGIS ou ogr2ogr dans un système projeté comme EPSG:3857 contient des mètres et s’afficherait au mauvais endroit ; il est donc refusé. Exportez à nouveau la couche avec le SCR EPSG:4326.',
        },
      ],
    },
  },
};
