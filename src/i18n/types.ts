// Shape of one language pack (src/i18n/locales/<locale>.ts). Every field is required, so a
// locale that lacks a string, a format blurb or a tool's copy fails `astro check`.
import type { ToolSlug } from '../config/tools';
import type { ConvertErrorCode, FormatId } from '../lib/convert/types';

export type UiErrorCode = ConvertErrorCode | 'too-large' | 'unknown';

/** Shared UI strings. `{from}` / `{to}` are replaced with format labels such as "GPX". */
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
  /** Web Share button (phones): sends the converted file to another app with its name intact. */
  share: string;
  /** Shown on browsers that save blob downloads as "unknown" (Safari 13). `{name}` is the file name. */
  renameHint: string;
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

export interface Faq {
  q: string;
  a: string;
}

export interface ToolCopy {
  /** <h1> and <title>. */
  title: string;
  /** Meta description and the line under the <h1>. */
  description: string;
  faq: Faq[];
}

export interface LocalePack {
  ui: UiStrings;
  /** "About the formats" blurb per format. */
  formats: Record<FormatId, string>;
  /** Appended to the FAQ of every tool. */
  commonFaq: Faq[];
  tools: Record<ToolSlug, ToolCopy>;
}
