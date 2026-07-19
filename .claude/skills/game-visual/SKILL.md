---
description: Turn a DESIGN_READY brief into user-approved generated 2D construction sheets, image-to-3D sources, or runtime-facing targets. Use only when the user or GDD explicitly needs a generated visual contract.
name: game-visual
metadata:
  skiller:
    source: .agents/rules/game-visual.mdc
---

# Game Visual

Route by deliverable instead of forcing one provider:

- use `threejs-image-generator` for construction sheets, turnarounds,
  image-to-3D sources, icons, GUI art, decals, and targeted edits;
- use integrated image generation for edits of current runtime captures or
  targets previewing final rendered composition, lighting, and materials.

If the required provider is unavailable, stop with
`VISUAL_BLOCKED: IMAGEGEN_REQUIRED`. The GDD, actual input pixels, and
acceptance score own the result; the provider does not.

A target image is a build contract. Runtime-facing targets must be plausible in
the selected engine and camera. Construction sheets may be illustrated; their
job is consistent shape, proportion, identity, modularity, and clean downstream
handoff.

1. Read the `DESIGN_READY` GDD, its references, and runtime constraints:
   engine, camera, viewport, geometry and texture budgets, material/lighting
   expectations, asset lanes, and interface implementation.
2. Ground every generation in actual pixels:
   - own reference acquisition; user attachments are valid inputs, not a
     prerequisite;
   - search project-local references first, then use an allowed browser source
     only to fill a real gap;
   - archive each chosen external image or frame locally with source URL, date,
     and its single visual job;
   - when upgrading an existing surface, capture the exact current runtime
     camera/state and edit that frame instead of freeform re-imagining;
   - pass the actual images to generation. Filenames, URLs, labels, and prose do
     not replace pixels.
3. Record `IMAGE_INPUT_PROOF` before generation: local paths, acquisition
   method, provenance, and role (`runtime-base`, `style-anchor`,
   `subject/content`, or `state/detail`).
4. Translate the GDD contract into the prompt: subject, required differences,
   camera/viewport lock, composition, shape language, palette, material and
   lighting behavior, geometry/texture tier, interface anchors/states when
   applicable, buildability, and anti-copy negatives. The template contributes
   no visual style of its own.
5. Generate 2–4 candidates for one narrow surface. Keep WebGL/world imagery and
   DOM/screen-space interface targets separate unless the GDD explicitly binds
   them into one capture.
6. Audit every candidate before showing it:
   - each visible element maps to a named procedural, generated-3D, authored-3D,
     or 2D runtime asset lane;
   - the camera, scale, layout, and required states are buildable;
   - copied franchise identity, marks, costumes, items, or interface art
     hard-fail;
   - the candidate meets the GDD's explicit scorecard with no hard failure.
7. Iterate until the user approves the target frame(s).
8. Record exact target paths, viewport, camera/state, runtime base capture,
   binding visual traits, exclusions, scorecard, asset manifest, and locked
   builder views/poses for critical 3D subjects.
9. Record `VISUAL_READY|BLOCKED`. Do not implement runtime code.

## Construction Sheets

- Keep identity, proportions, pose, and scale consistent across views.
- Show the complete subject without cropped limbs or hidden construction-critical
  surfaces.
- Separate modular layers or accessories when the runtime needs independent
  meshes or materials.
- Export the chosen image-to-3D view as a clean single-subject image; never feed
  a labeled composite sheet to a one-image model generator.
- Reject inconsistent anatomy, ambiguous layers, uncontrolled style drift, or a
  sheet that hides the geometry required by the next stage.

Score construction sheets on silhouette/shape language 25, locked proportions
20, identity/reference translation 20, modular readability 20, and downstream
usability 15.

## 2D Asset Packs

- Generate from the GDD's manifest: asset ids, states, palette, dimensions,
  transparency/background contract, and shared prompt suffix.
- Produce one clean runtime file per asset.
- Record paths and prompts as `ASSETS_READY` in the GDD.
- Runtime lanes consume the manifest first and generate missing isolated assets
  only when that does not establish or change the visual family.
