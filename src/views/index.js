import poolDusk from './pool-dusk.js';
import poolGolden from './pool-golden.js';
import oceanDusk from './ocean-dusk.js';
import hawaiiDawn from './hawaii-dawn.js';
import { EXTRA } from './extra.js';

// the four hero views, then the eight repeats that fill the remaining windows
export const VIEWS = [poolDusk, poolGolden, oceanDusk, hawaiiDawn, ...EXTRA];
