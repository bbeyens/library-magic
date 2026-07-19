---
description: Produce, replace, rig, animate, clean, integrate, and prove any game 3D asset through one GDD-owned pipeline, with explicit branches for static or held props, bipeds through Mixamo, authored non-bipeds, and procedural assets.
name: game-3d-asset-pipeline
metadata:
  skiller:
    source: .agents/rules/game-3d-asset-pipeline.mdc
---

# Game 3D Asset Pipeline

Run only inside an active `game-build` or `game-polish` lane with an approved
GDD asset target. This skill owns the complete cross-tool path; provider skills
perform operations but never own orchestration or acceptance.

## Shared authority

1. Before selecting a provider, inspect the GDD's actual target/reference
   pixels. Record every local path, provenance, and the single visual job it
   owns: subject identity, silhouette, proportions, surface treatment,
   lighting, palette, or runtime state.
2. Apply the GDD's visual contract to every branch. Provider defaults never
   waive the target, runtime budget, copyright-distance rules, or acceptance
   views. The template supplies no style, shading, palette, or material opinion.
3. Require `VISUAL_READY` when an asset establishes or materially changes a
   visual family. When exact approved references already define a repair, edit
   against those pixels instead of generating concept churn.

## Intake and routing

4. Record the catalog id, runtime job, morphology, authored size, forward axis,
   triangle tier, texture tier, pivot or grip contract, collision needs,
   required clips, target/reference paths, and immutable source file before
   editing anything.
5. Choose exactly one primary branch:

| Branch | Provider route | Branch-only contract |
|---|---|---|
| Static prop, building, landmark | Owned target/reference -> `threejs-3d-generator` or BlenderMCP | Pivot, scale, silhouette, normals, materials, collision |
| Held/tool/weapon prop | Static route -> BlenderMCP when grip or socket authoring is needed | Real hand/back socket, grip axis, contact point, motion extremes |
| Biped | Accepted clean mesh -> Browser/Mixamo -> BlenderMCP when required | Mandatory human marker approval, one canonical skeleton, named clips |
| Non-biped creature | Accepted mesh -> BlenderMCP or GDD-approved creature owner | Authored skeleton and motion; validated body plan, deformation, grounding, root motion |
| Procedural 3D | Runtime/shared factory -> World Builder | No fake GLB; same target, catalog, camera, budget, and proof |

6. Require BlenderMCP for hero characters or creatures, primary buildings or
   landmarks, hero props, authored animation, or any target gap a generated
   mesh cannot credibly close. Generated meshes are inputs, not substitutes for
   the required authored finish.

## Bounded autonomous generation loops

For a generated prop, tool, weapon, building, or landmark, read
`references/generated-prop-recipe.md` before the first provider call. It owns
the ordered-pixel contract, reusable image prompts, copyright-distance gate,
Tripo mesh settings, and Blender handoff.

The **five-attempt cap applies only to provider generation**: generated 2D
source images/edits and generated 3D meshes. Blender cleanup, retopology,
materials, rigging, socket tuning, runtime integration, Builder proof, and
scorecard corrections are downstream production work; they do not consume a
generation attempt and must not be mislabeled as trials.

Preflight every external motion generator's real inference dependencies before
downloading its largest checkpoint. ARDY requires authenticated access to the
gated Meta Llama 3 text encoder even though its motion checkpoint is public,
and its stock batch CLI selects CUDA or CPU rather than Apple MPS; probe the
encoder access and device route first, then block honestly instead of using a
mirror, arbitrary embedding, or unproved acceleration patch.

When an approved branch actually needs generation, run the matching stage
without pausing:

- **2D source stage:** at most five image generation/edit submissions. Compare
  each returned image's actual pixels with the locked references and the exact
  asset job. Accept only when the image itself clears the GDD scorecard:
  correct identity, purposeful silhouette, locked proportions and surface
  treatment, clean image-to-3D framing, buildability, and no copied franchise
  content or drift outside the approved references.
- **3D source stage:** at most five model generation submissions. Inspect the
  provider result and downloaded source mesh for identity, silhouette, body
  plan, topology viability, material/texture contamination, and gross axis or
  proportion failures. Accept only when the generated mesh and its neutral
  render already clear the GDD source-asset score. "Blender can repair it" is
  a rejection, not a pass: Blender may perform technical cleanup and authored
  finishing after acceptance, but it must not be the plan for correcting wrong
  identity, weak silhouette, unusable topology, or incompatible surface design.

