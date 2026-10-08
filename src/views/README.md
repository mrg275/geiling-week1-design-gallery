# Window view parameters

One module per view. The engine (`../windowviews.js`) hangs each photograph on a
plane outside a window and animates it. All region values are in **photo UV
space**: `v = 0` is the BOTTOM of the photo, `v = 1` the TOP (so a horizon
halfway up the image is `v = 0.5`). `u = 0` is the left edge.

| key | meaning |
|---|---|
| `id` | unique name |
| `texture` | path to the photo |
| `aspect` | photo width / height |
| `wall` `at` | which window: wall `W`/`E`/`N`/`S`, `at` = the along-wall coordinate (three.js: W/E use z, N/S use x) |
| `distance` | metres the plane sits beyond the wall (default 7) |
| `centerY` | height of the photo's centre in metres (default 7.0 — the window's cone centres near there) |
| `photoWidth` | how wide the photo is in world metres (default 13) |
| `cover` | plane oversize factor so the vista never peeks around the photo (default 2.8) |
| `shift` | `[u, v]` nudge of the photo inside the plane |
| `water` | `[bottomV, topV]` band that ripples |
| `waterAmp` `waterScale` `waterSpeed` | ripple strength / frequency / rate |
| `glitter` `glitterWidth` | sun-glitter intensity on the water, and how wide the glitter path is |
| `skyBottom` | everything above this v drifts as sky |
| `skyDrift` | drift amount (0.004 is a gentle breeze) |
| `foliage` | `[bottomV, topV]` band that sways; `[0,0]` disables |
| `sway` | sway amount |
| `sun` | `[u, v]` of the sun in the photo |
| `sunColor` `sunSize` `sunGlow` `rays` | bloom colour, radius, strength, god-ray strength |
| `exposure` `saturate` | final grade (1 = untouched) |

Tune by eye against the original photograph: the goal is that the still frame
looks like the photo and the motion looks like the place.

## Beyond the photo's edges

At a grazing angle the window's view cone reaches past the edges of the
photograph. The shader **mirrors** the coordinates (a triangle wave) rather than
clamping them, so the scene continues seamlessly — a mirror join is continuous,
whereas clamping stretched the edge pixel into long smears. The mirrored
surround is also progressively defocused and settled back, so it reads as
out-of-focus periphery rather than a visible repeat. The region masks share the
mirrored coordinates, so water/sky/foliage bands mirror along with the content.

`cover` still matters: it sets how large the *plane* is, and beyond the plane
you would see the library's own landscape. Keep `distance` short (≈4–5 m) so the
plate sits in front of the vista's trees and bushes — those are real geometry at
real depths, so a leak there is a depth collision, not a coverage problem.

All twelve windows carry a view (`extra.js` repeats the four places with
different crops). That is deliberate: seen at a grazing angle, the low-poly
landscape compresses its flat rings into stripes and reads as a broken view.
