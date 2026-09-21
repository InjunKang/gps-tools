import type { Locale } from '../config/site';
import { perLocale } from './packs';
import type { UiStrings } from './types';

export type { UiErrorCode, UiStrings } from './types';

export const ui: Record<Locale, UiStrings> = perLocale((pack) => pack.ui);
