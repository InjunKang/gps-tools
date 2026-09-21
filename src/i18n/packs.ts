// One entry per locale in src/config/site.ts. Adding a locale there without a pack here is a
// compile error, as is a pack missing any string.
import type { Locale } from '../config/site';
import { pack as de } from './locales/de';
import { pack as en } from './locales/en';
import { pack as es } from './locales/es';
import { pack as fr } from './locales/fr';
import { pack as it } from './locales/it';
import { pack as ja } from './locales/ja';
import { pack as ko } from './locales/ko';
import { pack as pt } from './locales/pt';
import type { LocalePack } from './types';

export const packs: Record<Locale, LocalePack> = { en, de, ja, es, ko, fr, it, pt };

/** Builds a per-locale record from the packs, e.g. `perLocale((p) => p.ui)`. */
export const perLocale = <T>(pick: (pack: LocalePack) => T): Record<Locale, T> =>
  Object.fromEntries(Object.entries(packs).map(([locale, pack]) => [locale, pick(pack)])) as Record<Locale, T>;
