---
name: threejs-image-generator
description: "Generate and edit 2D image assets for Three.js games using Google's Gemini image API. Use for concept sheets, image-to-3D inputs, texture references, sky/background plates, decals, logos, icons, GUI art, title/menu art, thumbnails, marketing stills, and source images that feed threejs-3d-generator. Also use for direct image editing when the user provides an image path."
---

# Three.js Image Generator

## Purpose

Create game-useful 2D assets and references for Three.js projects. This skill is the image-generation layer for the Three.js game system: it produces concepts, textures, decals, UI art, and 2D inputs that can be handed to `threejs-3d-generator` for image-to-3D model creation.

Provider: Google's Gemini image API.

`game-visual` uses this skill for construction sheets, turnarounds,
image-to-3D sources, and targeted edits; `game-build` or `game-polish` may use
it for isolated approved runtime assets. The GDD and its scorecard own
acceptance. Do not force an illustrated construction target to imitate a 3D
render merely to look closer to runtime.

Resolve `<this-skill-dir>` in the commands below in this order: `~/.claude/skills/threejs-image-generator`, `~/.codex/skills/threejs-image-generator`, `~/.agents/skills/threejs-image-generator`, or repo `skills/threejs-image-generator`.

## When To Use

Use this skill when the Director-selected image lane needs:

- 2D-to-3D reference images for `threejs-3d-generator`: characters, creatures, buildings, ships, cars, weapons, props, pickups, terrain modules.
- Texture and material references: terrain, road, rock, sand, metal, sci-fi panels, trim sheets, decals, hazard labels, signs.
- Environment images: skies, backdrops, city horizons, nebula plates, menu backgrounds, parallax layers.
- UI art: logos, faction marks, icons, item cards, ability badges, cockpit decals, GUI panels, title art.
- Existing-image edits, style variants, cleanup, palette alignment, or concept sheet refinements.

Polish wording alone never mandates an image output.

## API Key

Never store API keys in skill files or browser/game code, and never paste a key value into a report. The script reads `--api-key` or `GEMINI_API_KEY`.

Step 0, before declaring the key unavailable: run this skill's own probe and paste its literal output into the report.

```bash
uv run <this-skill-dir>/scripts/generate_image.py probe   # prints GEMINI_API_KEY=SET|MISSING
```

`GEMINI_API_KEY=MISSING` is only a valid blocker after this selected skill's
probe. Keys defined only in a shell profile can be absent from the process env;
if the plain probe prints MISSING unexpectedly, wrap it:
`zsh -lc 'source ~/.zprofile 2>/dev/null || true; source ~/.zshrc 2>/dev/null || true; uv run <this-skill-dir>/scripts/generate_image.py probe'`.

## Tool Script

Run from the user's current project directory so output lands in the game project:

```bash
uv run <this-skill-dir>/scripts/generate_image.py --prompt "your image description" --filename assets/concepts/output.png --resolution 2K
```

Edit an existing image:

```bash
uv run <this-skill-dir>/scripts/generate_image.py \
  --input-image assets/concepts/ship.png \
  --prompt "turn this into a battle-worn red racing livery with clearer material zones" \
  --filename assets/concepts/ship-red-livery.png \
  --resolution 2K
```

Use several ordered references by repeating `--input-image`; label their roles
in the prompt in the same order:

```bash
uv run <this-skill-dir>/scripts/generate_image.py \
  --input-image structure.png \
  --input-image finish.png \
  --input-image identity.png \
  --prompt "Image 1 owns structure; Image 2 owns finish; Image 3 owns identity..." \
  --filename assets/concepts/character-anchor.png \
  --resolution 2K
```

Reference discipline:

- Gemini tends to follow visible reference composition more strongly than
  written role labels. If the output must contain one subject or one view,
  pre-crop every input to one subject in the intended camera and framing;
  multi-view sheets commonly leak duplicate views into the result. Preserve
  multiple views when the requested deliverable is explicitly a 2D turnaround,
  then export the chosen image-to-3D view separately.
- Treat outlines, costume borders, props, and pose present in an input as
  likely transfer content even when prohibited in prose. Remove them from the
  reference when possible and reject the output when they survive.

Resolution mapping:

- `1K`: quick concepts, icons, draft sheets.
- `2K`: default production reference for image-to-3D, textures, backgrounds, UI panels. This is also the script default when `--resolution` is omitted.
- `4K`: hero splash/title art, high-detail texture references, large sky/background plates.

## Prompt Patterns

Image-to-3D reference:

```text
Create a clean 2D design image intended for later image-to-3D generation of [asset]. Use deliberate illustrated character art, not a render of an existing 3D model. Centered single object, full object visible, plain light background, readable silhouette, clear material zones, game-ready [genre/style], no motion blur, no cropped parts, no text.
```

Riggable character/creature reference:

```text
Create a full-body 2D [T-pose/A-pose/turnaround] construction sheet for later 3D rigging: [details]. Keep identity and proportions consistent across requested views, show hands/feet/limbs, use a plain background and readable anatomy/clothing layers, and fuse no weapon to the hands. Drawn contours are sheet notation, not a requested runtime outline.
```

Modular avatar base:

```text
Show a modest stylized base body with bare simplified torso, arms, legs, hands, and feet plus plain opaque fitted boxer shorts high on the thigh. No belt, buckle, pockets, logo, accessory, large fold, shirt, suit, footwear, weapon, or explicit anatomy. Keep the pose neutral and non-sexual for character-customization production.
```

Texture/material reference:

```text
Create a seamless game texture reference for [surface]. Orthographic/top-down, PBR-friendly albedo, clear material variation, no perspective, no baked strong shadows, [style/material details].
```

Logo/icon/UI art:

```text
Create a crisp game UI [logo/icon/badge/panel] for [faction/item/ability]. Transparent-friendly silhouette, high contrast at small size, [genre styling], no tiny unreadable text.
```

Sky/background:

```text
Create a wide game background plate of [environment]. Layered depth, readable horizon, [time/weather/style], suitable behind a real-time Three.js scene, no foreground subject.
```

## Three.js Integration Rules

- Save concepts and image-to-3D sources under `assets/concepts/`.
- Save textures, decals, icons, and GUI source images under `assets/textures/`, `assets/decals/`, or `assets/ui/`.
- For image-to-3D, hand the saved image path to `threejs-3d-generator` only when
  the active GDD selects that chain, then update the GDD.
- Do not call the image API from client-side game code.
- Convert generated PNGs into runtime formats deliberately: PNG for alpha/UI, JPG/WebP/KTX2 for larger opaque textures where the project pipeline supports it.
- Verify how the image appears in game, not only that the file exists.

## Required Report

Report:

- Credential probe output or command blocker.
- Prompt and purpose.
- Output path.
- Resolution.
- Whether the image was used directly, edited further, or handed to `threejs-3d-generator`.
- Any remaining integration work such as compression, UV assignment, alpha cleanup, or atlas packing.

Do not claim the selected image decision complete until its output or real
blocker is recorded.
