# Generated 3D Asset Recipe

Use this only inside `game-3d-asset-pipeline` when the GDD selects generated
2D and/or Tripo mesh input. The GDD owns style, subject, budget, and proof.

## 1. Lock the Inputs

Record the catalog id, runtime job, exact target/reference pixels and provenance,
one visual job per image, camera/view, authored scale, forward axis, pivot or
grip, collision, budget, copyright-distance exclusions, and validation views.
Use the smallest useful image set.

## 2. Generate the 2D Source

Order actual pixels by job: subject/content, shape/proportion, surface/palette,
and the current runtime capture when replacing an existing asset.

```text
Create one original [ASSET JOB] for [PROJECT].

Reference ownership:
1. Image 1 owns [SUBJECT IDENTITY / REQUIRED PARTS].
2. Image 2 owns [SILHOUETTE / PROPORTIONS / SHAPE LANGUAGE].
3. Image 3 owns [SURFACE / PALETTE / LIGHTING].
4. Image 4 is the locked runtime camera/state and layout.

Preserve [BINDING TRAITS]. Create a new [PRIMARY SILHOUETTE, ASYMMETRY,
FUNCTIONAL PARTS]. The object must read at [GAMEPLAY PIXEL SIZE].

Do not reproduce [COPYRIGHT-DISTANCE LIST]. No copied marks, costumes, items,
ornament, or palette arrangement.

Centered single object, full object visible, generous empty space, clean
background, no cast shadow, hand, character, text, label, border, or unrelated
scene elements. Use only the surface and shading treatment approved by the GDD.
```

Reject identity drift, weak small-scale silhouette, broken intake perspective,
reference-object copying, or surface treatment outside the GDD.

## 3. Corrective Edit

Prefer constrained cleanup over redesign:

```text
Clean Image 1 for image-to-3D without redesigning it. Preserve its exact
approved silhouette, proportions, required parts, visual family, and
copyright-safe identity.

Remove only [NAMED DEFECTS]. Keep the locked background, framing, camera, and
material regions. Do not add text, a hand, a character, a scene, multiple
views, new ornament, or a different visual style.
```

An edit cannot rescue the wrong subject category. Reject it.

## 4. Tripo Source Mesh

Submit only the accepted single-subject source. Tripo is generation-only: model
generation, texturing, stylization, conversion, and download. Never call its
rigging or animation APIs.

Start from the GDD's real geometry and texture budget. For a geometry-first
pass, prefer a face limit matching the catalog tier and disable texture/PBR
when surface output would hide weak form. Inspect provider renders from at least
four directions and download the source immediately.

Accept only when identity, silhouette, proportions, body plan, topology
viability, axes, and surface treatment can survive normal technical cleanup.
Blender is not a plan for redesigning a failed generated source.

## 5. BlenderMCP Finish

Preserve the immutable provider source, then normalize axes, scale, origin,
pivot, and forward direction; separate fused semantic parts at real boundaries;
simplify secondary geometry before the primary contour; author normals and
materials from the GDD; preserve purposeful UV islands and padding; validate
closed parts; export the final GLB; and retain the editable Blender source.

## 6. Proof

Require catalog registration, provider task ids and immutable inputs, locked
beauty/silhouette/normals/wireframe/collision views, motion extremes for later
authored rigs, grip/contact extremes for held assets, project tests, and a
target-relative runtime capture opened at original resolution.

The builder proves asset contracts. The runtime capture proves integration.
Record `ACCEPT|FIX|REJECT`; automation success never proves visual acceptance.
