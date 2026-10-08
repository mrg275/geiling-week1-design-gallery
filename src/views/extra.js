// The other eight windows.
//
// The four hero views (tuned individually against their photographs) sit on the
// mid-hall and south-end side windows. Every remaining window reuses one of the
// same four places with a different crop, so the hall never shows the low-poly
// landscape through a window — at a grazing angle that landscape compresses its
// flat rings into stripes, which reads as a smeared, broken view.
//
// Framing overrides keep each repeat from looking like a copy of its neighbour,
// and `distance` stays short so every plate sits in front of the vista's trees
// and bushes (they are real geometry at real depths, not a backdrop).
import poolDusk from './pool-dusk.js';
import poolGolden from './pool-golden.js';
import oceanDusk from './ocean-dusk.js';
import hawaiiDawn from './hawaii-dawn.js';

const put = (base, id, wall, at, over = {}) => ({
  ...base, id, wall, at, distance: 4.5, cover: 3.6, ...over,
});

export const EXTRA = [
  // side windows at the north end
  put(oceanDusk,  'ocean-w-north',  'W', -30.6, { shift: [0.06, 0.01] }),
  put(poolGolden, 'golden-e-north', 'E', -30.6, { shift: [-0.05, 0] }),

  // north wall, left to right — four different places behind the Collection Map
  put(hawaiiDawn, 'hawaii-n-1', 'N', -13.8, { shift: [0.05, 0] }),
  put(poolDusk,   'dusk-n-2',   'N',  -7.6, { shift: [-0.06, 0.01] }),
  put(oceanDusk,  'ocean-n-3',  'N',   7.6, { shift: [-0.04, 0] }),
  put(poolGolden, 'golden-n-4', 'N',  13.8, { shift: [0.06, 0] }),

  // south wall, flanking the entrance portal
  put(poolDusk,   'dusk-s-1',   'S', -14.2, { shift: [0.05, 0] }),
  put(hawaiiDawn, 'hawaii-s-2', 'S',  14.2, { shift: [-0.05, 0] }),
];
