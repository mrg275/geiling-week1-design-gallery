// Living window views: Matthew's four favourite places, hung outside four
// windows as animated parallax dioramas.
//
// Each view is a photograph on a large plane set back behind the window, drawn
// by a shader that brings it to life: water ripples and throws sun-glitter,
// clouds drift, foliage sways, the sun blooms. The photo itself supplies the
// photorealism; the shader supplies the motion. Runtime only — nothing baked.
//
// Scene coordinates are three.js world metres (x east, y up, z south);
// z = -(Blender y). Window centres: W/E walls x = ∓17, N wall z = -34,
// S wall z = +34. Glass spans y 0.86–6.86.
//
// Per-view parameters live in src/views/*.js — see that folder for the schema.

import { VIEWS } from './views/index.js';

const VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Written in sRGB and passed straight through (toneMapped:false, no colorspace
// chunk) so the photograph reads exactly as it was shot.
const FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;

uniform sampler2D uMap;
uniform float uTime;
uniform vec2  uFit;        // photo scale inside the plane
uniform vec2  uShift;      // photo offset inside the plane
uniform vec2  uWater;      // (bottom v, top v) of the water band
uniform float uWaterAmp;
uniform float uWaterScale;
uniform float uWaterSpeed;
uniform float uGlitter;
uniform float uGlitterWidth;
uniform float uSkyBottom;
uniform float uSkyDrift;
uniform vec2  uFoliage;    // (bottom v, top v)
uniform float uSway;
uniform vec2  uSunUV;
uniform vec3  uSunColor;
uniform float uSunSize;
uniform float uSunGlow;
uniform float uRays;
uniform float uExposure;
uniform float uSaturate;
uniform float uAspect;

// the sampler decodes the sRGB photo to linear, so we must encode on the way
// out; without this every view displays as photo^2.2 (crushed, oversaturated)
vec3 lin2srgb(vec3 c) {
  c = max(c, vec3(0.0));
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

// Reflects any coordinate back into 0..1 with a triangle wave. A mirror join
// is C0-continuous, so the photo continues seamlessly past its own edges
// instead of smearing the edge pixel (which is what clamping did).
float mirror1(float x) { return 1.0 - abs(fract(x * 0.5) * 2.0 - 1.0); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  // map the plane into photo space; the texture clamps, so the margins
  // continue the photo's edge pixels instead of showing a seam
  vec2 raw = (vUv - 0.5) / uFit + 0.5 + uShift;    // photo-space uv, may exit 0..1
  // how far outside the photograph this fragment falls (0 inside)
  float periph = max(max(-raw.x, raw.x - 1.0), max(-raw.y, raw.y - 1.0));
  periph = clamp(periph, 0.0, 1.0);
  // mirror so the scene continues past the frame; masks and sampling share
  // these coordinates, so the water/sky/foliage bands mirror with the content
  vec2 puv = vec2(mirror1(raw.x), mirror1(raw.y));
  vec2 uv = puv;                                   // animated copy
  float t = uTime;

  // ---- water: layered swell + chop, growing toward the near shore ----
  float wTop = uWater.y, wBot = uWater.x;
  float wmask = smoothstep(wTop + 0.012, wTop - 0.012, uv.y)
              * smoothstep(wBot - 0.02, wBot + 0.02, uv.y);
  if (wmask > 0.001) {
    float d = clamp((wTop - uv.y) / max(wTop - wBot, 0.001), 0.0, 1.0);
    float amp = uWaterAmp * (0.18 + 1.5 * d * d);
    float s = uWaterSpeed;
    float w1 = sin(uv.y * 150.0 * uWaterScale - t * 1.7 * s + uv.x * 9.0);
    float w2 = sin(uv.y * 58.0 * uWaterScale + t * 0.95 * s - uv.x * 19.0);
    float w3 = vnoise(vec2(uv.x * 13.0, uv.y * 46.0 * uWaterScale - t * 0.55 * s)) - 0.5;
    uv.y += (w1 * 0.42 + w2 * 0.33 + w3 * 0.85) * amp * wmask;
    uv.x += (w2 * 0.22 + w3 * 0.55) * amp * 0.65 * wmask;
  }

  // ---- sky: slow lateral cloud drift ----
  float smask = smoothstep(uSkyBottom - 0.07, uSkyBottom + 0.07, uv.y);
  uv.x += uSkyDrift * sin(t * 0.045) * smask;
  uv.y += uSkyDrift * 0.35 * sin(t * 0.031 + 1.7) * smask;

  // ---- foliage: breeze ----
  float fmask = smoothstep(uFoliage.x - 0.035, uFoliage.x + 0.035, uv.y)
              * smoothstep(uFoliage.y + 0.035, uFoliage.y - 0.035, uv.y);
  if (fmask > 0.001) {
    float gust = 0.65 + 0.35 * sin(t * 0.23);
    uv.x += sin(t * 1.25 + uv.y * 34.0) * uSway * fmask * gust;
    uv.y += sin(t * 0.91 + uv.x * 26.0) * uSway * 0.4 * fmask * gust;
  }

  vec3 c;
  if (periph < 0.002) {
    c = texture2D(uMap, uv).rgb;
  } else {
    // progressive 5-tap defocus: the further outside, the softer
    float r = 0.004 + periph * 0.05;
    c  = texture2D(uMap, uv).rgb * 0.36;
    c += texture2D(uMap, vec2(mirror1(uv.x + r), uv.y)).rgb * 0.16;
    c += texture2D(uMap, vec2(mirror1(uv.x - r), uv.y)).rgb * 0.16;
    c += texture2D(uMap, vec2(uv.x, mirror1(uv.y + r))).rgb * 0.16;
    c += texture2D(uMap, vec2(uv.x, mirror1(uv.y - r))).rgb * 0.16;
    // and settle it back a touch so the eye reads depth, not a repeat
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(c, vec3(l), min(periph * 0.5, 0.3)) * (1.0 - min(periph * 0.22, 0.14));
  }

  // ---- sun-glitter path on the water ----
  if (uGlitter > 0.0001) {
    float gm = smoothstep(wTop + 0.008, wTop - 0.008, puv.y)
             * smoothstep(wBot - 0.02, wBot + 0.02, puv.y);
    float band = exp(-pow((puv.x - uSunUV.x) / max(uGlitterWidth, 0.01), 2.0));
    float n1 = vnoise(vec2(puv.x * 320.0, puv.y * 760.0 - t * 2.3));
    float n2 = vnoise(vec2(puv.x * 185.0 + t * 0.8, puv.y * 430.0 + t * 0.4));
    float spark = smoothstep(0.80, 0.99, n1 * 0.55 + n2 * 0.6);
    float near = smoothstep(wTop, wBot, puv.y);           // more sparkle closer in
    c += uSunColor * spark * band * gm * uGlitter * (0.45 + 0.75 * near);
  }

  // ---- sun bloom + rays ----
  vec2 sd = (puv - uSunUV) * vec2(uAspect, 1.0);
  float dist = length(sd);
  if (uSunGlow > 0.0001) {
    c += uSunColor * exp(-dist / max(uSunSize, 0.001)) * uSunGlow;
    c += uSunColor * exp(-dist / max(uSunSize * 4.5, 0.001)) * uSunGlow * 0.35;
  }
  if (uRays > 0.0001) {
    float ang = atan(sd.y, sd.x);
    float ray = 0.5 + 0.5 * sin(ang * 9.0 + sin(ang * 4.0 + t * 0.21) * 1.5);
    ray = pow(ray, 3.0) * exp(-dist * 1.5);
    c += uSunColor * ray * uRays;
  }

  // ---- grade ----
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, uSaturate) * uExposure;
  gl_FragColor = vec4(lin2srgb(c), 1.0);
}`;

const WALLS = {
  // [outward axis sign, builds position from (at, distance)]
  W: { rotY:  Math.PI / 2, pos: (at, d) => [-17 - d, at] },
  E: { rotY: -Math.PI / 2, pos: (at, d) => [ 17 + d, at] },
  N: { rotY: 0,            pos: (at, d) => [at, -34 - d] },
  S: { rotY: Math.PI,      pos: (at, d) => [at,  34 + d] },
};

export function buildWindowViews(THREE, scene) {
  const loader = new THREE.TextureLoader();
  const texCache = new Map();        // twelve windows share four photographs
  const group = new THREE.Group();
  group.name = 'Fx_WindowViews';
  const mats = [];

  for (const v of VIEWS) {
    let tex = texCache.get(v.texture);
    if (!tex) {
      tex = loader.load(v.texture);
      tex.colorSpace = THREE.SRGBColorSpace;
      // the shader mirrors coordinates itself, so clamping never shows
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.anisotropy = 8;
      texCache.set(v.texture, tex);
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      toneMapped: false,
      depthWrite: true,
      uniforms: {
        uMap: { value: tex },
        uTime: { value: 0 },
        uFit: { value: new THREE.Vector2(v.fit?.[0] ?? 1, v.fit?.[1] ?? 1) },
        uShift: { value: new THREE.Vector2(v.shift?.[0] ?? 0, v.shift?.[1] ?? 0) },
        uWater: { value: new THREE.Vector2(v.water?.[0] ?? 0, v.water?.[1] ?? 0.4) },
        uWaterAmp: { value: v.waterAmp ?? 0.0022 },
        uWaterScale: { value: v.waterScale ?? 1 },
        uWaterSpeed: { value: v.waterSpeed ?? 1 },
        uGlitter: { value: v.glitter ?? 0 },
        uGlitterWidth: { value: v.glitterWidth ?? 0.16 },
        uSkyBottom: { value: v.skyBottom ?? 0.6 },
        uSkyDrift: { value: v.skyDrift ?? 0.004 },
        uFoliage: { value: new THREE.Vector2(v.foliage?.[0] ?? 0, v.foliage?.[1] ?? 0) },
        uSway: { value: v.sway ?? 0.0012 },
        uSunUV: { value: new THREE.Vector2(v.sun?.[0] ?? 0.5, v.sun?.[1] ?? 0.8) },
        uSunColor: { value: new THREE.Color(v.sunColor ?? '#ffd9a0') },
        uSunSize: { value: v.sunSize ?? 0.06 },
        uSunGlow: { value: v.sunGlow ?? 0 },
        uRays: { value: v.rays ?? 0 },
        uExposure: { value: v.exposure ?? 1 },
        uSaturate: { value: v.saturate ?? 1 },
        uAspect: { value: v.planeAspect ?? 0.78 },
      },
    });

    // The plane must over-cover the window's view cone from any standing spot,
    // so it is `cover` times the photo and the photo is inset by uFit; the
    // clamped margins continue the photo's edge pixels seamlessly.
    const aspect = v.aspect ?? 0.75;
    const cover = v.cover ?? 2.8;
    const pw = v.photoWidth ?? 13;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pw * cover, (pw / aspect) * cover, 1, 1), mat);
    mat.uniforms.uFit.value.set((v.fit?.[0] ?? 1) / cover, (v.fit?.[1] ?? 1) / cover);
    mat.uniforms.uAspect.value = aspect;
    const wall = WALLS[v.wall];
    const [a, b] = wall.pos(v.at, v.distance ?? 7);
    mesh.position.set(
      (v.wall === 'W' || v.wall === 'E') ? a : a,
      v.centerY ?? 7.0,
      (v.wall === 'W' || v.wall === 'E') ? b : b);
    mesh.rotation.y = wall.rotY;
    mesh.frustumCulled = true;   // finite quads: cull the eleven you aren't facing
    mesh.name = 'Fx_View_' + v.id;
    group.add(mesh);
    mats.push(mat);
  }

  scene.add(group);
  return {
    update(ts) {
      const t = ts * 0.001;
      for (const m of mats) m.uniforms.uTime.value = t;
    },
  };
}
