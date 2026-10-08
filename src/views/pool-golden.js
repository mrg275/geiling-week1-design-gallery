// Pool at golden hour — low sun flaring through the crape myrtle, long rays.
export default {
  id: 'pool-golden',
  texture: 'assets/views/pool-golden.webp',
  aspect: 0.75,
  wall: 'W', at: 30.2,           // west wall, south end

  // Framing. distance 5.0 keeps the plane in FRONT of Vista_Bush_14
  // (x -25.8..-23.4), which at distance 7 pokes a flat green blob through the
  // lower-right pane. photoWidth/centerY frame photo u 0.23-0.77, v 0.18-0.87
  // from the straight-on station — the whole pool, the crape myrtle and the
  // flare, at roughly 1:1 angular scale. shift[1] drops the picture 0.035 v so
  // the sun sits inside a pane instead of behind the upper glazing bar.
  distance: 5.0, centerY: 5.15, photoWidth: 10.6, cover: 3.2,
  shift: [0, 0.035],

  // Pool surface: near corner v 0.205, far coping v 0.380. Low amplitude — the
  // water is dark and dead still, so it should bend the reflections, not churn.
  water: [0.205, 0.380],
  waterAmp: 0.0014, waterScale: 1.0, waterSpeed: 0.55,
  glitter: 0.030, glitterWidth: 0.19,

  // Only real sky drifts; the crape myrtle above it also sways as foliage.
  skyBottom: 0.78, skyDrift: 0.0025,
  // 0.43 sits just above the far lawn strip, so the lawn never shears.
  foliage: [0.43, 1.00], sway: 0.0012,

  sun: [0.426, 0.616], sunColor: '#ffe3ad',
  sunSize: 0.014, sunGlow: 0.10, rays: 0.030,
  // The room adds a constant +21/255 veil over every pane (the 0.07-opacity
  // Lib_Glass tint plus the Fx_Beam light shafts crossing in front), measured
  // by hiding both at runtime. exposure/saturate claw a little of that back;
  // the engine's own colour path is exact at 1.0/1.0.
  exposure: 0.92, saturate: 1.12,
};
