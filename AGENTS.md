# AGENTS.md — The Geiling Library

## Mission

Build the **best possible personal digital library** for **Matthew Geiling** (the repo owner), and him alone. Single user, no auth, no multi-tenant concerns. All design and copy assumes the reader is Matthew reviewing his own knowledge.

The product: a first-person, **walkable 3D library hall** that holds everything Matthew consumes (books, essays, articles, podcasts) and makes him actually retain it through active learning — flashcards, spaced repetition, recall testing, reflection writing, a knowledge graph, and serendipitous resurfacing. The library is not a metaphor pasted onto a dashboard; the room *is* the interface. Features live where they would in a real library: works on shelves, recall at the writing desk, quotes at the fountain, the graph on the wall.

The original homework phase (a 25-version design gallery) is **complete**. v25 won. This repo is now that product.

## Architecture — three layers

1. **3D scene** — authored in **Blender** (the master file is `blender/library.blend`), lighting **baked** with Cycles, exported as **glTF** to `assets/library.glb`, rendered in the browser with **three.js/WebGL**. Nobody needs Blender to *use* the app; Blender is the design tool, the browser is the delivery medium.
2. **UI layer** — the frosted-glass DOM panels from v25, overlaid on the WebGL canvas. The glass panel system, HUD dock, command-palette menu, toast, SVG knowledge graph, and floor plan are reused **verbatim** from `legacy/index.html`. Design tokens are the CSS variables at `legacy/index.html` lines ~9–28: parchment `#f8f2e3`, ink `#2a2114`, oak `#7a5a38`/`#4c3820`, brass `#b08d4a`/`#ddbc78`, banker's-lamp green `#2e4634`, oxblood `#6d3328`. Typeface: Georgia / Iowan Old Style / Palatino (serif only). Aesthetic: collegiate-gothic Harper Library + visionOS liquid glass.
3. **Data & logic layer** — the `WORKS` data model and SRS scheduler, ported unchanged from v25 (see Data model below).

### Repo map

```
/index.html        the app (CSS-3D v25 build today → three.js app when the rebuild lands)
/legacy/           frozen v25 CSS-3D build — the fallback "Classic view". NEVER break it.
/gallery/          archived design history (v01–v24 + the iteration gallery)
/blender/          library.blend — master 3D scene, source of truth for the hall
/assets/           exported runtime assets: library.glb, KTX2 textures, lightmaps
/src/              three.js app modules (main, scene, controls, picking, data, srs, ui)
/vendor/three/     vendored, pinned three.js ES modules
/vercel.json       redirects keeping old /vNN/ URLs alive
```

## Dependency rules (replaces the old "no frameworks" rule)

- **Allowed runtime dependency: three.js only.** Pinned version, loaded as ES modules via an import map, **vendored into `/vendor/three/`** (no CDN dependence at runtime, no npm install for the app).
- **No build step.** The deployed site is the repo, served as static files on Vercel (Hobby). Local dev is `python3 -m http.server`.
- Dev-only CLI tools (e.g. `npx @gltf-transform/cli` for Draco/KTX2 compression) are fine; they must never become runtime dependencies.
- Any new runtime dependency requires explicit justification in the commit message that adds it. No React/Vue/Tailwind/bundlers — the UI layer stays hand-written HTML/CSS/vanilla JS.

## Data model

Shape of a work (keep this exact shape; it is shared by the legacy app and the three.js app):

```js
{ id, type /* book|essay|article|podcast */, title, short, author, mono, pub, consumed,
  tags: [], spine, dark, cover,
  notes: [{ d, t }], quotes: [], cards: [{ q, a, seed? }] }
```

SRS card state: `{ ease, interval, reps, due }` with the `nextState` grading contract from v25 (`legacy/index.html` ~line 1288): four grades 0–3 (Again / Hard / Good / Easy), ease range 1.3–2.8, grade 0 = retry in 5 minutes.

### Data phases

- **D1 (current):** hardcoded mock data inline in the page.
- **D2 (next):** localStorage persistence under key `geiling-library-v1` — card scheduling state, notes, reflections survive reload; mock data is the seed. Still fully static.
- **D3 (future, named phase — not yet in scope):** a real backend with Matthew's actual library data. Keep the data layer behind a small module boundary (`src/data.js`) so D3 swaps storage, not app code.

## Blender pipeline conventions

