---
name: threejs-game-proof
description: Prove playable or polished readiness with fast deterministic tests and bounded target-relative runtime checks; never run a build by default.
---

# Three.js Game Proof

Read the active GDD and prove only the current command.

## `game-build`

1. Run `npm test`.
2. Confirm the deterministic completion path passes in milliseconds.
3. When visuals matter, capture one representative runtime state and compare it
   semantically with the approved target.
4. Record `PLAYABLE_READY|BLOCKED`, proof, and blockers in the GDD.

## `game-polish`

1. Run `npm test`.
2. Recheck deterministic completion and relevant performance.
3. Capture the final representative target-relative state(s).
4. Verify changed audio, mobile framing, console/runtime errors, and sensitivity
   only when applicable.
5. Record `POLISHED_READY|BLOCKED`, proof, and blockers in the GDD.

Never run a production build, deploy, full browser traversal, or Playwright
suite unless the user explicitly asks for that separate action.
