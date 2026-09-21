import type { LocalePack } from '../types';

export const pack: LocalePack = {
  ui: {
    homeTitle: "プライバシー重視のGPSファイル変換ツール",
    homeDescription: "すべてブラウザ内で動作する無料のGPSファイルツール。GPX、KML、GeoJSON、CSVをアップロードなしで変換できます。",
    homeHeading: "ファイルをアップロードしないGPSファイルツール",
    allTools: "すべてのツール",
    privacyBadge: "ファイルがブラウザの外に出ることはありません",
    dropPrompt: "{from}ファイルをここにドロップ",
    dropHint: "または",
    chooseFile: "ファイルを選択",
    converting: "変換中…",
    done: "{to}ファイルの準備ができました",
    stats: "フィーチャー: {features} · ポイント: {points}",
    download: "{to}をダウンロード",
    convertAnother: "別のファイルを変換",
    tryAgain: "別のファイルを試す",
    errors: {
      'invalid-file': "このファイルを読み込めませんでした。有効な{from}ではないようです。",
      'wrong-format': "これは{from}ファイルではありません。.{ext}ファイルを選択してください。",
      empty: "この{from}ファイルには、変換できるウェイポイント、ルート、トラックがありません。",
      unsupported: "この変換には対応していません。",
      'not-wgs84': "この{from}ファイルはWGS 84の経度・緯度座標ではありません。EPSG:4326で書き出し直してからお試しください。",
      'too-large': "このファイルは200 MBを超えているため、ブラウザでは変換できません。",
      unknown: "変換中に問題が発生しました。ファイルはアップロードされていません。"
    },
    howToHeading: "{from}を{to}に変換する方法",
    howToSteps: [
      "上のボックスに{from}ファイルをドロップするか、クリックして端末から選択します。",
      "変換はブラウザ内ですぐに実行されます。ファイルはアップロードされません。",
      "「{to}をダウンロード」をクリックして、変換したファイルを保存します。"
    ],
    formatsHeading: "ファイル形式について",
    faqHeading: "よくある質問",
    relatedHeading: "関連ツール",
    adLabel: "広告",
    language: "言語",
    footerPrivacy: "すべての変換はブラウザ内で実行されます。ファイルがアップロード・保存されることはありません。"
  },
  formats: {
    gpx: "GPX(GPS Exchange Format)は、GPSデータのためのオープンなXML規格です。ウェイポイント、ルート、トラックを標高やタイムスタンプとともに保存でき、Garmin、Strava、Komoot、Wahooなど多くのアウトドアアプリが入出力に対応しています。",
    kml: "KML(Keyhole Markup Language)は、Google EarthやGoogleマイマップで使われるXML形式です。目印、パス、ポリゴンを記述でき、gx:Track拡張を使えばタイムスタンプ付きのトラックも保存できます。",
    geojson: "GeoJSON(RFC 7946)は、Leaflet、Mapbox、QGIS、PostGISなどのWeb地図やGISソフトで使われる地理データ用のJSON形式です。座標は「経度、緯度、標高」の順で保存されます。",
    csv: "CSV(カンマ区切り値)は、Excel、Googleスプレッドシート、LibreOffice、R、pandasなどで読み込めるプレーンテキストの表形式です。ジオメトリの概念がないため、GPSデータは緯度・経度の列を持つ1点1行の形式で出力されます。"
  },
  commonFaq: [
    {
      q: "ファイルはサーバーにアップロードされますか?",
      a: "いいえ。変換はすべてブラウザ内で実行され、このページはファイルを外部に送信できないよう制限されています。ブラウザの開発者ツールの「ネットワーク」タブで、ファイルを含む通信が一切ないことをご自身で確認できます。"
    },
    {
      q: "ファイルサイズの上限はありますか?",
      a: "200 MBまでのファイルに対応しています。すべてお使いの端末上で処理するため、非常に大きなファイルではアップロード容量ではなくブラウザのメモリが上限になります。"
    }
  ],
  tools: {
    'gpx-to-kml': {
      title: "GPX KML 変換ツール",
      description: "GPXのトラック、ルート、ウェイポイントをGoogle EarthやGoogleマイマップ用のKMLに変換します。無料・即時変換で、ファイルがブラウザの外に出ることはありません。",
      faq: [
        {
          q: "GPXからKMLへの変換で何が保持されますか?",
          a: "ウェイポイント、ルート、トラックと、その名前、説明、標高、タイムスタンプが保持されます。タイムスタンプ付きのトラックはgx:Trackとして出力されるため、Google Earthのタイムスライダーで再生できます。複数セグメントのトラックもセグメント構造を維持します。"
        },
        {
          q: "失われる情報はありますか?",
          a: "心拍数、ケイデンス、気温などGPX拡張に保存されたセンサーデータは、KMLに対応する要素がないため引き継がれません。また、1点しかないトラックセグメントは線にならないためスキップされます。"
        },
        {
          q: "KMLファイルをGoogle Earthで開くには?",
          a: "Web版Google Earthでは「ファイル」→「KMLファイルをインポート」、Google Earth Proでは「ファイル」→「開く」を選びます。Googleマイマップではレイヤを追加して「インポート」をクリックします。"
        }
      ]
    },
    'kml-to-gpx': {
      title: "KML GPX 変換ツール",
      description: "Google EarthやGoogleマイマップのKMLを、Garmin、Komoot、StravaなどのGPS機器やアプリで使えるGPXに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。",
      faq: [
        {
          q: "KMLの要素はGPXでどう扱われますか?",
          a: "ポイントの目印はウェイポイントになります。パス(LineString)とgx:Trackはトラックになり、標高と、gx:Trackの場合はタイムスタンプも保持されます。gx:MultiTrackは複数セグメントを持つ1つのトラックになります。名前と説明も引き継がれます。Google Earthで地面に沿って描いたパスは実際の標高ではなく高度0を持つため、標高は出力されません。"
        },
        {
          q: "ポリゴンやスタイルはどうなりますか?",
          a: "GPXにはポリゴンがないため、ポリゴンの輪郭はトラックとして出力されます。色やアイコンなどのKMLスタイルはGPXに対応する要素がないため破棄されます。"
        },
        {
          q: "KMZファイルは変換できますか?",
          a: "現時点では直接変換できません。KMZはZIPアーカイブなので、拡張子を.zipに変更して展開し、中にあるdoc.kmlを変換してください。"
        }
      ]
    },
    'gpx-to-geojson': {
      title: "GPX GeoJSON 変換ツール",
      description: "GPXのトラック、ルート、ウェイポイントを、Leaflet、Mapbox、QGIS、PostGISで使えるGeoJSONに変換します。無料・即時変換で、ファイルがブラウザの外に出ることはありません。",
      faq: [
        {
          q: "GPXはGeoJSONでどう表現されますか?",
          a: "ウェイポイントはPoint、ルートはLineString、トラックはLineString(複数セグメントの場合はMultiLineString)のフィーチャーになります。座標はRFC 7946に従い「経度、緯度、標高」の順で出力されます。"
        },
        {
          q: "タイムスタンプや心拍数はどこに入りますか?",
          a: "GeoJSONの座標には含められないため、各点の値はフィーチャーのproperties.coordinatePropertiesに、座標と同じ並びの配列として保存されます。タイムスタンプはtimesに入り、GPXに心拍数、ケイデンス、気温が含まれていればそれらも保存されます。"
        },
        {
          q: "座標参照系は何ですか?",
          a: "GPXとGeoJSONの両方が採用しているWGS 84(EPSG:4326)です。再投影は行わず、座標を丸めることもありません。"
        }
      ]
    },
    'gpx-to-csv': {
      title: "GPX CSV 変換ツール",
      description: "GPXのトラック、ルート、ウェイポイントを、ExcelやGoogleスプレッドシート、Pythonで使えるCSVに変換します。1点につき1行で出力し、ファイルがブラウザの外に出ることはありません。",
      faq: [
        {
          q: "CSVにはどの列が含まれますか?",
          a: "1点につき1行で、type(waypoint、route、track)、name、description、segment、latitude、longitude、elevation、timeの各列が出力されます。GPXにセンサーデータがある場合は、heart_rate、cadence、temperature、powerの列が追加されます。descriptionはウェイポイントの行にのみ出力されます。"
        },
        {
          q: "複数セグメントのトラックはどう扱われますか?",
          a: "ポイントは記録された順序のまま出力され、segment列にトラックごとに1から始まるセグメント番号が入ります。記録の一時停止や途切れもそのまま確認できます。"
        },
        {
          q: "Excelで正しく開けますか?",
          a: "はい。BOM付きのUTF-8で出力するため、Excelでも日本語やアクセント付きの名前が文字化けしません。時刻はISO 8601形式のUTCです。=、+、-、@で始まるテキストは、表計算ソフトで数式として実行されないよう先頭にアポストロフィを付けます。"
        }
      ]
    },
    'kml-to-geojson': {
      title: "KML GeoJSON 変換ツール",
      description: "Google EarthやGoogleマイマップのKMLを、Leaflet、Mapbox、QGIS、PostGISで使えるGeoJSONに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。",
      faq: [
        {
          q: "KMLのジオメトリはGeoJSONでどう表現されますか?",
          a: "Point、LineString、Polygon(穴を含む)はそのままの型で出力されます。gx:TrackはLineString、gx:MultiTrackはMultiLineStringになり、タイムスタンプはproperties.coordinateProperties.timesに入ります。型が混在するMultiGeometryはGeometryCollectionになります。"
        },
        {
          q: "名前、説明、スタイルはどうなりますか?",
          a: "名前、説明、タイムスタンプ、ExtendedDataの各フィールドはフィーチャーのpropertiesになります。線や塗りのスタイルは、stroke、stroke-width、fill、fill-opacityなどのsimplestyleプロパティとして出力され、geojson.io、Mapbox、GitHubで表示に反映されます。"
        },
        {
          q: "変換されないものはありますか?",
          a: "このページは外部からデータを取得できないため、ネットワークリンクは読み込まれず、領域の輪郭とURLのみが保持されます。地面オーバーレイは表示範囲のポリゴンになり、画像のURLがiconプロパティに入りますが、画像そのものは含まれません。3Dモデルとツアーはスキップされます。KMZファイルは先に展開が必要です。拡張子を.zipに変更して展開し、中のdoc.kmlを変換してください。"
        }
      ]
    },
    'geojson-to-gpx': {
      title: "GeoJSON GPX 変換ツール",
      description: "QGIS、geojson.io、MapboxなどのGeoJSONを、Garmin、Komoot、StravaなどのGPS機器やアプリで使えるGPXに変換します。無料・即時変換で、ファイルはどこにもアップロードされません。",
      faq: [
        {
          q: "GeoJSONのフィーチャーはGPXでどう扱われますか?",
          a: "Pointはウェイポイント、LineStringはトラックになり、MultiLineStringは複数セグメントを持つ1つのトラックになります。GPXにはポリゴンがないため、ポリゴンの輪郭(穴を含む)はトラックセグメントとして出力されます。名前はnameまたはtitleプロパティ、説明はdescription、標高は3番目の座標値から読み取ります。Feature、FeatureCollection、単体のジオメトリのいずれにも対応しています。"
        },
        {
          q: "GPXにタイムスタンプを含められますか?",
          a: "通常のGeoJSONには点ごとの時刻がありません。properties.coordinateProperties.times(このサイトのGPX→GeoJSON変換が出力する形式)に時刻が入っている場合は、GPXのタイムスタンプになります。同じ場所にある心拍数、ケイデンス、気温、パワーは、Strava、Garmin Connect、Komootが読み取れるGarmin TrackPointExtension要素として出力されます。そのためGPX→GeoJSON→GPXと往復しても、ウェイポイント、ルート、セグメント、標高、時刻、センサー値が保持されます。"
        },
        {
          q: "「WGS 84ではありません」と表示されるのはなぜですか?",
          a: "GPXが扱えるのは、度単位のWGS 84経度・緯度だけです。QGISやogr2ogrからEPSG:3857などの投影座標系で書き出したGeoJSONにはメートル単位の値が入っており、そのまま変換すると使えないGPXになるため受け付けません。座標参照系をEPSG:4326にしてレイヤを書き出し直してください。"
        }
      ]
    },
    'geojson-to-kml': {
      title: "GeoJSON KML 変換ツール",
      description: "QGIS、geojson.io、MapboxなどのGeoJSONを、属性を保ったままGoogle EarthやGoogleマイマップ用のKMLに変換します。無料・即時変換で、ファイルはアップロードされません。",
      faq: [
        {
          q: "GeoJSONのジオメトリはKMLでどう表現されますか?",
          a: "Point、LineString、Polygon(穴を含む)はそのままの型で出力されます。MultiPoint、MultiLineString、MultiPolygon、GeometryCollectionはKMLのMultiGeometryになります。properties.coordinateProperties.timesに点ごとの時刻を持つラインはgx:Trackとして出力され、Google Earthでアニメーション再生できます。"
        },
        {
          q: "フィーチャーのプロパティは保持されますか?",
          a: "はい。name(またはtitle)とdescriptionは目印の名前と説明になり、それ以外の文字列・数値・真偽値のプロパティはすべてExtendedDataに出力され、Google Earthの吹き出しに表示されます。入れ子のオブジェクト、配列、空の値はスキップされます。strokeやmarker-colorなどのsimplestyleの色はデータとしては残りますが、目印の見た目には反映されません。"
        },
        {
          q: "「WGS 84ではありません」と表示されるのはなぜですか?",
          a: "KMLが扱えるのは、度単位のWGS 84経度・緯度だけです。QGISやogr2ogrからEPSG:3857などの投影座標系で書き出したGeoJSONにはメートル単位の値が入っており、誤った位置に表示されてしまうため受け付けません。座標参照系をEPSG:4326にしてレイヤを書き出し直してください。"
        }
      ]
    }
  }
};
