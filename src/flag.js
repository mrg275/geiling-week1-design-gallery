// American flag hung over the Collection Map (north wall), with live cloth
// motion. The flag texture is generated to official proportions (1:1.9 fly,
// 7/13 union, 50 stars in 9 alternating rows) on a canvas, with a woven-fabric
// overlay; the mesh ripples with traveling waves and recomputes normals each
// frame so the folds shade realistically. Runtime-only; nothing baked.

export function buildFlag(THREE, scene) {
  // ---------- official-geometry flag texture ----------
  function flagTexture() {
    const W = 1900, H = 1000;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const RED = '#B22234', WHITE = '#F5F4F0', BLUE = '#3C3B6E';
    const stripe = H / 13;
    for (let i = 0; i < 13; i++) {
      g.fillStyle = i % 2 === 0 ? RED : WHITE;
      g.fillRect(0, i * stripe, W, stripe + 1);
    }
    const uw = 0.76 * H * (1900 / 1000) * (1000 / 1900);        // union fly = 0.76 x hoist
    const UW = 0.76 * H, UH = (7 / 13) * H;
    g.fillStyle = BLUE;
    g.fillRect(0, 0, UW, UH);
    // 50 stars: 9 rows alternating 6 / 5
    function star(cx, cy, r) {
      const rin = r * 0.382;
      g.beginPath();
      for (let k = 0; k < 10; k++) {
        const ang = -Math.PI / 2 + k * Math.PI / 5;
        const rr = k % 2 === 0 ? r : rin;
        const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
        if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.fill();
    }
    g.fillStyle = WHITE;
    const gx = UW / 12, gy = UH / 10, r = 0.0308 * H * 2 * 0.52;
    for (let row = 0; row < 9; row++) {
      const n = row % 2 === 0 ? 6 : 5;
      const x0 = row % 2 === 0 ? gx : 2 * gx;
      for (let k = 0; k < n; k++) star(x0 + k * 2 * gx, gy * (row + 1), r);
    }
    // woven-fabric feel: fine threads + soft sheen
    g.globalAlpha = 0.05;
    g.strokeStyle = '#000';
    for (let y = 0; y < H; y += 3) {
      g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke();
    }
    g.globalAlpha = 0.04;
    for (let x = 0; x < W; x += 3) {
      g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke();
    }
    g.globalAlpha = 1.0;
    const sheen = g.createLinearGradient(0, 0, 0, H);
    sheen.addColorStop(0, 'rgba(255,255,255,0.06)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
    sheen.addColorStop(1, 'rgba(0,0,0,0.07)');
    g.fillStyle = sheen;
    g.fillRect(0, 0, W, H);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  const group = new THREE.Group();
  group.name = 'Fx_Flag';

  // placement: north wall (z = -34, room is +z), centered over the map frame
  const FW = 3.42, FH = 1.8;                 // 1.9 : 1
  const CXF = 0, TOP = 8.52, WALL_Z = -33.80;   // clears the Collection Map (top 6.22)

  // ---------- brass rod + finials + brackets ----------
  const brass = new THREE.MeshStandardMaterial({ color: 0xb08d4a, metalness: 1.0, roughness: 0.32, envMapIntensity: 1.1 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, FW + 0.5, 10), brass);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(CXF, TOP + 0.03, WALL_Z + 0.10);
  group.add(rod);
  for (const s of [-1, 1]) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), brass);
    ball.position.set(CXF + s * (FW / 2 + 0.27), TOP + 0.03, WALL_Z + 0.10);
    group.add(ball);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.16, 8), brass);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(CXF + s * (FW / 2 + 0.1), TOP + 0.03, WALL_Z + 0.02);
    group.add(arm);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.03), brass);
    plate.position.set(CXF + s * (FW / 2 + 0.1), TOP + 0.03, WALL_Z - 0.04);
    group.add(plate);
  }

  // ---------- the cloth ----------
  const SEGX = 72, SEGY = 28;
  const geo = new THREE.PlaneGeometry(FW, FH, SEGX, SEGY);
  const mat = new THREE.MeshStandardMaterial({
    map: flagTexture(),
    side: THREE.DoubleSide,
    metalness: 0.0,
    roughness: 0.82,
    envMapIntensity: 0.35,
  });
  const flag = new THREE.Mesh(geo, mat);
  flag.position.set(CXF, TOP - FH / 2, WALL_Z + 0.12);
  group.add(flag);
  scene.add(group);

  const base = geo.attributes.position.array.slice();

  function update(ts) {
    const t = ts * 0.001;
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const x = base[i], y = base[i + 1];
      const u = x / FW + 0.5;                 // 0 left .. 1 right
      const v = 0.5 - y / FH;                 // 0 top .. 1 bottom (free edge)
      const hang = 0.15 + 0.85 * v;           // bottom moves most, rod edge held
      const edge = 0.6 + 0.4 * Math.abs(u - 0.5) * 2;
      const w1 = Math.sin(u * 7.5 + t * 1.6 + v * 2.0) * 0.045;
      const w2 = Math.sin(u * 13.0 - t * 2.3 + v * 5.0) * 0.018;
      const w3 = Math.sin(v * 9.0 + t * 1.1 + u * 3.0) * 0.012;
      p[i + 2] = (w1 + w2 + w3) * hang * edge;
      p[i + 1] = base[i + 1] - 0.025 * hang * Math.sin(u * 5 + t * 1.3) * edge;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  }
  return { update };
}
