// Waimanalo at first light — Rabbit Island offshore, coffee on the sand.
//
// Photo landmarks, all in photo uv (v = 0 is the BOTTOM of the frame):
// horizon v 0.581; the shoreline runs diagonally from v 0.490 at the left to
// v 0.547 at the right, so the open sea is a band only ~0.07 v tall; sun at
// (0.149, 0.619); Rabbit Island u 0.35-0.49; Makapu'u point u 0.74-0.85,
// topping out at v 0.64; the mug + journal live in the bottom v 0.18.
export default {
  id: 'hawaii-dawn',
  texture: 'assets/views/hawaii-dawn.webp',
  aspect: 0.766,
  wall: 'E', at: 29.5,           // east wall, south end

  // distance 4 (was 7) puts the plane at x = 21, in FRONT of Vista_TreeC_19
  // (x 22.8-27.8, z 34.4-39.1), which otherwise pokes a green wedge through the
  // right-hand pane from close up. photoWidth 6.69 (was 13) holds the same
  // angular framing at that distance while showing u 0.10-0.86 of the frame at
  // ~1.5 photo texels per screen pixel from the standing spot — this source is
  // only 706 px wide, so a small plane is the only way to keep it crisp.
  // centerY drops the horizon just under half way up the glass: sun and both
  // islands in the upper half, the mug peeking over the sill.
  // cover 2.8 clears the whole view cone from 2.35 m (the closest the nav lets
  // you stand) out to a 54-degree oblique, so no vista leaks at any station.
  distance: 4, centerY: 3.92, photoWidth: 6.69, cover: 2.8,
  shift: [-0.02, 0],             // nudge left so the low sun clears the mullion

  // the sea, from the swash (the shoreline is diagonal, so 0.500 is the best
  // single cut) up to just under the horizon — the +-0.02 / -0.012 mask ramps
  // then feather it onto the wet sand below and die out before the skyline.
  // waterScale 0.45 is a long swell (wavelength ~90 px of the photo): the sea
  // reads only ~44 screen px tall, and because the shader displaces uv, short
  // chop at a visible amplitude would fold the texture (amp x frequency has to
  // stay under ~0.5). A long slow heave is what a calm tropical dawn does.
  water: [0.500, 0.574],
  waterAmp: 0.0070, waterScale: 0.45, waterSpeed: 0.85,
  glitter: 0.45, glitterWidth: 0.13,   // path centred on the sun's u, ~0.26 wide

  // 0.74 keeps Makapu'u (v 0.64) and the gold horizon band out of the drift and
  // leaves the streaked cirrus sliding ~1 px/s — cloud pace, not wind pace.
  skyBottom: 0.74, skyDrift: 0.030,
  foliage: [0, 0], sway: 0,      // nothing green anywhere in this frame

  sun: [0.149, 0.619], sunColor: '#ffd79a',   // read straight off the photograph
  sunSize: 0.025, sunGlow: 0.12, rays: 0.012,

  // The photograph needs no grade of its own. This is the 7% Lib_Glass veil
  // being undone: the pane adds about +16/255 flat, which lifts the blacks and
  // washes the gold band. 0.95/1.05 cancels that (mean error against the
  // original over the visible crop: 6.5 -> 4.9 of 255).
  exposure: 0.95, saturate: 1.05,
};
