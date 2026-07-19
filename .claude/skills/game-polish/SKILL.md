---
description: Polish a PLAYABLE_READY game against its approved GDD targets and references, including authored Blender assets when required.
name: game-polish
metadata:
  skiller:
    source: .agents/rules/game-polish.mdc
---

# Game Polish

Require the active GDD, `PLAYABLE_READY`, and a binding visual authority:
approved `VISUAL_READY` targets or exact GDD reference pixels with provenance,
locked scope, and acceptance criteria. If neither exists, stop with
`POLISH_BLOCKED: VISUAL_AUTHORITY_REQUIRED`. Never invent or silently move the
target set during polish.

1. Ask the game Director for only the owners needed by current visible gaps.
2. Load `game-3d-asset-pipeline` for any added, replaced, rerigged, animated,
   or materially repaired 3D runtime asset. It owns static/held,
   biped-Mixamo, non-biped-authored, and procedural routes through generation or
   authoring, GLB/factory validation, catalog, harness, tests, and runtime proof.
3. Decide whether any gap requires authored 3D. BlenderMCP is required for hero
   characters or creatures, primary buildings or landmarks, bespoke terrain or
   set pieces, hero props, authored animation, or fidelity that procedural
   runtime geometry cannot credibly match.
4. Skip BlenderMCP only when no current gap needs authored 3D and record the
   reason in the GDD. Once required, prove a live Blender connection or block
   with `POLISH_BLOCKED: BLENDER_MCP_REQUIRED`; never downgrade the lane because
   the connection is missing.
5. Consume the GDD's `ASSETS_READY` 2D manifest first. Generate missing isolated
   pieces with `threejs-image-generator` only when they preserve the approved
   family.
6. Judge every visible change—geometry, material, light, animation, VFX, water,
   vegetation, shadow, post effect, audio feedback, or interface—against the
   GDD's exact target/reference job. Record verdict, reason, and any visible
   waiver; a failed acceptance gate means fix or reject.
7. Register every new or replaced runtime asset in the project catalog. If the
   project has no builder/catalog yet, invoke `world-builder` to bootstrap the
   smallest dev-only harness instead of copying one from another game.
8. Re-run every critical-asset harness against the final catalog entry and
   locked pose/cameras. Final proof contains accepted shipping assets only and
   records the exact URL/state and verdict beside the runtime capture.
9. For skinned assets, inspect deformed silhouettes, not only names and bone
   counts. Assert nontrivial angular motion on semantic spine and limb bones;
   constant tracks plus root bobbing do not prove animation.
10. Close gameplay feel, graphics, UI, assets, audio, accessibility, performance,
    and responsive/mobile gaps named by the GDD.
11. Run the project's focused test lane and bounded target-relative captures.
    Open the final capture at original resolution and record `PASS` or `FIX`.
12. Record `POLISHED_READY|BLOCKED` directly in the GDD.

Never add a release step or run a production build unless the user asks.
