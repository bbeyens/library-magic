---
name: threejs-polish-builder
description: Close concrete visible gaps between an approved GDD target and the current Three.js runtime during game-polish.
---

# Three.js Polish Builder

Require the active GDD, approved target image(s), and `PLAYABLE_READY`.

Obey the `game-polish` Blender decision before editing. When authored 3D is
required, load `blender-mcp` and require a proved live connection. A connection
failure blocks polish; it never authorizes a procedural or generator fallback.
When Blender is skipped, the GDD must state why no current gap needs it.

1. Compare the runtime and target at the same viewport/camera.
2. Name the largest visible gap: camera, scale, composition, silhouette,
   lighting/material separation, density/depth, HUD overlap, or mobile fit.
3. Load at most one focused reference and the selected asset owner when useful.
4. Implement the highest-impact owner change.
5. Capture one representative runtime result and iterate on the next largest
   gap.
6. Run `npm test`; measure performance only when the change affects it.
7. Record result, screenshot paths, and remaining gaps directly in the GDD.

Do not create scorecards, packets, IDs, plans, builds, or mandatory asset jobs.