Every generation submission is image-driven when the provider supports image
conditioning. Give the generator ordered actual pixels for each reference job;
labels and prose do not replace pixels. Use project-local references first.
An allowed browser source may fill a real gap, but archive the chosen image
locally with source URL, date, and visual job before generation. Give the 3D
generator the accepted clean single-subject 2D
source. If the 3D provider accepts only one image, the accepted 2D source must
already embody the style; never submit a composite reference sheet as the
object image.

The caps are **per generative stage**, so an explicitly approved image-to-3D
route may use up to five 2D attempts followed by up to five 3D attempts. Preserve
every generated candidate under a temporary attempt path with prompt, provider,
task id, source pixels, and verdict. Do not stop between attempts; Mixamo marker
placement remains the only mandatory human pause.

Never continue from 2D to 3D, or from 3D to Blender/runtime, while the current
stage is `FIX` or `REJECT`. Once a generated source clears its stage, continue through Blender, rigging,
runtime integration, Builder, and final target-relative proof without asking for
approval at every step. Fix downstream failures in their real owner. Return to
the generator—and consume the next attempt—only when the accepted generated
source itself has an intrinsic failure that cannot credibly be repaired
downstream. If all five attempts of a stage fail, retain the previous shipping
asset, keep the best rejected candidate as evidence, record the exact blocker,
and report the bounded failure honestly.

## Static and held assets

7. Load `threejs-3d-generator` only when Tripo generation, texturing,
   conversion, or cleanup is selected. Prefer image-to-3D from an owned,
   approved target over text-to-3D. Pass actual target/reference pixels and the
   GDD translation into generation; never rely on style prose alone.
8. In Blender, preserve the immutable intake, establish the exported Y-up
   scale and real runtime-facing direction, simplify topology around the
   designed contour, author hard and smooth normals deliberately, and clean
   albedo into semantic color regions. Blender authoring remains Z-up: when the
   glTF exporter converts to Y-up, author vertical on Blender Z and verify the
   final GLB bbox/axes instead of reasoning from the viewport alone. Strip
   metallic/roughness storytelling, photographic AO, micro-grunge, and baked
   realistic lighting. Never use global `flatShading` as a repair. Inspect
   generated UV-island borders at head-close scale: when missing padding
   reveals triangle edges, export an asset-scoped nearest sampler or rebuild
   the atlas with padding before integration. If the contaminated region is a
   real disconnected semantic component such as hair, prefer a dedicated flat
   material on that component over destructive repainting of the shared face
   atlas; assert the component geometrically and fail on an ambiguous match.
   When the same baked contamination spans a connected rigged body, preserve
   only the purposeful facial atlas and split the remaining polygons into
   semantic flat materials from dominant bone weights plus sampled atlas color.
   Assert exact region counts so a changed mesh fails instead of silently
   recoloring eyes, brows, mouth, or clothing. Atlas pixel medians are sRGB;
   convert them to linear before assigning Blender base-color factors, then
   compare the new skin and clothing values against an untouched face region.
   Do not assign semantic materials to a fused generated prop from face
   centroids: split it at the real construction plane, cap each resulting
   volume, then assign materials and run a position-weld manifold check. glTF
   imports may also retain quaternion rotation mode, so set `rotation_mode`
   explicitly before applying authored Euler transforms.
