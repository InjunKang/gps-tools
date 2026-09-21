import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: '업로드 없는 GPS 파일 변환기',
    homeDescription: '브라우저 안에서만 동작하는 무료 GPS 파일 도구입니다. GPX, KML, GeoJSON, CSV를 서버에 올리지 않고 변환합니다.',
    homeHeading: '파일을 절대 업로드하지 않는 GPS 파일 도구',
    allTools: '모든 도구',
    privacyBadge: '파일은 브라우저 밖으로 나가지 않습니다',
    dropPrompt: '{from} 파일을 여기에 놓으세요',
    dropHint: '또는',
    chooseFile: '파일 선택',
    converting: '변환 중…',
    done: '{to} 파일이 준비됐습니다',
    stats: '피처 {features}개 · 포인트 {points}개',
    download: '{to} 다운로드',
    convertAnother: '다른 파일 변환',
    tryAgain: '다른 파일로 다시 시도',
    errors: {
      'invalid-file': '이 파일을 읽을 수 없습니다. 올바른 {from} 파일이 아닌 것 같습니다.',
      'wrong-format': '{from} 파일이 아닙니다. .{ext} 파일을 선택해 주세요.',
      empty: '이 {from} 파일에는 변환할 웨이포인트, 루트, 트랙이 없습니다.',
      unsupported: '지원하지 않는 변환입니다.',
      'not-wgs84': '이 {from} 파일은 WGS 84 경도·위도 좌표를 쓰지 않습니다. EPSG:4326으로 다시 내보낸 뒤 시도해 주세요.',
      'too-large': '파일이 200 MB를 넘어 브라우저에서 변환할 수 없습니다.',
      unknown: '변환 중 문제가 생겼습니다. 파일은 업로드되지 않았습니다.',
    },
    howToHeading: '{from} → {to} 변환 방법',
    howToSteps: [
      '위 상자에 {from} 파일을 끌어다 놓거나, 클릭해서 기기에서 선택합니다.',
      '변환은 브라우저 안에서 즉시 실행됩니다. 아무것도 업로드되지 않습니다.',
      '"{to} 다운로드"를 눌러 변환된 파일을 저장합니다.',
    ],
    formatsHeading: '파일 형식 안내',
    faqHeading: '자주 묻는 질문',
    relatedHeading: '관련 도구',
    adLabel: '광고',
    language: '언어',
    footerPrivacy: '모든 변환은 브라우저 안에서 실행됩니다. 파일을 업로드하거나 저장하지 않습니다.',
  },
  formats: {
    gpx: 'GPX(GPS Exchange Format)는 GPS 데이터를 위한 공개 XML 표준입니다. 웨이포인트, 루트, 트랙을 고도·시간과 함께 저장하며, Garmin, Strava, Komoot, Wahoo를 비롯한 대부분의 아웃도어 앱이 가져오기와 내보내기에 사용합니다.',
    kml: 'KML(Keyhole Markup Language)은 Google Earth와 Google 내 지도에서 쓰는 XML 형식입니다. 위치 표시, 경로, 다각형을 표현하고, gx:Track 확장을 통해 시간 정보가 있는 트랙도 담을 수 있습니다.',
    geojson: 'GeoJSON(RFC 7946)은 Leaflet, Mapbox, QGIS, PostGIS 같은 웹 지도와 GIS 소프트웨어가 쓰는 지리 데이터용 JSON 형식입니다. 좌표는 경도, 위도, 고도 순서로 저장됩니다.',
    csv: 'CSV(쉼표로 구분된 값)는 Excel, Google 스프레드시트, LibreOffice, R, pandas가 모두 읽는 일반 텍스트 표 형식입니다. 도형 개념이 없어서 GPS 데이터는 위도·경도 열을 가진 한 점당 한 행으로 기록됩니다.',
  },
  commonFaq: [
    {
      q: '파일이 서버에 업로드되나요?',
      a: '아니요. 변환은 전부 브라우저 안에서 실행되고, 이 페이지는 파일을 어디로도 보낼 수 없게 되어 있습니다. 브라우저 개발자 도구의 네트워크 탭에서 파일을 담은 요청이 하나도 없다는 것을 직접 확인할 수 있습니다.',
    },
    {
      q: '파일 크기 제한이 있나요?',
      a: '200 MB까지 받습니다. 모든 처리가 사용자의 기기에서 이루어지므로, 아주 큰 파일의 한계는 업로드 용량이 아니라 브라우저의 메모리입니다.',
    },
  ],
  tools: {
    'gpx-to-kml': {
      title: 'GPX KML 변환기',
      description: 'GPX 트랙, 루트, 웨이포인트를 Google Earth와 Google 내 지도용 KML로 변환합니다. 무료이고 즉시 변환되며, 파일은 브라우저 밖으로 나가지 않습니다.',
      faq: [
        {
          q: 'GPX를 KML로 변환하면 무엇이 유지되나요?',
          a: '웨이포인트, 루트, 트랙과 각각의 이름, 설명, 고도, 시간이 유지됩니다. 시간이 있는 트랙은 gx:Track으로 기록되어 Google Earth의 타임 슬라이더로 재생할 수 있습니다. 여러 세그먼트로 된 트랙은 세그먼트 구조가 그대로 남습니다.',
        },
        {
          q: '무엇이 사라지나요?',
          a: '심박수, 케이던스, 온도처럼 GPX 확장에 저장된 센서 데이터는 KML에 대응하는 요소가 없어 옮겨지지 않습니다. 점이 하나뿐인 트랙 세그먼트는 선이 될 수 없어 건너뜁니다.',
        },
        {
          q: 'KML 파일을 Google Earth에서 어떻게 여나요?',
          a: '웹 Google Earth에서는 파일 → KML 파일 가져오기를, Google Earth Pro에서는 파일 → 열기를 선택합니다. Google 내 지도에서는 레이어를 추가하고 가져오기를 누릅니다.',
        },
      ],
    },
    'kml-to-gpx': {
      title: 'KML GPX 변환기',
      description: 'Google Earth나 Google 내 지도의 KML을 Garmin, Komoot, Strava 등 GPS 기기와 앱용 GPX로 변환합니다. 무료이고 즉시 변환되며, 아무것도 업로드하지 않습니다.',
      faq: [
        {
          q: 'KML의 요소는 GPX에서 어떻게 되나요?',
          a: '점 위치 표시는 웨이포인트가 됩니다. 경로(LineString)와 gx:Track은 트랙이 되며 고도와, gx:Track의 경우 시간도 유지됩니다. gx:MultiTrack은 여러 세그먼트를 가진 하나의 트랙이 됩니다. 이름과 설명도 유지됩니다. Google Earth에서 지면에 그린 경로는 실제 고도 대신 0이 들어 있어서, 그런 경로에는 고도를 기록하지 않습니다.',
        },
        {
          q: '다각형과 스타일은 어떻게 되나요?',
          a: 'GPX에는 다각형이 없어서 다각형의 윤곽선은 트랙으로 기록됩니다. 색상, 아이콘 등 KML 스타일은 GPX에 대응하는 것이 없어 버려집니다.',
        },
        {
          q: 'KMZ 파일도 변환할 수 있나요?',
          a: '아직 직접은 안 됩니다. KMZ는 ZIP 압축 파일이므로 확장자를 .zip으로 바꿔 압축을 풀고, 안에 있는 doc.kml을 변환하세요.',
        },
      ],
    },
    'gpx-to-geojson': {
      title: 'GPX GeoJSON 변환기',
      description: 'GPX 트랙, 루트, 웨이포인트를 Leaflet, Mapbox, QGIS, PostGIS용 GeoJSON으로 변환합니다. 무료이고 즉시 변환되며, 파일은 브라우저 밖으로 나가지 않습니다.',
      faq: [
        {
          q: 'GPX는 GeoJSON으로 어떻게 대응되나요?',
          a: '웨이포인트는 Point, 루트는 LineString, 트랙은 LineString 또는 세그먼트가 여러 개면 MultiLineString 피처가 됩니다. 좌표는 RFC 7946에 따라 경도, 위도, 고도 순서로 기록됩니다.',
        },
        {
          q: '시간과 심박수는 어디에 들어가나요?',
          a: 'GeoJSON 좌표에는 담을 수 없어서, 점별 값은 피처의 properties.coordinateProperties에 좌표와 같은 순서의 배열로 저장됩니다. 시간은 times에, 심박수·케이던스·온도는 GPX 파일에 있을 때 함께 저장됩니다.',
        },
        {
          q: '어떤 좌표계를 쓰나요?',
          a: 'GPX와 GeoJSON이 모두 정의된 WGS 84(EPSG:4326)입니다. 재투영하지 않으며 좌표를 반올림하지도 않습니다.',
        },
      ],
    },
    'gpx-to-csv': {
      title: 'GPX CSV 변환기',
      description: 'GPX 트랙, 루트, 웨이포인트를 Excel, Google 스프레드시트, Python용 CSV 표로 변환합니다. 한 점당 한 행이며, 파일은 브라우저 밖으로 나가지 않습니다.',
      faq: [
        {
          q: 'CSV에는 어떤 열이 있나요?',
          a: '한 점당 한 행이며 type(waypoint, route, track), name, description, segment, latitude, longitude, elevation, time 열이 있습니다. GPX에 센서 데이터가 있으면 heart_rate, cadence, temperature, power 열이 추가됩니다. description은 웨이포인트 행에만 기록됩니다.',
        },
        {
          q: '세그먼트가 여러 개인 트랙은 어떻게 처리되나요?',
          a: '점은 기록된 순서를 유지하고, segment 열에 트랙별로 1부터 시작하는 세그먼트 번호가 들어갑니다. 기록이 멈추거나 끊긴 구간을 그대로 볼 수 있습니다.',
        },
        {
          q: 'Excel에서 제대로 열리나요?',
          a: '네. BOM이 있는 UTF-8로 저장하므로 Excel에서도 한글이나 악센트가 있는 이름이 깨지지 않습니다. 시간은 UTC 기준 ISO 8601 형식입니다. =, +, -, @로 시작하는 텍스트에는 앞에 작은따옴표를 붙여 스프레드시트가 수식으로 실행하지 못하게 합니다.',
        },
      ],
    },
    'kml-to-geojson': {
      title: 'KML GeoJSON 변환기',
      description: 'Google Earth나 Google 내 지도의 KML을 Leaflet, Mapbox, QGIS, PostGIS용 GeoJSON으로 변환합니다. 무료이고 즉시 변환되며, 아무것도 업로드하지 않습니다.',
      faq: [
        {
          q: 'KML 도형은 GeoJSON에서 어떻게 대응되나요?',
          a: 'Point, LineString, Polygon(구멍 포함)은 유형이 그대로 유지됩니다. gx:Track은 LineString, gx:MultiTrack은 MultiLineString이 되고 시간은 properties.coordinateProperties.times에 들어갑니다. 유형이 섞인 MultiGeometry는 GeometryCollection이 됩니다.',
        },
        {
          q: '이름, 설명, 스타일은 어떻게 되나요?',
          a: '이름, 설명, 시간, ExtendedData 필드는 피처의 properties가 됩니다. 선과 채우기 스타일은 stroke, stroke-width, fill, fill-opacity 같은 simplestyle 속성으로 기록되어 geojson.io, Mapbox, GitHub에서 인식됩니다.',
        },
        {
          q: '변환되지 않는 것은 무엇인가요?',
          a: '이 페이지는 아무것도 내려받을 수 없으므로 네트워크 링크는 따라가지 않고, 영역 윤곽과 URL만 남깁니다. 지면 오버레이는 이미지 URL을 icon 속성에 담은 범위 다각형이 되며 이미지 자체는 포함되지 않습니다. 3D 모델과 투어는 건너뜁니다. KMZ는 먼저 압축을 풀어야 합니다. 확장자를 .zip으로 바꿔 풀고 안의 doc.kml을 변환하세요.',
        },
      ],
    },
    'geojson-to-gpx': {
      title: 'GeoJSON GPX 변환기',
      description: 'QGIS, geojson.io, Mapbox의 GeoJSON을 Garmin, Komoot, Strava 등 GPS 기기와 앱용 GPX로 변환합니다. 무료이고 즉시 변환되며, 아무것도 업로드하지 않습니다.',
      faq: [
        {
          q: 'GeoJSON 피처는 GPX에서 어떻게 되나요?',
          a: 'Point는 웨이포인트, LineString은 트랙이 되고, MultiLineString은 여러 세그먼트를 가진 하나의 트랙이 됩니다. GPX에는 다각형이 없어서 다각형 윤곽선은 구멍까지 포함해 트랙 세그먼트로 기록됩니다. 이름은 name 또는 title 속성에서, 설명은 description에서, 고도는 세 번째 좌표에서 읽습니다. Feature, FeatureCollection, 단독 도형 모두 사용할 수 있습니다.',
        },
        {
          q: 'GPX 파일에 시간을 담을 수 있나요?',
          a: '일반 GeoJSON에는 점별 시간이 없습니다. 파일에 properties.coordinateProperties.times 형태의 시간이 있으면(이 사이트의 GPX→GeoJSON 변환기가 쓰는 방식) GPX 시간이 되고, 같은 곳에 있는 심박수, 케이던스, 온도, 파워는 Strava, Garmin Connect, Komoot가 읽는 Garmin TrackPointExtension 요소가 됩니다. 따라서 GPX → GeoJSON → GPX로 왕복해도 웨이포인트, 루트, 세그먼트, 고도, 시간, 센서 데이터가 유지됩니다.',
        },
        {
          q: '왜 "WGS 84를 쓰지 않는다"고 나오나요?',
          a: 'GPX는 도 단위의 WGS 84 경도·위도만 지원합니다. QGIS나 ogr2ogr에서 EPSG:3857 같은 투영 좌표계로 내보낸 GeoJSON은 미터 값이 들어 있어 쓸 수 없는 GPX가 되므로 거부합니다. 좌표계를 EPSG:4326으로 설정해 레이어를 다시 내보내세요.',
        },
      ],
    },
    'geojson-to-kml': {
      title: 'GeoJSON KML 변환기',
      description: 'QGIS, geojson.io, Mapbox의 GeoJSON을 속성을 유지한 채 Google Earth와 Google 내 지도용 KML로 변환합니다. 무료이고 즉시 변환되며, 아무것도 업로드하지 않습니다.',
      faq: [
        {
          q: 'GeoJSON 도형은 KML에서 어떻게 대응되나요?',
          a: 'Point, LineString, Polygon(구멍 포함)은 유형이 유지됩니다. MultiPoint, MultiLineString, MultiPolygon, GeometryCollection은 KML MultiGeometry가 됩니다. properties.coordinateProperties.times에 점별 시간이 있는 선은 gx:Track으로 기록되어 Google Earth에서 애니메이션으로 재생할 수 있습니다.',
        },
        {
          q: '피처 속성은 유지되나요?',
          a: '네. name(또는 title)과 description은 위치 표시의 이름과 설명이 되고, 그 밖의 텍스트·숫자·참/거짓 속성은 모두 ExtendedData에 기록되어 Google Earth의 말풍선에 표시됩니다. 중첩 객체, 배열, 빈 값은 건너뜁니다. stroke, marker-color 같은 simplestyle 색상은 데이터로는 남지만 위치 표시의 모양을 바꾸지는 않습니다.',
        },
        {
          q: '왜 "WGS 84를 쓰지 않는다"고 나오나요?',
          a: 'KML은 도 단위의 WGS 84 경도·위도만 지원합니다. QGIS나 ogr2ogr에서 EPSG:3857 같은 투영 좌표계로 내보낸 GeoJSON은 미터 값이 들어 있어 엉뚱한 위치에 표시되므로 거부합니다. 좌표계를 EPSG:4326으로 설정해 레이어를 다시 내보내세요.',
        },
      ],
    },
  },
};
