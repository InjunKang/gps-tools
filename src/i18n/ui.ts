// Shared UI strings. `{from}` / `{to}` are replaced with format labels such as "GPX".
import type { ConvertErrorCode } from '../lib/convert/types';
import type { Locale } from '../config/site';

export type UiErrorCode = ConvertErrorCode | 'too-large' | 'unknown';

export interface UiStrings {
  homeTitle: string;
  homeDescription: string;
  homeHeading: string;
  allTools: string;
  privacyBadge: string;
  dropPrompt: string;
  dropHint: string;
  chooseFile: string;
  converting: string;
  done: string;
  /** `{features}` and `{points}` are numbers. */
  stats: string;
  download: string;
  convertAnother: string;
  tryAgain: string;
  errors: Record<UiErrorCode, string>;
  howToHeading: string;
  howToSteps: [string, string, string];
  formatsHeading: string;
  faqHeading: string;
  relatedHeading: string;
  adLabel: string;
  language: string;
  footerPrivacy: string;
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    homeTitle: 'Private GPS File Converters',
    homeDescription:
      'Free GPS file tools that run entirely in your browser. Convert GPX, KML and GeoJSON without uploading anything.',
    homeHeading: 'GPS file tools that never upload your files',
    allTools: 'All tools',
    privacyBadge: 'Your file never leaves your browser',
    dropPrompt: 'Drop your {from} file here',
    dropHint: 'or',
    chooseFile: 'Choose a file',
    converting: 'Converting…',
    done: 'Your {to} file is ready',
    stats: 'Features: {features} · Points: {points}',
    download: 'Download {to}',
    convertAnother: 'Convert another file',
    tryAgain: 'Try another file',
    errors: {
      'invalid-file': 'This file could not be read. It does not look like valid {from}.',
      'wrong-format': 'This is not a {from} file. Please choose a .{ext} file.',
      empty: 'This {from} file contains no waypoints, routes or tracks to convert.',
      unsupported: 'This conversion is not supported.',
      'too-large': 'This file is larger than 200 MB and cannot be converted in the browser.',
      unknown: 'Something went wrong while converting. Nothing was uploaded.',
    },
    howToHeading: 'How to convert {from} to {to}',
    howToSteps: [
      'Drop your {from} file into the box above, or click to choose it from your device.',
      'The conversion runs instantly inside your browser. Nothing is uploaded.',
      'Click “Download {to}” to save the converted file.',
    ],
    formatsHeading: 'About the formats',
    faqHeading: 'Frequently asked questions',
    relatedHeading: 'Related tools',
    adLabel: 'Advertisement',
    language: 'Language',
    footerPrivacy: 'All conversions run locally in your browser. No files are uploaded or stored.',
  },
  de: {
    homeTitle: 'Private GPS-Dateikonverter',
    homeDescription:
      'Kostenlose GPS-Dateitools, die vollständig in Ihrem Browser laufen. GPX, KML und GeoJSON umwandeln, ohne etwas hochzuladen.',
    homeHeading: 'GPS-Dateitools, die Ihre Dateien nie hochladen',
    allTools: 'Alle Tools',
    privacyBadge: 'Ihre Datei verlässt nie den Browser',
    dropPrompt: '{from}-Datei hier ablegen',
    dropHint: 'oder',
    chooseFile: 'Datei auswählen',
    converting: 'Wird umgewandelt …',
    done: 'Ihre {to}-Datei ist fertig',
    stats: 'Objekte: {features} · Punkte: {points}',
    download: '{to} herunterladen',
    convertAnother: 'Weitere Datei umwandeln',
    tryAgain: 'Andere Datei versuchen',
    errors: {
      'invalid-file': 'Diese Datei konnte nicht gelesen werden. Sie scheint kein gültiges {from} zu sein.',
      'wrong-format': 'Das ist keine {from}-Datei. Bitte wählen Sie eine .{ext}-Datei.',
      empty: 'Diese {from}-Datei enthält keine Wegpunkte, Routen oder Tracks.',
      unsupported: 'Diese Umwandlung wird nicht unterstützt.',
      'too-large': 'Diese Datei ist größer als 200 MB und kann nicht im Browser umgewandelt werden.',
      unknown: 'Bei der Umwandlung ist ein Fehler aufgetreten. Es wurde nichts hochgeladen.',
    },
    howToHeading: 'So wandeln Sie {from} in {to} um',
    howToSteps: [
      'Ziehen Sie Ihre {from}-Datei in das Feld oben oder klicken Sie, um sie auf Ihrem Gerät auszuwählen.',
      'Die Umwandlung läuft sofort in Ihrem Browser. Es wird nichts hochgeladen.',
      'Klicken Sie auf „{to} herunterladen“, um die umgewandelte Datei zu speichern.',
    ],
    formatsHeading: 'Über die Formate',
    faqHeading: 'Häufige Fragen',
    relatedHeading: 'Verwandte Tools',
    adLabel: 'Anzeige',
    language: 'Sprache',
    footerPrivacy: 'Alle Umwandlungen laufen lokal in Ihrem Browser. Es werden keine Dateien hochgeladen oder gespeichert.',
  },
  ja: {
    homeTitle: 'プライバシー重視のGPSファイル変換ツール',
    homeDescription:
      'すべてブラウザ内で動作する無料のGPSファイルツール。GPX、KML、GeoJSONをアップロードなしで変換できます。',
    homeHeading: 'ファイルをアップロードしないGPSファイルツール',
    allTools: 'すべてのツール',
    privacyBadge: 'ファイルがブラウザの外に出ることはありません',
    dropPrompt: '{from}ファイルをここにドロップ',
    dropHint: 'または',
    chooseFile: 'ファイルを選択',
    converting: '変換中…',
    done: '{to}ファイルの準備ができました',
    stats: 'フィーチャー: {features} · ポイント: {points}',
    download: '{to}をダウンロード',
    convertAnother: '別のファイルを変換',
    tryAgain: '別のファイルを試す',
    errors: {
      'invalid-file': 'このファイルを読み込めませんでした。有効な{from}ではないようです。',
      'wrong-format': 'これは{from}ファイルではありません。.{ext}ファイルを選択してください。',
      empty: 'この{from}ファイルには、変換できるウェイポイント、ルート、トラックがありません。',
      unsupported: 'この変換には対応していません。',
      'too-large': 'このファイルは200 MBを超えているため、ブラウザでは変換できません。',
      unknown: '変換中に問題が発生しました。ファイルはアップロードされていません。',
    },
    howToHeading: '{from}を{to}に変換する方法',
    howToSteps: [
      '上のボックスに{from}ファイルをドロップするか、クリックして端末から選択します。',
      '変換はブラウザ内ですぐに実行されます。ファイルはアップロードされません。',
      '「{to}をダウンロード」をクリックして、変換したファイルを保存します。',
    ],
    formatsHeading: 'ファイル形式について',
    faqHeading: 'よくある質問',
    relatedHeading: '関連ツール',
    adLabel: '広告',
    language: '言語',
    footerPrivacy: 'すべての変換はブラウザ内で実行されます。ファイルがアップロード・保存されることはありません。',
  },
  es: {
    homeTitle: 'Conversores privados de archivos GPS',
    homeDescription:
      'Herramientas gratuitas para archivos GPS que funcionan por completo en tu navegador. Convierte GPX, KML y GeoJSON sin subir nada.',
    homeHeading: 'Herramientas GPS que nunca suben tus archivos',
    allTools: 'Todas las herramientas',
    privacyBadge: 'Tu archivo nunca sale de tu navegador',
    dropPrompt: 'Suelta aquí tu archivo {from}',
    dropHint: 'o',
    chooseFile: 'Elegir un archivo',
    converting: 'Convirtiendo…',
    done: 'Tu archivo {to} está listo',
    stats: 'Elementos: {features} · Puntos: {points}',
    download: 'Descargar {to}',
    convertAnother: 'Convertir otro archivo',
    tryAgain: 'Probar con otro archivo',
    errors: {
      'invalid-file': 'No se pudo leer este archivo. No parece un {from} válido.',
      'wrong-format': 'Esto no es un archivo {from}. Elige un archivo .{ext}.',
      empty: 'Este archivo {from} no contiene waypoints, rutas ni tracks que convertir.',
      unsupported: 'Esta conversión no es compatible.',
      'too-large': 'Este archivo supera los 200 MB y no se puede convertir en el navegador.',
      unknown: 'Algo salió mal durante la conversión. No se subió nada.',
    },
    howToHeading: 'Cómo convertir {from} a {to}',
    howToSteps: [
      'Suelta tu archivo {from} en el recuadro de arriba o haz clic para elegirlo en tu dispositivo.',
      'La conversión se ejecuta al instante en tu navegador. No se sube nada.',
      'Haz clic en «Descargar {to}» para guardar el archivo convertido.',
    ],
    formatsHeading: 'Sobre los formatos',
    faqHeading: 'Preguntas frecuentes',
    relatedHeading: 'Herramientas relacionadas',
    adLabel: 'Publicidad',
    language: 'Idioma',
    footerPrivacy: 'Todas las conversiones se ejecutan en tu navegador. No se sube ni se guarda ningún archivo.',
  },
};
