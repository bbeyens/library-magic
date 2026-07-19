---
description: Build the complete playable mechanical version of an approved game GDD with basic presentation and fast proof. Use when the user invokes game-build.
name: game-build
metadata:
  skiller:
    source: .agents/rules/game-build.mdc
---

# Game Build

1. Read the named or latest `DESIGN_READY` GDD.
2. Check for `VISUAL_READY` targets or exact GDD reference pixels with
   provenance, one visual job per source, locked scope, and acceptance criteria.
   Treat either as binding. A new or materially changed visual family requires
   `game-visual` and `IMAGE_INPUT_PROOF`; never improvise art direction from
   words. Mechanical placeholders and micro-fixes that preserve an accepted
   family may record `VISUAL_TARGET_NOT_PROVIDED` and continue.
3. When the GDD needs generated 2D assets (icons, GUI art, decals, plates):
   consume the `ASSETS_READY` manifest when one exists; otherwise generate
   them directly in this lane with `threejs-image-generator` (Nano Banana /
   Gemini, probe the key first) and record the resulting manifest (paths +
   prompts) as `ASSETS_READY` in the GDD. `game-visual` remains optional for an
   isolated asset inside an accepted visual family, but is mandatory when the
   pack establishes or materially changes that family.
4. Ask the game Director for only the owners required by that GDD.
   When the GDD adds, replaces, rerigs, animates, or materially repairs any 3D
   runtime asset, load `game-3d-asset-pipeline`. Let it choose the static/held,
   biped-Mixamo, non-biped-authored, or procedural branch and own the complete
   reference/target → provider → BlenderMCP when required → GLB/factory
   contract → catalog → validation harness → runtime-proof flow. Do not split
   that work across
   generator, rigging, Blender, and proof calls by hand.
5. Implement the complete mechanical/basic-presentation loop without another
   approval pause. Every visible surface added or changed—2D/3D assets,
   materials, lighting, animation, VFX, water, vegetation, shadows, and
   post-processing—follows the active GDD's visual contract and exact reference
   jobs. Basic presentation is not a license for style drift, and the template
   contributes no default rendering or interface family.
6. Register every new runtime asset in the World Builder catalog so the
   sandbox stays in sync with the game. If the project has no builder/catalog,
   invoke `world-builder` to bootstrap the smallest dev-only harness first.
   Record provenance, provider task ids when applicable, waiver, clips, and the
   shared procedural factory contract. An asset that ships in the game but is
   absent from the catalog is incomplete.
7. Materialize the GDD's critical 3D proof as a reproducible validation state.
   Compare at most three variants under the locked
   front/right/back/three-quarter cameras, pose phase, focus, and debug mode;
   extend the lab with the smallest purpose-specific control when the named
   failure mode is otherwise invisible. Exploratory comparisons may expose
   red losers, but the final accepted selection must contain only shipping
   assets and read `PASS` for geometry, triangle budget, declared clips, and
   shared pose. Record the full URL, state, verdict, and any waiver in the GDD.
   Use `HARNESS_NOT_APPLICABLE: <reason>` only for non-catalog surfaces and
   name their runtime capture instead.
8. Prove logic with the project's fast test lane and use bounded runtime
   captures when visual judgment matters. After the last relevant code change
   and reload, open the exact final capture at original resolution and write a
   `PASS` or `FIX` verdict against the user's request and locked reference.
   Tests, diagnostics, DOM state, bboxes, masks, asset loading, and catalog
   validation are supporting evidence only; none overrides visible clipping,
   occlusion, wrong contact, bad composition, or another pixel-level defect.
   Any accepted visual surface records its GDD scorecard, harness evidence,
   inspected capture, and verdict. The builder
   harness does not replace the in-game capture: one proves the asset; the
   other proves integration.
9. Record `PLAYABLE_READY|BLOCKED` directly in the GDD.
10. End the final report with a human playtest script: run URL, controls, then
   a short ordered flow that exercises every shipped mechanic once (including
   the failure/recovery path and the quest or objective end-to-end), with
   rough timings and 2-4 judgment questions the user should answer while
   playing (pacing, difficulty, readability). The user must be able to test
   the build without asking what to do next.

Do not start production polish or create parallel planning/proof documents.

## Runtime capture & visual tuning (do / don't — learned it. 16)

