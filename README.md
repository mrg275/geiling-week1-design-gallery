# The Geiling Library

A personal digital library: a first-person, walkable 3D library hall where Matthew Geiling stores, reviews, and synthesizes everything he reads and listens to — books, essays, articles, podcasts — with active-recall tools built into the room itself (flashcards, spaced repetition, recall testing, a reflection desk, a knowledge graph).

This began as a 25-version design exploration; **v25 won** and is now being rebuilt as a real 3D scene: modeled in Blender, lighting baked, exported to glTF, rendered in the browser with three.js. See [AGENTS.md](AGENTS.md) for the full architecture, conventions, and roadmap.

## Directory map

| Path | What it is |
|---|---|
| `/index.html` | The app. Currently the CSS-3D v25 build; becomes the three.js app when the Blender rebuild lands. |
| `/legacy/` | The frozen v25 CSS-3D build — the always-working fallback ("Classic view"). Never break it. |
| `/gallery/` | Archived design history: the original 25-version iteration gallery (v01–v24 live here). |
| `/blender/` | `library.blend` — the master Blender scene (source of truth for the 3D hall). |
| `/assets/` | Exported runtime 3D assets: `library.glb`, KTX2 textures, lightmaps. |
| `/src/` | The three.js app modules (renderer, controls, picking, data, SRS, UI). |
| `/vendor/three/` | Vendored, pinned three.js (ES modules). No npm, no build step. |
| `/vercel.json` | Redirects so pre-restructure URLs (`/v25/`, `/vNN/`) keep working. |

## Run locally

No build step. From the repo root:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. (A server is required — ES modules and glTF loading don't work from `file://`.)

## Deploy

Static files on Vercel (Hobby). Deploys are the repo as-is; there is no build command.