9. For held assets, validate the actual grip wrapper and contact point on the
   shipping character. Capture rest, anticipation, contact, and recovery
   extremes. Grip continuity is not grip contact: identify the authored handle
   grip point and tune it into the palm/finger volume; a handle merely adjacent
   to the hand fails. Inspect close front and side crops in held-ready plus the
   action extremes before acceptance. A technically attached object that disappears edge-on or
   teleports during socket handoff fails. Resolve socket bones against the
   exact accepted GLB: Mixamo exports commonly alternate between
   `mixamorig:Bone` and `mixamorigBone`, so a resolver and an asset-backed test
   must cover both conventions. Then measure the resolved bone's actual world
   scale: imported armatures commonly carry `0.01`, which shrinks both a child
   prop and its local socket offset by one hundred. Compensate position and
   scale against that measured parent scale, and assert the prop's world bbox
   at runtime; successful loading and `visible=true` are not visibility proof.
   A forced animation preset proves only that preset. An always-carried prop
   also needs an unparameterized exploration capture on `/`; when occlusion is
   ambiguous, use a dev-only flat-color mask to prove real on-screen pixels.
   Presence is not acceptance: open natural-material captures at original
   resolution from at least two useful views and inspect rest plus an action or
   handoff extreme. Reject any face/head/torso penetration, detached or hidden
   grip, floating contact, implausible scale, broken silhouette, or result that
   works only from one lucky camera angle. A bbox or mask can never upgrade
   those visible failures to `ACCEPT`.
   An animated upper-spine bone is not automatically a valid storage socket:
   when idle/run torso torsion drives a carried prop through the head or in
   front of the body, use an authored dorsal bone/harness or the least-twisting
   middle/lower torso bone and reserve the real hand bone for action. A
   root-fixed carrier that looks correct in one pose but freezes while the rig
   runs is also a hard fail. Preserve the approved world pose at bind time,
   then attach or constrain the carrier to the chosen animated torso owner;
   use a bounded follower only when no single bone is stable enough. Bone
   following is not surface clearance: tune the smallest stable depth margin
   from the deforming skin. Too little margin intersects; too much reads as a
   detached or floating prop. Inspect both contact and negative space in rear
   and both profile views across a complete locomotion cycle plus rest and
   action extremes. A static idle frame or front-biased cycle cannot validate
   dorsal storage.
   A diagonal carrier after a presentation yaw needs an explicit rotation
   composition order or quaternion: default XYZ can turn the intended visible
   roll mostly into depth and leave the prop vertical. Tune the order against
   back and side pixels, then hard-code it.
   Before tuning carrier offsets, inspect the asset's orthographic axes in the
   Builder and identify which yaw exposes the semantic face versus only its
   thickness. A blade that is edge-on in the default exploration camera cannot
   be rescued by larger lateral offsets; fix presentation first, then tune the
   smallest close-body offset against `/`, back, and both profiles.
   A handoff proof pose must resolve its socket through the same phase/time
   policy as shipping runtime. Forcing the hand socket during a draw phase that
   still ships on the back creates an impossible intersection and invalid proof.

## Biped branch — Mixamo

10. Export one clean unrigged FBX: one accepted mesh, no armature or action,
    feet grounded, identity transforms, preserved material/texture, clean T-
    or A-pose, separated limbs, and an unambiguous front. Keep it immutable.
11. Use the user's authenticated Browser session. Upload the clean FBX and
    place chin/wrist/elbow/knee/groin markers. With symmetry enabled, place one
    marker per mirrored pair and verify both positions visually. Do not submit
    the auto-rig yet. If browser automation refuses the upload, use the visible
    native chooser and its exposed `open` action; never bypass authentication
    or mutate the intake asset to satisfy the browser.
12. **Mandatory human marker gate:** keep the marker screen open, capture the
    complete character with every marker visible, show it to the user, and
    stop. Proceed only after explicit approval of that exact placement. A
    previous request for autonomy does not approve rig markers.
13. After approval, keep Mixamo `Standard Skeleton (65)` and the same uploaded
    character for every clip. Use `No Fingers (25)` only for an explicit,
    measured GDD constraint. Download `FBX Binary`, `With Skin`, `30 FPS`, no
    keyframe reduction, with `In Place` for locomotion. Never assemble from
    `Without Skin`; matching names can hide a divergent bind pose.
14. Treat the final Mixamo download as a native-browser action. Use Playwright
    to verify the exact character, animation, in-place state, and download
    modal values `fbx7_2019`, `true`, `30`, `0`; start
    `waitForEvent("download")`, then click the unique final Download button
    with CUA. Copy only the newly created file into
    `clean-sources/<clip>.fbx` and require more than 100 KB. Disambiguate
    duplicate result names from their visible description. Never accept an
    older same-named download. Reusing the exact signed URL is fallback-only
    when the native download event is unavailable; never persist it.

The GDD names the exact required clip set and whether each locomotion clip is
in-place. Do not import another game's animation inventory.

For an authored prop handoff, derive the IK target and pole from the canonical
rig's measured bone world positions, bake and inspect the visible limb chain at
the contact frame, then derive stow from the accepted draw. Hard-coded targets
from another body produce plausible numbers and visibly wrong contact.

