// Pool at golden hour — low sun flaring through the crape myrtle, long rays.
export default {
  id: 'pool-golden',
  texture: 'assets/views/pool-golden.webp',
  aspect: 0.75,
  wall: 'W', at: 30.2,           // west wall, south end
  distance: 7, centerY: 7.0, photoWidth: 13, cover: 2.8,
  shift: [0, 0],

  water: [0.12, 0.40],
  waterAmp: 0.0018, waterScale: 0.9, waterSpeed: 0.8,
  glitter: 0.12, glitterWidth: 0.22,

  skyBottom: 0.55, skyDrift: 0.004,
  foliage: [0.42, 0.95], sway: 0.0010,

  sun: [0.417, 0.624], sunColor: '#ffe6b5',
  sunSize: 0.05, sunGlow: 0.22, rays: 0.10,
  exposure: 1.0, saturate: 1.0,
};
