// App entry: boots the WebGL hall, wires the badge, and falls back to the
// CSS-3D build at /legacy/ when WebGL is unavailable or loading fails.
import { updateBadge, $ } from './core.js';
import './panels.js';   // panels, menu, serendipity (self-wiring)
import './nav.js';      // camera state, input, click router, HUD buttons

function fail(msg) {
  const el = $('#loading');
  if (el) {
    el.innerHTML = msg +
      ' &mdash; <a href="legacy/index.html" style="color:#ddbc78">open the classic version</a>';
    el.style.opacity = '1';
  }
}

const canvas = document.getElementById('gl');
let ok = false;
try {
  ok = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
} catch (e) { ok = false; }

if (!ok) {
  fail('This browser has no WebGL');
} else {
  import('./scene3d.js')
    .then((m) => m.initScene(canvas, (f) => {
      const el = $('#loading b');
      if (el) el.textContent = Math.round(f * 100) + '%';
    }))
    .then(() => {
      const el = $('#loading');
      if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 600); }
    })
    .catch((e) => {
      console.error(e);
      fail('The hall failed to load');
    });
}

updateBadge();
