# Visual Verification Checklist

- Open the local dev or preview URL in a browser.
- Check browser console errors and page errors.
- Confirm the canvas has nonzero display size and drawing-buffer size.
- Capture a screenshot.
- Confirm the real canvas is visible and correctly framed.
- Test at desktop, laptop, and mobile viewport sizes.
- Confirm camera aspect updates after resize.
- Confirm UI/HUD text does not overlap or clip.
- Interact for at least one core action and observe visible state change.
- If using snapshots, make dynamic effects deterministic or mask them.
- Use a visual-test harness only for explicitly requested durable automation or
  a browser-specific regression.
- If HUD/menu layout changed, also use `threejs-game-ui-designer/references/checklists/game-ui-quality.md`, `threejs-game-ui-designer/references/checklists/hud-readability.md`, and `threejs-game-ui-designer/references/checklists/responsive-ui-fit.md`.
- If procedural models/materials changed, also use `threejs-polish-builder/references/checklists/procedural-model-quality.md`, `threejs-polish-builder/references/checklists/material-lighting-quality.md`, and `threejs-polish-builder/references/checklists/performance-safe-visual-detail.md`.
- If the target is premium, complete, release-ready, or showcase quality, also use `threejs-polish-builder/references/checklists/polish-game-quality-gate.md`.
- If screenshots still miss the target, return the largest semantic delta to
  the graphics owner.
- If the game is an endless runner, also use `threejs-gameplay-systems/references/checklists/endless-runner-premium-quality.md`.
