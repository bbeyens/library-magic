# Browser Game Polish Quality Gate

- The game is immediately playable and not presented as a landing page.
- The core loop has objective, scoring/progress, fail/retry, pacing, and feedback.
- Screenshots do not read as a collection of default primitives, debug HUDs, or generic placeholder panels.
- Unadorned boxes, cones, spheres, flat planes, and stretched buildings are not the dominant art language unless explicitly intentional.
- UI is genre-specific, compact, readable during motion, responsive, and includes needed modal states.
- Player, threats, rewards, and objectives have distinct silhouettes and material/feedback language.
- Player/hero asset has primary silhouette, secondary structure, tertiary detail, material contrast, and state feedback.
- Every asset assigned to BlenderMCP has editable `.blend` source, browser-ready
  export, viewport proof, and in-game integration proof; disconnection never
  caused a procedural downgrade.
- Obstacle/enemy set includes at least three authored variants with unique telegraphs.
- Reward/interactable set includes at least two authored variants with collection/interaction feedback.
- World kit includes reusable modules and does not rely on one repeated skyline/block/road primitive.
- The scene has foreground, midground, and background depth instead of one flat play lane.
- Lighting, shadows, fog, and post-processing clarify depth and mood without hiding gameplay.
- Procedural models use the authored factories, shared material kit, reusable prop kits, and collision proxies from `references/implementation-blueprint.md` and `references/technical-art.md`.
- Movement, camera, speed, impact, and restart loop feel tuned through play, not just configured.
- Audio/visual feedback exists for core actions and state transitions.
- Mobile viewport preserves framing, safe areas, touch targets, and text fit.
- Renderer diagnostics from `references/technical-art.md` are reviewed when visual fidelity changes.
- Semantic screenshot comparison passes against the locked target for the
  current GDD scope.
- `npm test` and bounded target-relative captures pass.
- A screenshot critique identifies no unresolved high-impact placeholder-quality blockers.
- If any premium surface was intentionally deferred, the final report says which one and why.
