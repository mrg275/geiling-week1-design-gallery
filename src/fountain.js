// Live fountain water: replaces the baked static water mesh with an animated
// system — rippling reflective basin surface, flowing streams from the four
// lion mouths, splash rings and foam at the impact points, light spray.
// Purely runtime; the bake never included water (Lib_Water is skip-listed).
//
// World frame (three.js): fountain center (0, *, +4); y up; basin water y≈0.74.

export function buildFountain(THREE, scene, gltfScene) {
  // remove the baked placeholder water (disc + rings + stream cylinders)
  const stale = [];
  gltfScene.traverse((o) => {
    if (o.isMesh && /^Fountain_Water/.test(o.name)) stale.push(o);
  });
  for (const o of stale) o.parent.remove(o);

  const group = new THREE.Group();
  group.name = 'Fx_FountainLive';
  const CX = 0, CZ = 4, WATER_Y = 0.818;

  // ---------- basin surface: scrolling dual normal maps ----------
  const texLoader = new THREE.TextureLoader();
  const norm1 = texLoader.load('vendor/three/textures/waternormals.jpg');
  const norm2 = texLoader.load('vendor/three/textures/waternormals.jpg');
  for (const t of [norm1, norm2]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  }
  norm1.repeat.set(3, 3);
  norm2.repeat.set(5.2, 5.2);

  const surface = new THREE.Mesh(
    new THREE.CircleGeometry(1.90, 48),
    new THREE.MeshStandardMaterial({
      color: 0x27687c,
      metalness: 0.0,
      roughness: 0.06,
      envMapIntensity: 1.35,
      normalMap: norm1,
      normalScale: new THREE.Vector2(0.55, 0.55),
      transparent: true,
      opacity: 0.92,
    })
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.set(CX, WATER_Y, CZ);
  group.add(surface);

  // a second faint layer scrolling against the first sells the motion
  const surface2 = new THREE.Mesh(
    new THREE.CircleGeometry(1.90, 48),
    new THREE.MeshStandardMaterial({
      color: 0x9fd6de,
      metalness: 0.0,
      roughness: 0.03,
      envMapIntensity: 1.6,
      normalMap: norm2,
      normalScale: new THREE.Vector2(0.35, 0.35),
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
    })
  );
  surface2.rotation.x = -Math.PI / 2;
  surface2.position.set(CX, WATER_Y + 0.004, CZ);
  group.add(surface2);

  // ---------- canvas textures: stream streaks + foam ring ----------
  function streakTexture() {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 256;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 64, 256);
    for (let i = 0; i < 46; i++) {
      const x = Math.random() * 64, len = 30 + Math.random() * 90;
      const y = Math.random() * 256, w = 1 + Math.random() * 2.2;
      const grad = g.createLinearGradient(0, y, 0, y + len);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(235,250,255,' + (0.35 + Math.random() * 0.45) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(x, y, w, len);
      if (y + len > 256) g.fillRect(x, y - 256, w, len);   // wrap seamlessly
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function foamTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.0)');
    grad.addColorStop(0.55, 'rgba(240,252,255,0.75)');
    grad.addColorStop(0.8, 'rgba(230,248,255,0.25)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const streakTex = streakTexture();
  const foamTex = foamTexture();

  // ---------- four streams from the lion mouths ----------
  const streams = [];
  const splashes = [];
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2;
    const dir = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
    const p0 = new THREE.Vector3(CX, 1.13, CZ).addScaledVector(dir, 0.34);
    const p1 = new THREE.Vector3(CX, 1.04, CZ).addScaledVector(dir, 0.74);
    const p2 = new THREE.Vector3(CX, WATER_Y, CZ).addScaledVector(dir, 0.97);
    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);

    const tex = streakTex.clone();
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1.6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xcfeef7,
      metalness: 0,
      roughness: 0.08,
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 0.82,
      alphaMap: tex,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.024, 7, false), mat);
    tube.renderOrder = 2;
    group.add(tube);
    streams.push({ tex, phase: k * 0.37 });

    // splash ring + foam patch at the impact point
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.012, 6, 20),
      new THREE.MeshBasicMaterial({ color: 0xeafaff, transparent: true, opacity: 0.55, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(p2).setY(WATER_Y + 0.012);
    ring.renderOrder = 3;
    group.add(ring);
    const foam = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 20),
      new THREE.MeshBasicMaterial({ map: foamTex, transparent: true, opacity: 0.8, depthWrite: false })
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.copy(p2).setY(WATER_Y + 0.008);
    foam.renderOrder = 3;
    group.add(foam);
    splashes.push({ ring, foam, phase: k * 1.17 });
  }

  // ---------- gentle spray: a few dozen droplets per stream ----------
  const DROPS = 160;
  const dropGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(DROPS * 3);
  const seed = new Float32Array(DROPS);
  for (let i = 0; i < DROPS; i++) seed[i] = Math.random();
  dropGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const drops = new THREE.Points(dropGeo, new THREE.PointsMaterial({
    color: 0xdff6fc, size: 0.02, transparent: true, opacity: 0.7,
    depthWrite: false, sizeAttenuation: true,
  }));
  drops.renderOrder = 3;
  group.add(drops);

  scene.add(group);

  // ---------- per-frame animation ----------
  function update(ts) {
    const t = ts * 0.001;
    norm1.offset.set(t * 0.018, t * 0.031);
    norm2.offset.set(-t * 0.042, t * 0.012);
    for (const s of streams) s.tex.offset.y = -(t * 1.35 + s.phase) % 1;
    for (const s of splashes) {
      const ph = (t * 1.4 + s.phase) % 1;
      const r = 0.07 + ph * 0.24;
      s.ring.scale.set(r / 0.09, r / 0.09, 1);
      s.ring.material.opacity = 0.5 * (1 - ph);
      s.foam.material.opacity = 0.55 + 0.25 * Math.sin(t * 5 + s.phase * 7);
    }
    const p = drops.geometry.attributes.position.array;
    for (let i = 0; i < DROPS; i++) {
      const sd = seed[i];
      const k = i % 4;
      const a = k * Math.PI / 2;
      const ph = (t * (0.8 + sd * 0.5) + sd * 7) % 1;
      const rr = 0.34 + ph * 0.66 + (sd - 0.5) * 0.06;
      const spread = (sd - 0.5) * 0.1 * ph;
      p[i * 3] = CX + Math.cos(a) * rr - Math.sin(a) * spread;
      p[i * 3 + 1] = 1.13 - 0.38 * ph * ph - sd * 0.05;
      p[i * 3 + 2] = CZ - Math.sin(a) * rr - Math.cos(a) * spread;
    }
    drops.geometry.attributes.position.needsUpdate = true;
  }
  return { update };
}
