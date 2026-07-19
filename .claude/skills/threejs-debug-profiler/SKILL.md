---
name: threejs-debug-profiler
description: Reproduce, measure, and fix a concrete Three.js runtime bug or performance regression required by the active GDD.
---

# Three.js Debug Profiler

Read the GDD and the failing owner. Reproduce first, measure when performance is
claimed, fix the smallest owner, and rerun the focused proof plus `npm test`.
Use one bounded runtime check only when the bug needs the real renderer. Record
baseline, result, and residual risk directly in the GDD. Create no packet,
scorecard, plan, build, or broad profiling pass.
