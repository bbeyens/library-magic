---
name: spritesheet-implementation
description: Implement game spritesheets into Library Magic without frame drift, ghost frames, bad centering, duplicated sprites, or animation reset bugs. Use when adding or fixing animated sprite assets, pixel-art enemies, projectiles, UI sprites, death/attack/walk/idle sheets, CSS background sprites, canvas sprite drawing, or any issue where an animated sheet looks centered while paused but wrong while moving.
---

# Spritesheet Implementation

Use this skill when wiring a spritesheet into the game. The job is not "make it appear"; the job is "make every frame land on the intended pixel cell, stay centered in motion, and survive game-state updates without animation artifacts."

## Workflow

1. Inspect the source asset before coding.
   - Get pixel dimensions with `sips -g pixelWidth -g pixelHeight <file>` or `file <file>`.
   - Confirm frame width, frame height, columns, rows, row order, and frame counts per animation.
   - Do not guess rows from the visual preview. Use the user's declared frame size when provided.

2. Copy or normalize the asset deliberately.
   - Put runtime assets under the existing `public/assets/...` tree used by the feature.
   - Preserve transparent padding unless it is proven wrong. Padding is often the anchor.
   - Normalize frame centering only inside fixed-size cells; never crop the sheet into variable-size sprites.

3. Implement frame sampling with exact grid math.
   - Canvas: draw with `sx = column * frameWidth`, `sy = row * frameHeight`, `sw = frameWidth`, `sh = frameHeight`.
   - CSS backgrounds: set `background-size: <columns * 100%> <rows * 100%>`.
   - CSS `background-position` uses `column / (columns - 1) * 100%` and `row / (rows - 1) * 100%`.
   - Example: 21 columns means x positions `0%, 5%, 10%, ..., 100%`.
   - Example: 11 columns means x positions `0%, 10%, 20%, ..., 100%`.

4. Use discrete frame keyframes for CSS sprite animation.
   - Prefer explicit keyframe ranges with exact `background-position` values.
   - Use `animation-timing-function: steps(1, end)` when each keyframe range already selects the frame.
   - Do not animate `from 0%` to `to 25%` with `steps(6)`: that divides the range into equal animation steps, not sheet columns. This caused the TD skeleton "transparent wall / two sprites at once" bug.

5. Keep the rendered box proportional to the frame, not the sheet.
   - For a 32x48 frame, use `aspect-ratio: 32 / 48`.
   - For a 32x32 frame, use `aspect-ratio: 1`.
   - Scale from game variables like `--defense-enemy-size` so S/M/L changes affect sprites.

6. Preserve stable DOM/state identity.
   - Do not change React keys, recreate nodes, or restart CSS animations on every attack, kill, wave change, hover, or damage popup.
   - Add separate elements for separate projectiles or damage numbers. Do not reuse one animated element if multiple attacks can overlap.

7. Verify in motion.
   - Check idle, walk/fly, attack, death, and the transition between them.
   - Compare paused versus running. If pause looks centered but running drifts, suspect frame sampling first.
   - Watch horizontal and vertical movement separately; a fix for one axis can still leave bad x-position math.
   - Run the relevant tests and `npm run build`.

## CSS Pattern

Use this pattern when a sheet has fixed cells and different row frame counts:

```css
.enemy {
  --row-idle: 0%;
  --row-attack: 33.333%;
  --row-walk: 66.667%;
  --row-death: 100%;
  width: calc(var(--enemy-size) * 0.667);
  aspect-ratio: 32 / 48;
  background-image: url("/assets/path/sheet.png");
  background-size: 2100% 400%;
  background-position: 0 var(--row-walk);
  image-rendering: pixelated;
  animation: enemy-walk 760ms steps(1, end) infinite;
}

@keyframes enemy-walk {
  0%,
  16.666% { background-position: 0% var(--row-walk); }
  16.667%,
  33.332% { background-position: 5% var(--row-walk); }
  33.333%,
  49.999% { background-position: 10% var(--row-walk); }
  50%,
  66.666% { background-position: 15% var(--row-walk); }
  66.667%,
  83.332% { background-position: 20% var(--row-walk); }
  83.333%,
  100% { background-position: 25% var(--row-walk); }
}
```

This looks verbose because it is exact. Exact beats clever here.

## Do Not Do

- Do not use `background-size: cover`, `contain`, or natural image dimensions for animated sheets.
- Do not use `steps(frameCount)` across a partial background-position range unless the resulting percentages are proven to match sheet columns.
- Do not assume the last frame is at `100%` unless the animation actually uses the final column.
- Do not mix old pseudo-element FX with a new consolidated sheet unless the FX is intentionally still needed.
- Do not fix centering by nudging live positions before checking the source cell alignment.
- Do not let game events reset unrelated UI hover or damage-number animations.
- Do not call the job done from a still screenshot. Spritesheet bugs often only show while moving.

## Verification Commands

Run the smallest relevant set:

```bash
sips -g pixelWidth -g pixelHeight public/assets/path/sheet.png
npm run build
npx tsx tests/defenseRules.test.ts
git diff --check -- src/style.css public/assets/path/sheet.png
```
