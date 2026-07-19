---
description: Select the smallest useful GameBlocks module graph for a concrete implementation problem named by the Director.
name: gameblocks
metadata:
  skiller:
    source: .agents/rules/gameblocks.mdc
---

# GameBlocks

GameBlocks is a read-only reference library under
`.agents/skills/gameblocks/modules/**` with index
`.agents/skills/gameblocks/summary.md`.

- Never load it during `game-design`.
- During `game-build` or `game-polish`, load it only for a named motion, camera, collision,
  navigation, gameplay-state, UI, world, factory, or VFX problem.
- Read one module family and only its local dependencies.
- Adapt the smallest useful behavior into the active owner; never copy the
  directory tree or replace the owner.
- Preserve pure deterministic gameplay state and allocation-light hot paths.
- Keep the MIT notice when substantial donor code is copied.
- Record selected modules and proof directly in the GDD.

GameBlocks adds no plan, packet, build, browser suite, benchmark, or release
step.