- **Units: 100 CSS units = 1 m.** The hall is 3400×6800 CSS units with wall height 860 → **34 m × 68 m, 8.6 m walls**. Derive all other dimensions from v25's layout constants (`legacy/index.html` ~lines 1309–1375) and the floor-plan generator (~line 2540), which encodes every object's authoritative footprint.
- **Scene is authored live via the Blender MCP connection** (`execute_blender_code`, verified with `look`). The master file is `blender/library.blend`; commit it (it is the source asset).
- **Naming:** `Hall_Shell`, `Window_W_01`…, `Bookcase_W_01`…, `Spine_<workId>`, `Plinth_01`–`04`, `Statue_Thinker` / `Statue_Orator` / `Statue_Discobolus` / `Statue_Owl`, `Fountain`, `Desk_Writing`, `Case_Trophy`, `Frame_Art_01`–`06`.
- **Interactivity:** every clickable object carries a Blender **custom property `act`** whose value is exactly a v25 `data-act` string (`work:<id>`, `open:flash`, `go:fountain`, `plinth:2`, `statue:0`, …). glTF export preserves custom properties as `extras`; the three.js raycaster reads `userData.act` and dispatches into the same action router the DOM uses.
- **Lighting is 100% baked.** Cycles: sun through the 12 arched windows, warm desk lamps, soft fill. Bake to lightmap atlases on a **second UV channel (UV2)**, non-overlapping unwrap per bake group (shell / bookcases / furniture / statues), 2–4 atlases at 2048–4096 px. Export **no lights**; three.js adds at most an ambient/hemisphere light.
- **Export:** single `assets/library.glb` — glTF 2.0, +Y up, transforms applied, Draco mesh compression, KTX2/BasisU textures (compressed offline with `npx @gltf-transform/cli`).
- **Budgets:** `library.glb` ≤ 25 MB download · static hall ≤ 150k triangles · 60 fps on Retina MacBook Chrome (the machine that exposed the CSS-3D compositor bug) · < 3 s load on broadband · renderer pixel ratio capped at 2.

## Roadmap

Phases 0–5 of the migration are **done** (Oct 2026): the hall is modeled in `blender/library.blend`, baked by `blender/bake_export.py` (headless, CPU — see Known pitfalls), and served at `/` as the three.js app with localStorage persistence (D2), deployed on Vercel.

### Next: quality pass

- **Statues & busts:** refine the primitive-composed marble figures (or enable an MCP 3D generator / Poly Haven and replace them); engraved plaque textures.
- **Bake quality:** raise lightmap samples + denoise (current: 64 samples, no denoise — slight blotch on large surfaces); real window vistas (mountain/lake backdrop) instead of white emissive glass; sunbeam volumes.
- **Surface detail:** wood-plank floor normal/roughness maps, coffered-ceiling frescoes (paint in Blender or bake the v25 SVG), book-spine title textures for the 13 works.
- **Assets:** KTX2/BasisU texture compression (needs KTX2Loader + transcoder vendored); current payload ~5 MB via WebP + quantization.
- **Data phase D3:** real backend for Matthew's actual library.

### Known pitfalls (hard-won — do not rediscover)

- `gltf-transform optimize` **joins nodes and destroys the `act` extras** — use `webp` + `quantize` commands only.
- Metal GPU Cycles bakes segfault while the interactive Blender session holds the GPU; `bake_export.py` runs CPU-only (full pipeline ≈ 2 min).
- In Blender MCP execs, call `bpy.context.view_layer.update()` after adding modifiers before depsgraph evaluation; prefer direct bmesh construction over boolean modifiers (flaky through MCP, worse lightmap topology).
- The 3D click-picking listener must sit on `#viewport`, not the canvas: the drag-look handler takes pointer capture on `#viewport`, which retargets clicks.
- **Vertex-colored (vista/fx) meshes:** author colors **linear** (glTF COLOR_0 is linear; the scene flag `vista_colors_linear` marks the conversion done); export needs `export_vertex_color='ACTIVE'` (the exporter's material scan misses Color Attribute nodes and silently writes white); and **never run `gltf-transform quantize`** on this scene — it scrambles COLOR_0. Compression is WebP-only.
- `blender/bake_export.py --resume` reuses the existing baked PNGs and re-exports in ~30 s — use it for any scene tweak that doesn't change lighting.
- Blender 5 compositor: `scene.node_tree` is gone; denoising runs through `scene.compositing_node_group` (the script falls back to a plain save if that API shifts again).
- **Never compare bpy structs with `is`.** Blender rebuilds the Python wrapper on every access, so `for p in mesh.polygons: if p is saved_face` is *always* False and `l.to_node is node` silently reports "no links". Compare `p.index`, `.name`, or use `==`. This has produced two different silent no-op bugs (a UV remap that hit every face, and a bogus "material is unwired" diagnosis).
- Wall-hung frames follow a single hanging line: bottoms at **z 2.48**, clear of the wainscot chair rail (2.30). Anything hung on a wall that also carries the blind arcade (N-wall piers x ±9.17–12.23, S wall x ±1.95–12.63, and the bookcase runs) must keep its top under the stringcourse at **4.60**; elsewhere the plaster is clear up to the picture rail at 10.16.

## Verification norms

- Every Blender scene change is checked with MCP `look` renders (eye height 1.7 m from the entrance and each aisle) before moving on; dimensions and triangle budgets asserted via `execute_blender_code`.
- Every app change is tested in a real browser over a local server (`python3 -m http.server`) before committing — walk the hall, click the affected `act` targets, and for SRS changes run a full grading cycle.
- `/legacy/` and `/gallery/` must always keep working; the app links to `/legacy/` as "Classic view".

## Conventions

- The legacy and gallery pages stay fully self-contained (inline styles/scripts); do not refactor them.
- The three.js app uses plain ES modules in `/src/` — small files, one concern each, no transpilation.
- Copy addresses Matthew directly; keep the library's voice (engraved plaques, catalog cards, "The Geiling Papers") consistent with v25.
