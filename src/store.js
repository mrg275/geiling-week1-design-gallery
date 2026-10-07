// Data phase D2: localStorage persistence (key geiling-library-v1).
// Card scheduling state, notes and reflections survive reload; the inline mock
// data acts as the seed. D3 (real backend) swaps this module, not app code.
import { allCards } from './core.js';
import { WORKS, REFLECTIONS } from './data.js';

var KEY = 'geiling-library-v1';

function snapshot() {
  return {
    v: 1,
    savedAt: Date.now(),
    cards: allCards.map(function (c) {
      return { id: c.id, ease: c.ease, interval: c.interval, reps: c.reps, due: c.due };
    }),
    notes: WORKS.map(function (w) { return { id: w.id, notes: w.notes }; }),
    reflections: REFLECTIONS.slice()
  };
}

export function saveState() {
  try { localStorage.setItem(KEY, JSON.stringify(snapshot())); } catch (e) { /* private mode etc. */ }
}

export function restoreState() {
  var s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return; }
  if (!s || s.v !== 1) return;
  try {
    var byId = {};
    allCards.forEach(function (c) { byId[c.id] = c; });
    (s.cards || []).forEach(function (sc) {
      var c = byId[sc.id];
      if (c) { c.ease = sc.ease; c.interval = sc.interval; c.reps = sc.reps; c.due = sc.due; }
    });
    (s.notes || []).forEach(function (sn) {
      for (var i = 0; i < WORKS.length; i++) {
        if (WORKS[i].id === sn.id && sn.notes) WORKS[i].notes = sn.notes;
      }
    });
    if (s.reflections && s.reflections.length) {
      REFLECTIONS.length = 0;
      s.reflections.forEach(function (r) { REFLECTIONS.push(r); });
    }
  } catch (e) { /* corrupt state: keep seeds */ }
}

// The panels mutate WORKS/REFLECTIONS/cards inline (verbatim v25 code), so
// persistence hooks on at the overlay boundary: any interaction inside a
// panel schedules a debounced snapshot.
var t = null;
function queueSave() { clearTimeout(t); t = setTimeout(saveState, 600); }
export function autosaveOn() {
  var ov = document.getElementById('overlay');
  if (!ov) return;
  ['click', 'keyup', 'change'].forEach(function (ev) {
    ov.addEventListener(ev, queueSave, true);
  });
  window.addEventListener('beforeunload', saveState);
}
