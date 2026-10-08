// Atlantic at sunset — breaking surf, a long glitter path, dark wet sand.
export default {
  id: 'ocean-dusk',
  texture: 'assets/views/ocean-dusk.webp',
  aspect: 0.75,
  wall: 'E', at: -4.5,           // east wall, mid-hall
  distance: 7, centerY: 7.0, photoWidth: 13, cover: 2.8,
  shift: [0, 0],

  water: [0.268, 0.497],         // horizon at v 0.497 down to the surf line
  waterAmp: 0.0030, waterScale: 1.2, waterSpeed: 1.3,
  glitter: 0.42, glitterWidth: 0.13,

  skyBottom: 0.52, skyDrift: 0.006,
  foliage: [0, 0], sway: 0,

  sun: [0.547, 0.834], sunColor: '#ffe9b0',
  sunSize: 0.045, sunGlow: 0.30, rays: 0.05,
  exposure: 1.0, saturate: 1.0,
};
