import { gpx } from '@tmcw/togeojson';
import type { Reader } from '../types';
import { parseXml } from '../xml';

export const readGpx: Reader = (text) => gpx(parseXml(text, 'gpx'));
