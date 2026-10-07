// WebGL rendering of the Blender-baked hall (assets/library.glb) and raycast
// picking that dispatches into the same approach() router the DOM uses.
// Coordinate contract: three.js world = CSS units / 100 (x east, z south, y up);
// camera mapping derived from the legacy CSS transform (rotation order YXZ,
// rotation.y = yaw, rotation.x = pitch).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EYE, RM } from './core.js';
import { approach, wasDrag } from './nav.js';

export async function initScene(canvas, onProgress) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14110c);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 3200);   // vista dome at r 2800
  camera.rotation.order = 'YXZ';

  // cool-sky / warm-ground fill keeps corners alive without deadening form
  scene.add(new THREE.HemisphereLight(0xe8eef5, 0x3f3526, 0.32));

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('assets/library.glb', (ev) => {
    if (onProgress && ev.total) onProgress(ev.loaded / ev.total);
  });
  scene.add(gltf.scene);

  // baked lightmaps: four atlases on UV layer "Atlas" (TEXCOORD_1)
  const tl = new THREE.TextureLoader();
  const [lmFloor, lmShell, lmDeco, lmCont] = await Promise.all([
    tl.loadAsync('assets/textures/lm_floor.webp'),
    tl.loadAsync('assets/textures/lm_shell.webp'),
    tl.loadAsync('assets/textures/lm_deco.webp'),
    tl.loadAsync('assets/textures/lm_cont.webp'),
  ]);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  for (const lm of [lmFloor, lmShell, lmDeco, lmCont]) {
    lm.flipY = false;
    lm.colorSpace = THREE.SRGBColorSpace;
    lm.channel = 1;
    lm.anisotropy = maxAniso;
  }
  const LM_BY_MAT = {
    Tiled_Lib_Floor: lmFloor, Tiled_Lib_Rug: lmFloor,
    Tiled_Lib_Plaster: lmShell, Tiled_Lib_Oak: lmShell,
    Lib_Brass: lmDeco, Lib_Stone: lmDeco, Lib_OakDark: lmDeco,
    Lib_Leather: lmDeco, Lib_Cream: lmDeco, Lib_ShadeGreen: lmDeco,
    Baked_cont: lmCont,
  };
  // self-lit vista / fx: swap to unlit vertex-colored materials
  const VISTA_MULT = (obj) => {
    const n = obj.name || '';
    if (n.startsWith('Vista_Sky')) return { mult: 1.15 };
    if (n.startsWith('Vista_SunCore')) return { mult: 6.0 };
    if (n.startsWith('Vista_SunGlow')) return { mult: 1.3, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false };
    if (n.startsWith('Vista_Cloud')) return { mult: 1.1, transparent: true, depthWrite: false };
    if (n.startsWith('Vista_Glint')) return { mult: 1.4 };
    if (n.startsWith('Fx_Beam')) return { mult: 1.0, opacity: 0.4, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide };
    return { mult: 1.0 };
  };
  gltf.scene.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    const name = o.material.name || '';
    if (o.name.startsWith('Vista_') || o.name.startsWith('Fx_')) {
      const cfg = VISTA_MULT(o);
      const m = new THREE.MeshBasicMaterial({
        vertexColors: true,
        color: new THREE.Color(cfg.mult, cfg.mult, cfg.mult),
        transparent: !!cfg.transparent,
        opacity: cfg.opacity !== undefined ? cfg.opacity : 1.0,
        depthWrite: cfg.depthWrite !== false,
        side: cfg.side || THREE.FrontSide,
      });
      if (cfg.blending) m.blending = cfg.blending;
      m.toneMapped = true;
      o.material = m;
      o.frustumCulled = o.name.startsWith('Fx_') ? true : false;  // huge rings: skip culling math
      return;
    }
    if (name.startsWith('Lib_Glass')) {
      o.material = new THREE.MeshBasicMaterial({
        color: 0xdfeef5, transparent: true, opacity: 0.07, depthWrite: false,
      });
      return;
    }
    for (const slot of ['map', 'roughnessMap', 'normalMap']) {
      if (o.material[slot]) {
        o.material[slot].anisotropy = maxAniso;
      }
    }
    const lm = LM_BY_MAT[name];
    if (lm) {
      o.material.lightMap = lm;
      o.material.lightMapIntensity = name.startsWith('Tiled_') ? 3.0 : 2.6;
      if (o.material.map && name.startsWith('Tiled_')) {
        const mirrored = name.includes('Plaster') || name.includes('Rug');
        const wrap = mirrored ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        o.material.map.wrapS = o.material.map.wrapT = wrap;
      }
    }
  });

  // ---- picking: click -> userData.act -> approach(kind, id) ----
  // The listener sits on #viewport, not the canvas: the drag-look handler takes
  // pointer capture on #viewport, which retargets the click away from the canvas.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  canvas.parentElement.addEventListener('click', (e) => {
    if (wasDrag()) return;
    const ov = document.getElementById('overlay'), mn = document.getElementById('menu');
    if ((ov && !ov.hidden) || (mn && !mn.hidden)) return;
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(gltf.scene.children, true);
    for (const h of hits) {
      let o = h.object;
      while (o && !(o.userData && o.userData.act)) o = o.parent;
      if (o) {
        const act = o.userData.act;
        const i = act.indexOf(':');
        approach(act.slice(0, i), act.slice(i + 1));
        return;
      }
    }
  });

  // ---- camera hook driven by nav's step() every frame ----
  window.__apply3d = function (cam, ts, active) {
    let yawOff = 0, yOff = 0;
    if (!RM && active) {               // idle sway, as in the CSS build
      yawOff = Math.sin(ts * 0.00042) * 0.0042;
      yOff = Math.sin(ts * 0.00085) * 0.02;
    }
    camera.position.set(cam.x / 100, EYE / 100 + yOff, cam.z / 100);
    camera.rotation.y = cam.yaw + yawOff;
    camera.rotation.x = cam.pitch;
    renderer.render(scene, camera);
  };

  window.__scene3d = { renderer, scene, camera, gltf, THREE, ray };
  return { renderer, scene, camera };
}
