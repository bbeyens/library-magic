---
name: threejs-game-ui-designer
description: Design and implement the readable responsive HUD, menus, overlays, touch UI, typography, and accessibility required by the active GDD.
---

# Three.js Game UI Designer

Read the active GDD and approved target. Implement only UI required by actual
game state.

- Keep goals, state, feedback, and actions readable at the target viewport.
- Check touch targets, safe areas, text fit, contrast, and HUD/world overlap.
- Use generated UI art only when it materially improves the approved target.
- Run `npm test` and capture one representative runtime state when visual.
- Record proof and remaining gaps directly in the GDD.

Do not create packet IDs, fake future UI, separate scorecards, or a build step.
