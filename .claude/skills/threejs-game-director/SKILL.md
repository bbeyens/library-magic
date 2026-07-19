---
description: Select only the Three.js owners needed by the current approved GDD and game stage.
argument-hint: <GDD path> <game-design|game-build|game-polish>
disable-model-invocation: true
name: threejs-game-director
metadata:
  skiller:
    source: .agents/rules/threejs-game-director.mdc
---

# Three.js Game Director

The Director is a thin owner router, not a second workflow.

- `game-design`: identify visual coverage and likely asset needs without loading
  implementation owners.
- `game-build`: load only the gameplay, UI, asset, debug, or QA owners required to
  complete the mechanical loop.
- `game-polish`: load only owners required to close target-relative production gaps.

The named GDD defines scope and stores targets, asset decisions, proof, and the
current status. Record everything directly there.

## Proof

- Logic and deterministic gameplay: `npm test`.
- Critical catalog 3D assets: reproducible `/builder` Validation URL with the
  GDD's locked cameras/pose/focus; accepted shipping selection reads `PASS`.
- Meaningful visuals: one bounded runtime capture compared semantically with
  the approved target.
- Performance: measured only when relevant to the GDD.
- `game-polish`: the same proof at production quality, with no build command.

Never load future owners or generic references without a current need.
