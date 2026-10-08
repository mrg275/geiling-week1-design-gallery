# tools

Everything here is a build-time or test-time helper. None of it ships to the
browser. All of it was needed at least twice, which is why it lives in the repo
instead of a scratch directory.

Install once (used by the rasterisers and the harness):

```sh
npm install --no-save playwright-core sharp
```

They drive the copy of Chrome already on the machine (`channel: 'chrome'`), so
there is no browser download.

## Content

### `gen-data.js` — Notion → `src/data.js`

The single source of truth for how the Notion Knowledge Base maps onto the
library. Books, essays and the unread pipeline become `WORKS`; Convictions and
Misc. become `REFLECTIONS`.

```sh
node tools/gen-data.js src/data.js /tmp/data-new.js && cp /tmp/data-new.js src/data.js
```

It reads the *existing* `src/data.js` only to carry over the exhibits that do
not come from Notion (transcript, papers, trophies, art, plinths).

Edit the content arrays in this script, not `src/data.js`, for anything bulk.
Two rules are deliberately encoded here and should survive any rewrite:

- **Verbatim first.** A note's `t` is Matthew's exact wording, typos included.
  The tightened version goes in `tight`, alongside, never replacing it.
- **Read and unread never mix.** Anything started or finished is shelved on the
  west wall and removed from the east-wall queue, even where Notion still lists
  the same item in both places.

## Texture rasterisers

Each opens an HTML page in headless Chrome and screenshots one element into
`blender/textures/`. Re-run the matching one after changing content, then
re-export the glb (see below).

| file | produces | used by |
|---|---|---|
| `gen-spine.html` | `spine_<id>.png` | the engraved spines on the shelves |
| `gen-mural.html` | `mural_0/1/2.png` | the three ceiling frescoes (`?bay=0,1,2`) |
| `gen-transcript.html` | `transcript.png` | the framed UChicago record |

They expect their data injected in place of the `__WORKS__` / `__ROWS__`
placeholder — see the git history of this directory for the exact snippets.

**Spines, frescoes and view photos are skip-listed from baking**, so changing
them needs only a re-export, which takes seconds:

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b blender/library.blend \
  -P blender/bake_export.py -- --resume
```

A full bake (~10 min) is only required when geometry, materials or lighting
change. See AGENTS.md for the compression recipe that must follow either one.

## Verification

### `tour.js` — walk the hall and screenshot it

```sh
node tools/tour.js http://localhost:8743/ tools/stations.json out-dir
```

`stations.json` is a 32-stop tour of the whole hall. A station is
`{ name, x, z, yaw | lookAt: [x,z], pitch }` in CSS units where 100 = 1 m.
Read the PNGs afterwards — a blank or wrong frame is the whole point of running
it. It also writes `console-errors.txt`.

### `framediff.js` — prove something is actually animating

```sh
node tools/framediff.js <x> <z> <lookAtX> <lookAtZ> <pitch> out-prefix
```

Two shots ~1.1 s apart, reports how many pixels changed. Note the app applies a
permanent idle camera sway, so this reports motion even when nothing is
animating; for a clean measurement, freeze the camera and advance only `uTime`.
It is still the fastest way to catch a dead effect or z-fighting (which shows up
as several percent of pixels snapping every frame).
