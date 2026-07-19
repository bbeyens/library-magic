---
description: Define a game through brainstorming, one-question-at-a-time grilling, a visual brief, and one implementation-ready GDD. Use when the user invokes game-design for any game project.
name: game-design
metadata:
  skiller:
    source: .agents/rules/game-design.mdc
---

# Game Design

1. Read the brief, `VISION.md`, and named project doctrine. Ignore unrelated
   archives and previous games by default.
2. Use `grill-with-docs`, `grilling`, and `domain-modeling` to resolve the
   design one decision at a time. Keep unresolved reasoning in the active
   brainstorm document.
3. Lock the game's own visual contract without importing a template opinion:
   exact reference pixels and provenance, composition, camera, scale,
   silhouettes, geometry density, materials, lighting, palette, texture
   treatment, animation, VFX, interface hierarchy, typography, motion, input
   variants, and explicit exclusions.
4. Separate reference jobs. Name which image owns subject identity, shape,
   surface treatment, lighting, interface behavior, or runtime state. References
   guide traits; they never authorize copied franchise characters, marks,
   costumes, items, or assets.
5. Name every critical visual subject that needs deterministic proof and specify
   its acceptance views/poses: front, right, back, three-quarter, focus crop,
   clip and phase, scale/proportion checks, and variants. For non-catalog
   surfaces, record `HARNESS_NOT_APPLICABLE: <reason>` and the exact runtime
   capture state.
6. Write one implementation-ready GDD containing approved decisions, mechanics,
   constraints, asset routes, proof expectations, and the visual brief.
7. Stop at `DESIGN_READY|BLOCKED`. Do not generate assets or implement.

Brainstorming belongs inside `game-design`; there is no separate production
lane for it.
