// Pool at dusk — pink and coral cloud, mirror-still water, hedges and roses.
//
// Region values (water / skyBottom / foliage) are in PHOTO uv, v = 0 at the
// bottom of the photo. Measured off the plate:
//   v 0.000–0.375  pool water (far coping sits at v 0.375–0.392, dipping to
//                  ~0.365 at the right edge, so 0.375 is the safe waterline)
//   v 0.375–0.455  coping, mown lawn, the spa basin and the dog
//   v 0.455–0.820  hedge wall, rose beds and the big tree canopy
//   v 0.545–1.000  open sky (lowest gap is the orange horizon glow at ~0.545)
//
export default {
  id: 'pool-dusk',
  texture: 'assets/views/pool-dusk.webp',
  aspect: 0.75,
  wall: 'W', at: 1.8,            // west wall, mid-hall

  // Framing. The window's cone widens fast as you walk up to it, so the plate
  // sits only 4.5 m out: at that depth 8.5 m of width still covers the glass
  // from two metres away (no stretched edge pixels), while from the middle of
  // the hall the cone lands on photo v 0.13–0.87 — the whole pool, the hedge
  // line and the coral cloud, waterline just below centre.
  distance: 4.5, centerY: 4.29, photoWidth: 8.5, cover: 3.0,
  shift: [0, 0],

  // Glassy pool: the reflection shimmers, it never chops. The shader already
  // fades the amplitude to nothing at the waterline and grows it toward the
  // near shore, which is exactly how a still pool behaves.
  water: [0.0, 0.375],
  waterAmp: 0.0034, waterScale: 1.05, waterSpeed: 0.6,
  glitter: 0.05, glitterWidth: 0.22,

  skyBottom: 0.60, skyDrift: 0.010,
  foliage: [0.455, 0.82], sway: 0.0024,

  // No sun disc in this photograph: the bloom is a very broad warm lift centred
  // on the orange horizon gap behind the hedge, so it reads as sky glow rather
  // than as a light source.
  sun: [0.42, 0.56], sunColor: '#ffd2b4',
  sunSize: 0.9, sunGlow: 0.02, rays: 0,
  exposure: 1.0, saturate: 1.0,
};
