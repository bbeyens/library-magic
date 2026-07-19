# Tripo API Notes

These notes intentionally cover generation-only use.

## Base API

- Base URL: `https://api.tripo3d.ai/v2/openapi`
- Auth: `Authorization: Bearer <TRIPO_API_KEY>`
- Create task: `POST /task`
- Query task: `GET /task/:task_id`
- Direct image upload: `POST /upload/sts`

Final statuses are `success`, `failed`, `banned`, `expired`,
`cancelled`, and `unknown`. Query with the same key that created the task
and download successful outputs immediately.

## Allowed Task Types

- `text_to_model`
- `image_to_model`
- `multiview_to_model`
- `import_model`
- `texture_model`
- `stylize_model`
- `conversion`
- `mesh_segmentation`
- `mesh_completion`
- `highpoly_to_lowpoly`

This skill stops at accepted mesh outputs; downstream character work is not an
API task exposed here.

## Output Fields

Common output keys include `model`, `base_model`, `pbr_model`,
`rendered_image`, `generated_image`, and `generate_multiview_image`.
Treat provider responses and URLs as temporary tooling output.

## Generation Defaults

- Prefer reviewed image or multiview input when identity and visual matching
  matter.
- Use exact `[front, left, back, right]` views for multiview input; front is
  mandatory and at least two views are required.
- Never feed a composite sheet to a single-image model call.
- Prefer `P1-20260311` with an explicit face limit and geometry-first settings
  when proving silhouette/topology before texture.
- P1 prompt controls are limited; reviewed input pixels own shape.
- Prefer `v3.1-20260211` when high-detail geometry is actually justified.
- Match texture and geometry quality to the browser/mobile budget.
- Inspect the downloaded GLB instead of trusting requested face limits or
  topology settings.
- Textured exports may split positions at UV/normal boundaries; inspect
  coincident positions before calling those splits holes.
- Fill only real closed boundary cycles; blanket hole-fill can create invalid
  geometry.
- Humanoid meshes leave Tripo after generation and route to Mixamo.
- Non-biped meshes leave Tripo after generation and route to the GDD-approved
  authored rig/animation owner.
