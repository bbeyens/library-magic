---
description: Bootstrap and use a dev-only Three.js World Builder for sandbox worlds, asset intake, catalog validation, and locked multi-view proof without coupling experiments to the main game.
name: world-builder
metadata:
  skiller:
    source: .agents/rules/world-builder.mdc
---

# World Builder

The starter may not have a builder yet. On first use, create the smallest
dev-only harness required by the active GDD instead of copying another game's
world or assumptions.

## Bootstrap Contract

1. Add a dev-only builder entry such as `/builder.html`; exclude it from
   production output unless the GDD explicitly requires otherwise.
2. Create project-owned `worlds/` and `assets-lib/` surfaces only when first
   needed:
   - serializable world drafts under `worlds/`;
   - immutable source assets and `assets-lib/catalog.json`;
   - shared procedural factories imported by both builder and game;
   - locked validation cameras and debug modes.
3. Keep builder state isolated. The main game reads only explicitly promoted
   assets, factories, or world data.
4. Add deterministic URL state for recurring validation setups.

## Asset Intake

For every imported or procedural asset, record catalog id, runtime job,
provenance, immutable source, provider task ids when applicable, authored size,
axis/forward contract, pivot or grip, morphology, rig owner, clips, triangle and
texture tiers, collision contract, and proof.

Validate:

- loadability and bounds;
- scale, pivot, facing, normals, topology, and material slots;
- triangle, texture, file-size, and draw-call budgets;
- declared clips, skeleton, deformation, and motion extremes;
- beauty, silhouette, normals, wireframe, and collision views;
- front, right, back, and three-quarter framing under locked cameras.

The validation harness proves asset contracts. It does not replace the in-game
capture that proves integration.

## Sandbox Rules

- Exploration may compare at most three variants at once.
- Red or rejected variants may stay only while a named comparison is active.
  Final accepted state contains shipping candidates only.
- A procedural asset remains a shared factory; never export a fake GLB just to
  satisfy the catalog.
- Promote nothing to the game until the GDD records the chosen id, validation
  URL/state, verdict, and any visible waiver.
- Run focused tests and bounded runtime proof after promotion.
