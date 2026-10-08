// Atlantic at sunset — breaking surf, a long glitter path, dark wet sand.
//
// Photo landmarks, measured off assets/views/ocean-dusk.webp (photo uv, v = 0 at
// the bottom of the frame):
//   sun        disc spans u 0.517–0.616, v 0.813–0.848 → centre (0.566, 0.830)
//   horizon    v 0.486 at the left edge, v 0.492 at the right — the frame is a
//              hair off level, so the ripple band must stop at ~0.474 or the sky
//              on the left starts to move
//   waterline  runs diagonally across the sand, v 0.365 at u 0 down to v 0.19 at u 0.9
//
// Framing: at the 6.5 m station the window shows photo u 0.22–0.78, v 0.26–0.97 —
// sun ~80% up the arch, horizon ~32% up, the glitter path running down the middle
// and only a corner of dry sand bottom-left. `cover` is large because the hall runs
// 68 m past this window: at ~78° off the glass the view cone sweeps 15 m sideways
// across the plane, and anything short of this lets the default green vista in.
export default {
  id: 'ocean-dusk',
  texture: 'assets/views/ocean-dusk.webp',
  aspect: 0.75,
  wall: 'E', at: -4.5,            // east wall, mid-hall
  distance: 3, centerY: 3.16, photoWidth: 8.2, cover: 4.2,
  shift: [0, 0],

  // Band stops just under the horizon and just under the waterline. The engine
  // grows the ripple as d² toward wBot, so the surf works hardest where the photo
  // shows breaking water, and the far water near the horizon stays glassy.
  water: [0.250, 0.474],
  waterAmp: 0.0032, waterScale: 0.75, waterSpeed: 1.60,
  // glitterWidth ≈ the photo's own sun path; the band is centred on `sun`.
  glitter: 0.15, glitterWidth: 0.17,

  skyBottom: 0.57, skyDrift: 0.018,   // ramp starts at v 0.50, clear of the horizon
  foliage: [0, 0], sway: 0,

  sun: [0.566, 0.830], sunColor: '#ffe4a2',
  sunSize: 0.018, sunGlow: 0.11, rays: 0.010,
  // The window glass is a 7%-opacity pale-blue sheet drawn over the view, which
  // lifts and cools the picture (+10 blue at mid levels). These two take that back
  // out; measured against the photograph they cut the mean error from (0.6, 4.2,
  // 9.9) to (1.1, 3.0, 1.7). Without the glass they would both be 1.0.
  exposure: 1.0, saturate: 1.0,
};
