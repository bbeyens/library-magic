# Three.js Integration

Use this after Tripo produces a model, Mixamo produces a biped, or the
GDD-approved authored lane produces another rigged asset.

## Preferred Outputs

- Three.js runtime: GLB/PBR model first.
- Animation/game-engine interchange: FBX when needed, then convert/import carefully.
- Static web asset exchange: GLTF/GLB.
- 3D print only: STL or 3MF, not for textured game runtime.
- Apple AR: USDZ.

## Import Pattern

Use `GLTFLoader`:

```ts
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const gltf = await loader.loadAsync('/assets/models/asset/model.glb');
scene.add(gltf.scene);
```

For animation:

```ts
const mixer = new THREE.AnimationMixer(gltf.scene);
const action = mixer.clipAction(gltf.animations[0]);
action.play();

// in loop
mixer.update(deltaSeconds);
```

Animation intake rules:

- Humanoids must come from one Mixamo character: autorig once, then download every clip against that same rig. Do not runtime-retarget separate skeletons when the source can be identical.
- Assemble one GLB containing one skinned character and clearly named clips (`idle`, `walk`, `run`, `swim`, `tread`, action names). Animation-only FBX files should contribute actions, not duplicate meshes or armatures.
- Blender may assemble the GLB or transfer garment/armor weights when needed. It must not retarget clips that already share the Mixamo skeleton.
- Log `gltf.animations.map(c => `${c.name} ${c.duration}s ${c.tracks.length} tracks`)` after load and fail loudly on missing or duplicate clip names.
- Keep vertical root motion. For locomotion that must be in-place, pin only horizontal translation on the Hips/Root position track. Mixamo commonly names it `mixamorigHips.position`; offline assembly may rename it `Hips.position` or `Root.position`.

```ts
for (const clip of clips) {
  for (const tr of clip.tracks) {
    if (!/(?:mixamorig)?Hips\.position$|Root\.position$/i.test(tr.name)) continue;
    const v = tr.values, x0 = v[0], z0 = v[2];
    for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; }
  }
}
```

For Mixamo downloads, use FBX Binary at 30 FPS. Download the base character with skin; later clips may be without skin when the assembly tool supports animation-only FBX. Prefer offline conversion to one GLB over shipping multiple FBX files and `FBXLoader` in the runtime.

Authored animation exports may arrive with generic action names. Rename clips
during intake and validate the actual motion visually.

## Asset Intake Checklist

Inspect before shipping:

- File size.
- Triangle count.
- Mesh count.
- Material count.
- Texture count and texture dimensions.
- PBR material behavior under the game lighting rig.
- Scale in meters and `auto_size` assumptions.
- Pivot/origin and bounds.
- Collision proxy separate from detailed mesh.
- Animation clip names, durations, root motion, and in-place behavior.
- Mobile memory/performance impact.

## Game Asset Strategy

- Use Tripo only for model generation and postprocessing. Send bipeds to Mixamo
  through Browser; send non-biped rigs and animation to the GDD-approved
  authored owner.
- Use procedural Three.js kits for high-volume repeated detail such as bolts, windows, track plates, rails, debris, markers, and background silhouettes.
- Use `threejs-image-generator` for concept art, texture references, decals, logos, UI icons, and backdrop images.
- Combine: approved image source -> generated model -> authored finish when
  needed -> Three.js import -> procedural set dressing -> GDD scorecard.

## Performance Discipline

- Use `face_limit`, `smart_low_poly`, conversion, or low-poly postprocess for browser/mobile budgets.
- Prefer one high-fidelity hero asset plus instanced/procedural supporting detail over many unique heavy models.
- Keep textures compressed or reasonably sized.
- Clone carefully. Share geometry/materials when possible.
- Dispose loaded assets when leaving scenes.
- Run renderer diagnostics after importing: calls, triangles, geometries, textures, materials, file sizes.

## Common Fixes

- Model too large/small: normalize bounds in an asset wrapper group.
- Wrong orientation: set a wrapper rotation, or use Tripo image `orientation=align_image` for image inputs.
- Animations move out of place: keep exported root motion intact, then strip
  only horizontal root-position components in code as shown above.
- Too expensive: lower `face_limit`, use `smart_low_poly`, reduce texture quality/size, or convert with a face limit.
- Materials too dark/bright: check color space, tone mapping, environment, and light exposure.
- Collision too complex: build primitive proxies in Three.js and keep Tripo mesh visual-only.

## Final Evidence

Report:

- Provider used per operation: Tripo, Mixamo through Browser, or BlenderMCP.
- Tripo task IDs when Tripo was used.
- Mixamo source FBX, animation names, download settings, and same-character proof when Mixamo was used.
- Downloaded asset paths.
- Model version and generation options.
- Post-process tasks: texture, creature rig/animation, conversion, or offline humanoid GLB assembly.
- Three.js import files changed.
- Renderer diagnostics before/after import.
- Screenshot evidence in active gameplay.
