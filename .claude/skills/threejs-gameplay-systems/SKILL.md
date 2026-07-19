---
name: threejs-gameplay-systems
description: Build and tune the playable loop, controls, camera, levels, state, feedback, recovery, and game feel required by the active GDD.
---

# Three.js Gameplay Systems

Read the active GDD and implement one complete vertical path:

```txt
input -> state -> world response -> feedback -> completion or recovery
```

- Load at most two focused references for a concrete problem.
- Use GameBlocks only for a named fragile system need.
- Keep gameplay state deterministic and independent from rendering/DOM time.
- Tune one observed feel or readability gap at a time.
- Prove complete progression with a millisecond deterministic trace in
  `npm test`.
- Capture one bounded runtime state when world/camera judgment matters.
- Record tuned values, proof, and blockers directly in the GDD.

Do not create a parallel test model, packet, plan, build, or browser bot.
