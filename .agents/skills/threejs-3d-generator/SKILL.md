---
name: threejs-3d-generator
description: Generate, texture, stylize, convert, and download Three.js model assets with Tripo.
---

# Three.js 3D Generator

## Ownership

- Tripo: text/image/multiview-to-3D, texturing, stylization, low-poly
  conversion, format conversion, and download only.
- Mixamo through `Browser:control-in-app-browser`: biped autorig and animation
  library work.
- BlenderMCP: authored geometry, mesh repair, fitting, weights, non-biped rigs
  and animation, authored motion, and final multi-clip GLB assembly when needed.

Run inside an active `game-build` or `game-polish` lane with a concrete GDD
asset target. Record task ids, settings, outputs, immutable inputs, and proof in
the GDD. This skill stops at accepted mesh outputs.

Resolve `<this-skill-dir>` from the current installed skill path.

## Credentials

Never store API keys in skills or client code. The helper reads `--api-key` or
`TRIPO_API_KEY`.

```bash
python3 <this-skill-dir>/scripts/threejs_3d_asset.py probe
```

The Mixamo lane uses the authenticated Browser session and needs no Tripo key.

## References

Load at most two references for the selected operation:

- `references/api-notes.md` for Tripo generation/postprocessing;
- `references/threejs-integration.md` for Three.js intake;
- `references/image-generator-workflows.md` for 2D source preparation;
- `Browser:control-in-app-browser` for Mixamo.

## Commands

```bash
python3 <this-skill-dir>/scripts/threejs_3d_asset.py --help

python3 <this-skill-dir>/scripts/threejs_3d_asset.py text \
  --prompt "game-ready asset matching the attached GDD contract" \
  --model-version v3.1-20260211 \
  --texture-quality detailed \
  --geometry-quality detailed \
  --wait --download --out-dir assets/models/asset

python3 <this-skill-dir>/scripts/threejs_3d_asset.py image \
  --image assets/concepts/asset-front.png \
  --model-version v3.1-20260211 \
  --enable-image-autofix \
  --texture-alignment original_image \
  --wait --download --out-dir assets/models/asset

python3 <this-skill-dir>/scripts/threejs_3d_asset.py generate-multiview \
  --image assets/concepts/character-front.png \
  --wait --download --out-dir assets/concepts/character-multiview

python3 <this-skill-dir>/scripts/threejs_3d_asset.py multiview \
  --original-task-id REVIEWED_MULTIVIEW_TASK_ID \
  --model-version P1-20260311 --face-limit 6000 \
  --no-texture --no-pbr --no-export-uv \
  --wait --download --out-dir assets/models/character

python3 <this-skill-dir>/scripts/threejs_3d_asset.py status TASK_ID
python3 <this-skill-dir>/scripts/threejs_3d_asset.py download TASK_ID \
  --out-dir assets/models

python3 <this-skill-dir>/scripts/threejs_3d_asset.py postprocess \
  --type texture_model --original-task-id TASK_ID \
  --texture-prompt "surface treatment from the approved GDD target" \
  --wait --download --out-dir assets/models/retextured

python3 <this-skill-dir>/scripts/threejs_3d_asset.py postprocess \
  --type conversion --original-task-id TASK_ID --format GLTF \
  --face-limit 20000 --wait --download --out-dir assets/models/gltf

python3 <this-skill-dir>/scripts/threejs_3d_asset.py postprocess \
  --type stylize_model --original-task-id TASK_ID --style voxel \
  --wait --download --out-dir assets/models/voxel
```

The postprocess command accepts only texturing, conversion, low-poly, and
stylization operations. Rigging and animation task types fail before submission.

## Multiview Contract

- Use separate consistent views in exact `[front, left, back, right]` order.
- Review every derived or edited view before model generation.
- Never feed a labeled composite turnaround sheet to a one-image model call.
- Judge pose in 3D projection; reject missing limbs, inconsistent proportions,
  changed articulation, or contradictory views.
- Prefer a geometry-first P1 pass with an explicit runtime face budget before
  spending on texture.

## Biped Rigging And Animation — Mixamo

1. Prepare one clean unrigged FBX: complete body, identity transforms, grounded
   feet, clean T/A pose, front-facing, separated limbs, no fused props.
2. Open Mixamo with `Browser:control-in-app-browser` and the authenticated user
   session.
3. Upload once and place chin, wrist, elbow, knee, and groin markers.
4. Stop for explicit user approval of the visible marker screen.
5. Keep the same uploaded character for every clip. The GDD names the clip set.
6. Download FBX Binary at 30 FPS; keep one with-skin canonical character and use
   later downloads as action donors.
7. Preserve source root motion until import, then derive in-place locomotion
   deliberately while retaining vertical motion.
8. Assemble one runtime GLB with one skeleton and named clips. Use BlenderMCP
   only for actual geometry, weights, authored motion, or offline assembly.
9. Validate skeleton identity, bind pose, clip tracks/durations, deformation,
   loop boundaries, and real Three.js transitions.

## Non-Biped Rigging And Animation

Tripo and Mixamo do not own this branch. Use BlenderMCP or another
creature-capable owner explicitly approved in the GDD. Record morphology,
skeleton and control design, required clips, root-motion policy, deformation,
grounding, and runtime proof.

## Quality Rules

- Improve prompts with the GDD's subject, silhouette, proportions, camera,
  scale, runtime job, materials, budget, and exclusions.
- Pass actual target/reference pixels when supported.
- Download successful outputs immediately; provider URLs expire.
- Inspect triangle/material/texture counts, file size, bounds, axes, scale,
  pivot, topology viability, and surface treatment.
- A generated file is input, not acceptance. Finish through the asset pipeline,
  catalog, validation harness, tests, and target-relative runtime capture.
