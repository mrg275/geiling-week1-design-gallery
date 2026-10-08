// Pool at dusk — pink and coral cloud, mirror-still water, hedges and roses.
export default {
  id: 'pool-dusk',
  texture: 'assets/views/pool-dusk.webp',
  aspect: 0.75,
  wall: 'W', at: 1.8,            // west wall, mid-hall
  distance: 7, centerY: 7.0, photoWidth: 13, cover: 2.8,
  shift: [0, 0],

  water: [0.0, 0.41],            // the pool fills the lower 41% of the frame
  waterAmp: 0.0016, waterScale: 0.8, waterSpeed: 0.65,
  glitter: 0.06, glitterWidth: 0.30,

  skyBottom: 0.56, skyDrift: 0.005,
  foliage: [0.44, 0.78], sway: 0.0011,

  sun: [0.45, 0.93], sunColor: '#ff9f7c',
  sunSize: 0.22, sunGlow: 0.05, rays: 0,
  exposure: 1.0, saturate: 1.05,
};