DO:
- Review the proof after capturing it: open the exact last image at original
  resolution, name the visible subject and likely failure modes, then record
  `PASS` or `FIX`. A capture script succeeding proves file production, not the
  rendered result; never report completion from automation output alone.
- Make authored proof presets readiness-driven and expose the requested phase,
  active socket/state, and loaded dependencies in diagnostics. A short fixed
  retry window can expire during a cold GLB load and silently capture idle or
  the previous socket; reject the capture unless diagnostics match the named
  proof state.
- Capture proofs from the canvas itself: inside a `requestAnimationFrame`
  callback, `canvas.toDataURL('image/png')` then POST to a throwaway local
  HTTP server that writes into `docs/gdd/proofs/` (simple POST = no CORS
  preflight; the server response doesn't need to be readable).
- Bring the game TAB to the front first — active tab of the frontmost window,
  not just `activate`: a non-active tab suspends rAF entirely (game crawls on
  its setInterval fallback, capture watchers never fire). AppleScript over
  Chrome windows/tabs matching the EXACT dev URL (parallel sessions keep
  near-identical tabs open); verify with a rAF tick counter before trusting
  a "no frames" result.
- Move the pointer off hover-expanded dev controls before the final frame — a
  deterministic preset still produces a polluted proof when its debug plate
  opens under the capture cursor.
- Downscale before `toDataURL`: draw the WebGL canvas into a small 2D canvas
  (~1100 px) inside the same rAF, then encode JPEG — full-res hi-DPI encodes
  (~3400 px) per frame freeze the renderer and time out CDP evaluate.
- Never promote a semantic DOM pass into responsive visual proof. If a page
  screenshot times out under a viewport override, reset the override and record
  the visual state as deferred instead of claiming the layout passed.
- Capture transient VFX event-driven: poll
  `__THREE_GAME_DIAGNOSTICS__.scene().getObjectByName('<vfx>')` each rAF and
  only capture while the node exists — no blind interval burst to sift.
- Measure a render-pass cost with identical URL A/B reloads plus non-blocking
  `EXT_disjoint_timer_query_webgl2` samples; `renderer.info.render.calls` may
  stay identical across shadow ON/OFF and cannot isolate the GPU pass.
- When browser inspection cannot see custom page globals, mirror one bounded
  DEV diagnostics JSON snapshot onto a stable `documentElement.dataset` field
  at low frequency; do not turn every frame into DOM serialization.
- Cap the local simulation delta of 2–4 frame contact glyphs (for example at
  `1/30`) or guarantee one rendered frame before aging them. A background-tab
  hitch or capture stall must not advance a freshly spawned transient past its
  visible lifetime before its first render; keep gameplay time truthful and
  cap only the cosmetic effect.
- Never infer grounded/airborne state from actor world Y on uneven terrain —
  expose the authoritative runtime flag in dev diagnostics and correlate VFX
  activations against that flag.
- Water foam/spray VFX must be unlit: `MeshBasicMaterial` white with
  `toneMapped:false` (like the wake rings) — a white `MeshLambertMaterial`
  lit from above reads concrete-gray, never foam.
- Pool transient VFX with deforming geometry per slot, not with one shared
  mutable buffer: keep immutable canonical positions for each slot and rewrite
  that slot's existing attribute on update. Shared mutable geometry makes
  concurrent effects overwrite each other; allocating a fresh geometry on
  spawn only hides the ownership bug behind GC churn.
- Tune attach/transform values LIVE: expose the object as a temporary
  `window.__x` global, iterate with `javascript_tool` + zoom screenshots
  (one reload total), then hard-code the values and delete the global.
  Never tune via edit → HMR → screenshot cycles.
- Batch browser steps (`browser_batch`: navigate + wait + capture) when
  timing matters: per-call latency (~2-4 s) exceeds most one-shot clips.
- After repeated `Page.captureScreenshot` timeouts on an otherwise responsive
  controlled tab, open a fresh controlled tab and continue there — retrying the
  poisoned tab wastes the proof window and usually times out again.
- Split `/builder` proof captures by height family: a tall landmark forces the
  shared camera to make grass, pickups, and other small props unreadable — keep
  one mixed batch for synchronized budgets, then capture each scale family
  separately for visual judgment.
- Normalize actor spacing before tuning a dialogue or interaction camera: dev
  presets and teleport shortcuts can place the player inside the subject, so
  first push them to a minimum staging distance, then frame their midpoint.
  Camera offsets cannot repair two models occupying the same point.
- Treat a camera profile as timing/composition grammar, not one universal
  position: inspect line-of-sight in every authored interaction and override
  its world side when a prop, tent, tree, or crowd blocks the subjects.
- Prove each authored camera endpoint algebraically before visual tuning:
  `pitch = atan(verticalDistance / horizontalDistance)` and sky margin is
  `verticalFov / 2 - pitch`. Require a positive margin only when horizon/sky is
  part of the target; require a deliberate negative margin for a ground-only
  2.5D plateau. Record the intent instead of treating either sign as universal.
- When world-cardinal movement must stay north-up while zoom transitions from
  fixed 2.5D to a chase camera, split one zoom input into a full-range framing
  curve and a later gated direction-follow curve: the first wheel step changes
  distance/pitch/FOV without azimuth, then look-ahead and smoothed behind-actor
  follow engage only close-up. Interpolate orbit radius and pitch; rotating on
  the first step makes cardinal input read diagonally even when its world math
  is correct.
- Do not bind close third-person mouse look to a held mouse button when left and
  right click own gameplay actions. At a named 2.5D-to-3D threshold, capture the
  pointer from the first real gameplay gesture that can legally activate it
  (movement key or attack), and still execute that gesture in the same frame;
  never burn a neutral click just to activate the camera. Consume relative X/Y
  motion directly, keep vertical look persistent but child-safe with explicit
  pitch bounds and no flip, fade manual pitch out with the close-camera blend,
  and release on modal or wide mode. If left click becomes attack, hard-cut
  canvas click-to-move, held steering, and auto-interaction in every camera
  mode; keep map/minimap navigation explicit UI if still wanted. Prove
  pointer-lock, pitch clamps, and global click ownership as one input contract.
- Reactivate faded Three.js `AnimationAction`s explicitly: `fadeOut()` may set
  `enabled=false`, and `setEffectiveWeight(1).play()` does not re-enable them —
  set `enabled=true` and `paused=false` first; fully stop one-shots at weight 0.
- Prove animation handoffs from mixer state, not video alone: assert the next
  action is enabled/running at weight 1 with advancing time, the finished action
  is disabled at weight 0, and the proof includes held then released movement.
- Model equipped/carry state separately from transient one-shot actions. An
  attack finishing should return to an explicit held-ready state, not silently
  stow the prop; prove first-use draw, repeated-use without redraw, manual stow,
  and every contextual forced-stow path as distinct transitions.
- Expect parallel-session HMR full reloads: they re-run `?animproof=` and
  dev presets, so a "stuck" or repeating animation is usually a reload, not
  your bug — check timestamps/console before touching code.
- Let `TextureLoader.load()` mark real browser textures ready when their image
  arrives. Set `needsUpdate` manually only on synthetic `DataTexture`
  fallbacks; forcing it on an unresolved image emits renderer warnings.
- Keep a graphic accent attached to deforming flat geometry on a deliberate
  front render layer (or deform both together). A tiny z offset alone lets the
  base wave intermittently occlude the accent.
- Freeze the authoritative simulation tick behind every full-screen modal,
  including inventory, crafting, map, and settings. Hiding the HUD or zeroing
  movement is insufficient when time, needs, hazards, or NPC state can still
  drift while the player reads.
- Do not memoize UI derived from a mutable gameplay object by object identity.
  In-place store updates keep the reference stable and freeze counts/details;
  derive on each subscribed render or depend on an explicit store version.
- Route every sim time jump (sleep, faint, teleport) through the same
  clock-advance helper as the per-frame tick, and anchor "N time after event
  X" deadlines to the computed in-interval moment of X, not the jump edges —
  a coarse jump otherwise diverges from ticked play (ember-death deadline of
  the fed campfire, iteration 21).

DON'T:
- MCP screenshot `save_to_disk` (no file lands), macOS `screencapture`
  (captures the frontmost window — often another session's), bare
  `toDataURL` outside rAF (blank buffer: `preserveDrawingBuffer` is false),
  or piping base64 through `javascript_tool` results (the bridge blocks
  encoded payloads).
- Don't debug pre-existing breakage in surfaces the parallel session owns
  (magenta placeholder boxes in the builder = unknown kind/factory,
  `src/builder/catalog.ts`): verify with a remove/restore of your own diff,
  report, move on.
