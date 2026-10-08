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

  // North wall, left to right. These four windows are only 6.2 m apart, so a
  // wide plate would overlap its neighbours — and plates at equal depth
  // z-fight (flicker) and occlude each other, putting the wrong photo in a
  // window. They therefore sit close to the glass with a proportionally
  // smaller photo, giving each window its own plate with a clear gap:
  // 5.98 m wide on a 6.2 m pitch.
  ...[[hawaiiDawn, 'hawaii-n-1', -13.8, 0.05],
      [poolDusk,   'dusk-n-2',    -7.6, -0.06],
      [oceanDusk,  'ocean-n-3',    7.6, -0.04],
      [poolGolden, 'golden-n-4',  13.8, 0.06]
  ].map(([base, id, x, su]) => put(base, id, 'N', x, {
    distance: 1.5, photoWidth: 4.4, cover: 1.36, centerY: 3.9, shift: [su, 0],
  })),

  // south wall, flanking the entrance portal
  put(poolDusk,   'dusk-s-1',   'S', -14.2, { shift: [0.05, 0] }),
  put(hawaiiDawn, 'hawaii-s-2', 'S',  14.2, { shift: [-0.05, 0] }),
];