15. Use the first with-skin clip as the canonical armature and mesh. Import
    later with-skin clips only as action donors. Record the canonical imported
    joint count; `Standard Skeleton (65)` is a Mixamo UI preset, not an export
    joint-count promise—Blender 5.1 currently imports it as 57 bones with
    `ignore_leaf_bones=False`. Require every donor to have the measured count,
    same bone order, and maximum `matrix_local` bind delta below `0.0001`. Keep
    donor actions, delete donor objects, and export one browser-ready GLB.
16. Assert one skin, named actions, exactly three unique transform bindings
    per joint per clip, and nontrivial angular motion on semantic spine, arm,
    and leg bones. Register `morphology: biped`,
    `rig: mixamo-standard-65-v1`, and measured `forwardYaw`.

The accepted replacement rig must own its complete runtime path. Never keep a
new character in an idle/run preview branch while swim, tool, jump, sockets,
underwater presentation, or proof URLs silently fall back to an older hero.
Select the playable GLB once, then bind every clip and attachment from that
same scene, skin, and bone map. An unrigged comparison may stay static, but it
must be explicitly named as such.

Close a biped animation batch with two layers of evidence: one locked Builder
frame per declared clip at a named phase, then runtime captures for every
reachable gameplay family (ground locomotion, water, tool handoff/contact, and
jump/landing). A downloaded clip with no current gameplay state may remain
catalog-ready, but it still needs an exact dev proof preset or Builder phase
and must be recorded as not selected by production logic. Dev animation proofs
preserve the selected replacement avatar; they never substitute the previous
shipping character to make the motion look complete.

## Non-biped creature branch — authored

17. Use BlenderMCP or a creature-capable owner explicitly approved in the GDD.
    A generated mesh may be the starting point, but the approved authored
    owner controls the creature skeleton and motion. Mixamo is not a creature
    fallback.
18. Record morphology, neutral pose, skeleton design, control/retarget owner,
    required clips, root-motion policy, grounding, and deformation acceptance
    before rigging.
19. Inspect deformed silhouettes, joint collapse, foot sliding, ground
    penetration, body volume, turn behavior, and loop boundaries in Blender
    and runtime. Missing motion is authored or recorded as a blocker; never fake
    a creature with a biped rig merely to satisfy a harness.
20. Register the exact morphology, rig, clip, and root-motion contract.

## Shared Blender, export, and proof

21. Save a Blender checkpoint before arbitrary Python. Keep the editable
    `.blend`, rebuild script when used, immutable intake, and final GLB. Verify
    node names, transforms, scale, pivot/grip, bounds, topology, normals,
    materials, texture resolutions, animations, collision contract, and file
    size before integration. When a held asset exceeds budget, simplify
    repeated secondary geometry first—rope cross-sections, bevel segments,
    hidden loops—then remove unused UV/color attributes and enable backface
    culling on closed opaque parts. Do not amputate the primary silhouette to
    rescue ornamental topology.
22. Register every result in `assets-lib/catalog.json` with provider/task IDs,
    source files, morphology, rig, measured forward yaw, triangle tier,
    textures, clips, score, proof, and any real waiver. A waiver must name a
    visible reason and review trigger; provider provenance is not a waiver.
23. Prove the asset in the project's builder validation state under locked front,
    right, back, and three-quarter cameras. Capture beauty, black silhouette,
    normals, and wireframe; add skeleton and motion extremes for rigged assets.
    The green Builder result proves loading, budget, clips, and pose contracts
    only. It never replaces target/reference-relative runtime judgment.
24. Require both a shipping-only Builder `PASS` and the GDD's acceptance score
   with no hard failure. When generation was used, record
   its separate 2D/3D attempt ledger before the accepted source continues into
   production. The final accepted asset still requires target-relative runtime
   evidence at actual gameplay size. Open the final images at original
   resolution after the last integration change, inspect the branch-specific
   visible failure modes, run `npm test`, then record `ACCEPT`, `FIX`, or
   `REJECT` plus all paths and the exact remaining gap in the GDD. Never infer
   acceptance from a generated file, green harness, diagnostics, or test pass.

## Self-maintenance

After every asset correction, immediately reconcile the smallest reusable
methodology rule in `.agents/rules/game-3d-asset-pipeline.mdc`; do not wait for
the end of the batch. Replace stale or contradictory guidance instead of
stacking exceptions, and keep one-off asset history in the GDD rather than the
skill. This also applies at the Mixamo human stop. Run
`npx skiller@latest apply`, audit the generated mirror, and validate it before
continuing to the next correction or final report.
