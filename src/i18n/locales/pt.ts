import type { LocalePack } from '../types';

// Brazilian Portuguese.
export const pack: LocalePack = {
  ui: {
    homeTitle: 'Conversores de arquivos GPS privados',
    homeDescription: 'Ferramentas gratuitas para arquivos GPS que funcionam inteiramente no seu navegador. Converta GPX, KML, GeoJSON e CSV sem enviar nada.',
    homeHeading: 'Ferramentas GPS que nunca enviam seus arquivos',
    allTools: 'Todas as ferramentas',
    privacyBadge: 'Seu arquivo nunca sai do navegador',
    dropPrompt: 'Solte seu arquivo {from} aqui',
    dropHint: 'ou',
    chooseFile: 'Escolher um arquivo',
    converting: 'Convertendo…',
    done: 'Seu arquivo {to} está pronto',
    stats: 'Elementos: {features} · Pontos: {points}',
    download: 'Baixar {to}',
    share: 'Compartilhar…',
    renameHint: 'Se o arquivo foi salvo como “unknown”, renomeie-o para {name}.',
    convertAnother: 'Converter outro arquivo',
    tryAgain: 'Tentar outro arquivo',
    errors: {
      'invalid-file': 'Não foi possível ler este arquivo. Ele não parece um {from} válido.',
      'wrong-format': 'Este não é um arquivo {from}. Escolha um arquivo .{ext}.',
      empty: 'Este arquivo {from} não contém waypoints, rotas ou trilhas para converter.',
      unsupported: 'Esta conversão não é suportada.',
      'not-wgs84': 'Este arquivo {from} não usa coordenadas WGS 84 (longitude/latitude). Exporte-o novamente em EPSG:4326 e tente de novo.',
      'too-large': 'Este arquivo passa de 200 MB e não pode ser convertido no navegador.',
      unknown: 'Algo deu errado na conversão. Nada foi enviado.',
    },
    howToHeading: 'Como converter {from} em {to}',
    howToSteps: [
      'Solte seu arquivo {from} na área acima ou clique para escolhê-lo no seu dispositivo.',
      'A conversão acontece na hora, dentro do seu navegador. Nada é enviado.',
      'Clique em “Baixar {to}” para salvar o arquivo convertido.',
    ],
    formatsHeading: 'Sobre os formatos',
    faqHeading: 'Perguntas frequentes',
    relatedHeading: 'Ferramentas relacionadas',
    adLabel: 'Publicidade',
    language: 'Idioma',
    footerPrivacy: 'Todas as conversões acontecem localmente no seu navegador. Nenhum arquivo é enviado ou armazenado.',
  },
  formats: {
    gpx: 'GPX (GPS Exchange Format) é o padrão XML aberto para dados de GPS. Ele guarda waypoints, rotas e trilhas com altitude e horários, e é o formato que Garmin, Strava, Komoot, Wahoo e a maioria dos apps outdoor importam e exportam.',
    kml: 'KML (Keyhole Markup Language) é o formato XML do Google Earth e do Google My Maps. Ele descreve marcadores, caminhos e polígonos e pode carregar trilhas com horários por meio da extensão gx:Track.',
    geojson: 'GeoJSON (RFC 7946) é o formato JSON para dados geográficos usado por mapas web e softwares SIG como Leaflet, Mapbox, QGIS e PostGIS. As coordenadas são guardadas como longitude, latitude, altitude.',
    csv: 'CSV (valores separados por vírgula) é o formato de tabela em texto simples que Excel, Google Planilhas, LibreOffice, R e pandas leem. Ele não tem noção de geometria, então os dados de GPS são escritos com uma linha por ponto e colunas de latitude e longitude.',
  },
  commonFaq: [
    {
      q: 'Meus arquivos são enviados para um servidor?',
      a: 'Não. A conversão acontece inteiramente no seu navegador, e a página não tem permissão para enviar seu arquivo a lugar nenhum. Você pode conferir na aba Rede das ferramentas de desenvolvedor do navegador: nenhuma requisição carrega o seu arquivo.',
    },
    {
      q: 'Existe limite de tamanho de arquivo?',
      a: 'Arquivos de até 200 MB são aceitos. Como tudo acontece no seu dispositivo, para arquivos muito grandes o limite é a memória do navegador, não uma cota de envio.',
    },
  ],
  tools: {
    'gpx-to-kml': {
      title: 'Conversor de GPX para KML',
      description: 'Converta trilhas, rotas e waypoints GPX em KML para o Google Earth e o Google My Maps. Grátis, instantâneo, e seu arquivo nunca sai do navegador.',
      faq: [
        {
          q: 'O que é mantido ao converter GPX em KML?',
          a: 'Waypoints, rotas e trilhas com seus nomes, descrições, altitude e horários. Trilhas com horários são escritas como gx:Track, para que o Google Earth possa reproduzi-las na linha do tempo. Trilhas com vários segmentos continuam com vários segmentos.',
        },
        {
          q: 'O que se perde?',
          a: 'Dados de sensores guardados nas extensões GPX, como frequência cardíaca, cadência e temperatura, não têm equivalente em KML e não são transferidos. Um segmento de trilha com um único ponto é ignorado porque não pode formar uma linha.',
        },
        {
          q: 'Como abro o arquivo KML no Google Earth?',
          a: 'No Google Earth na web, escolha Arquivo → Importar arquivo KML; no Google Earth Pro, use Arquivo → Abrir. No Google My Maps, adicione uma camada e clique em Importar.',
        },
      ],
    },
    'kml-to-gpx': {
      title: 'Conversor de KML para GPX',
      description: 'Converta KML do Google Earth ou do Google My Maps em GPX para Garmin, Komoot, Strava e outros dispositivos e apps de GPS. Grátis, instantâneo e privado: nada é enviado.',
      faq: [
        {
          q: 'Como os elementos KML viram GPX?',
          a: 'Marcadores de ponto viram waypoints. Caminhos (LineString) e gx:Track viram trilhas, mantendo a altitude e, no gx:Track, os horários. Um gx:MultiTrack vira uma trilha com vários segmentos. Nomes e descrições são mantidos. Caminhos desenhados sobre o terreno no Google Earth têm altitude 0 em vez de uma altitude real, então nenhuma altitude é escrita para eles.',
        },
        {
          q: 'O que acontece com polígonos e estilos?',
          a: 'GPX não tem polígonos, então o contorno de cada polígono é escrito como trilha. Cores, ícones e outros estilos KML não têm equivalente em GPX e são descartados.',
        },
        {
          q: 'Posso converter um arquivo KMZ?',
          a: 'Ainda não diretamente. Um KMZ é um arquivo ZIP: renomeie para .zip, extraia e converta o doc.kml que está dentro.',
        },
      ],
    },
    'gpx-to-geojson': {
      title: 'Conversor de GPX para GeoJSON',
      description: 'Converta trilhas, rotas e waypoints GPX em GeoJSON para Leaflet, Mapbox, QGIS e PostGIS. Grátis, instantâneo, e seu arquivo nunca sai do navegador.',
      faq: [
        {
          q: 'Como o GPX é representado em GeoJSON?',
          a: 'Waypoints viram feições Point, rotas viram LineString e trilhas viram LineString ou, com vários segmentos, MultiLineString. As coordenadas são escritas como longitude, latitude, altitude, como exige a RFC 7946.',
        },
        {
          q: 'Onde ficam os horários e a frequência cardíaca?',
          a: 'As coordenadas GeoJSON não podem guardá-los, então os valores por ponto ficam em properties.coordinateProperties da feição, em arrays paralelos às coordenadas: times para os horários, e frequência cardíaca, cadência ou temperatura quando o arquivo GPX os contém.',
        },
        {
          q: 'Qual sistema de coordenadas é usado?',
          a: 'WGS 84 (EPSG:4326), o sistema em que GPX e GeoJSON são definidos. Nenhuma reprojeção é feita e as coordenadas não são arredondadas.',
        },
      ],
    },
    'gpx-to-csv': {
      title: 'Conversor de GPX para CSV',
      description: 'Converta trilhas, rotas e waypoints GPX em uma planilha CSV para Excel, Google Planilhas ou Python. Uma linha por ponto, e seu arquivo nunca sai do navegador.',
      faq: [
        {
          q: 'Quais colunas o CSV contém?',
          a: 'Uma linha por ponto com type (waypoint, route ou track), name, description, segment, latitude, longitude, elevation e time. Se o arquivo GPX tiver dados de sensores, as colunas heart_rate, cadence, temperature e power são adicionadas. As descrições aparecem só nas linhas de waypoints.',
        },
        {
          q: 'Como são tratadas trilhas com vários segmentos?',
          a: 'Os pontos ficam na ordem em que foram gravados, e a coluna segment numera os segmentos de cada trilha a partir de 1, então pausas e interrupções da gravação continuam visíveis.',
        },
        {
          q: 'Abre corretamente no Excel?',
          a: 'Sim. O arquivo é UTF-8 com marca de ordem de bytes, então o Excel mostra corretamente acentos e nomes em japonês. Os horários estão em ISO 8601, em UTC. Texto que começa com =, +, - ou @ recebe um apóstrofo na frente, para que a planilha não o execute como fórmula.',
        },
      ],
    },
    'kml-to-geojson': {
      title: 'Conversor de KML para GeoJSON',
      description: 'Converta KML do Google Earth ou do Google My Maps em GeoJSON para Leaflet, Mapbox, QGIS e PostGIS. Grátis, instantâneo e privado: nada é enviado.',
      faq: [
        {
          q: 'Como as geometrias KML viram GeoJSON?',
          a: 'Point, LineString e Polygon (inclusive com buracos) mantêm o tipo. Um gx:Track vira LineString e um gx:MultiTrack vira MultiLineString, com os horários em properties.coordinateProperties.times. Uma MultiGeometry de tipos mistos vira GeometryCollection.',
        },
        {
          q: 'O que acontece com nomes, descrições e estilos?',
          a: 'Nome, descrição, horários e campos ExtendedData viram propriedades da feição. Estilos de linha e preenchimento são escritos como propriedades simplestyle (stroke, stroke-width, fill, fill-opacity), que geojson.io, Mapbox e GitHub entendem.',
        },
        {
          q: 'O que não é convertido?',
          a: 'Links de rede não são seguidos, porque esta página não pode baixar nada; só o contorno da região e a URL são mantidos. Uma sobreposição de solo vira um polígono da sua área com a URL da imagem na propriedade icon, mas a imagem em si não é incluída. Modelos 3D e tours são ignorados. Arquivos KMZ precisam ser descompactados antes: renomeie para .zip, extraia e converta o doc.kml de dentro.',
        },
      ],
    },
    'geojson-to-gpx': {
      title: 'Conversor de GeoJSON para GPX',
      description: 'Converta GeoJSON do QGIS, geojson.io ou Mapbox em GPX para Garmin, Komoot, Strava e outros dispositivos e apps de GPS. Grátis, instantâneo e privado: nada é enviado.',
      faq: [
        {
          q: 'Como as feições GeoJSON viram GPX?',
          a: 'Pontos viram waypoints, LineString viram trilhas e um MultiLineString vira uma trilha com vários segmentos. GPX não tem polígonos, então os contornos, inclusive os buracos, são escritos como segmentos de trilha. O nome é lido da propriedade name ou title, a descrição de description e a altitude da terceira coordenada. Funciona com um Feature, uma FeatureCollection ou uma geometria solta.',
        },
        {
          q: 'O arquivo GPX pode ter horários?',
          a: 'GeoJSON comum não tem horário por ponto. Se o arquivo tiver horários em properties.coordinateProperties.times, o formato que o conversor de GPX para GeoJSON deste site escreve, eles viram horários GPX, e frequência cardíaca, cadência, temperatura e potência no mesmo lugar viram elementos Garmin TrackPointExtension, que Strava, Garmin Connect e Komoot leem. Um ciclo GPX → GeoJSON → GPX mantém, portanto, waypoints, rotas, segmentos, altitude, horário e dados de sensores.',
        },
        {
          q: 'Por que diz que meu arquivo não usa WGS 84?',
          a: 'GPX só aceita longitude e latitude WGS 84 em graus. Um GeoJSON exportado do QGIS ou do ogr2ogr em um sistema projetado como EPSG:3857 contém metros e geraria um GPX inutilizável, por isso é rejeitado. Exporte a camada de novo com o SRC definido como EPSG:4326.',
        },
      ],
    },
    'geojson-to-kml': {
      title: 'Conversor de GeoJSON para KML',
      description: 'Converta GeoJSON do QGIS, geojson.io ou Mapbox em KML para o Google Earth e o Google My Maps, mantendo os atributos. Grátis, instantâneo, e nada é enviado.',
      faq: [
        {
          q: 'Como as geometrias GeoJSON viram KML?',
          a: 'Point, LineString e Polygon (inclusive com buracos) mantêm o tipo. MultiPoint, MultiLineString, MultiPolygon e GeometryCollection viram uma MultiGeometry do KML. Uma linha com horário por ponto em properties.coordinateProperties.times é escrita como gx:Track, para que o Google Earth possa animá-la.',
        },
        {
          q: 'As propriedades das feições são mantidas?',
          a: 'Sim. name (ou title) e description viram o nome e a descrição do marcador, e qualquer outra propriedade de texto, número ou verdadeiro/falso é escrita em ExtendedData, que o Google Earth mostra no balão do marcador. Objetos aninhados, arrays e valores vazios são ignorados. Cores simplestyle como stroke ou marker-color são mantidas como dados, mas não mudam a aparência do marcador.',
        },
        {
          q: 'Por que diz que meu arquivo não usa WGS 84?',
          a: 'KML só aceita longitude e latitude WGS 84 em graus. Um GeoJSON exportado do QGIS ou do ogr2ogr em um sistema projetado como EPSG:3857 contém metros e apareceria no lugar errado, por isso é rejeitado. Exporte a camada de novo com o SRC definido como EPSG:4326.',
        },
      ],
    },
  },
};
