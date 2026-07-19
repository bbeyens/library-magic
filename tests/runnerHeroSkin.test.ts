import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const assetRoot = new URL('../public/assets/runner/heroes/', import.meta.url);
const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');

const foxSpec = {
  animations: ['FoxDeath', 'FoxIdle', 'FoxRun', 'FoxSitToStand', 'FoxStand', 'FoxStrafeLeft', 'FoxStrafeRight'],
  materialCount: 3,
  skinCount: 1,
  minimumAnimationChannels: 90,
  requiredNodes: ['Armature', 'mixamorig:Hips', 'mixamorig:Head'],
} as const;

{
  const assetUrl = new URL('boy.glb', assetRoot);
  assert.equal(existsSync(assetUrl), true, 'boy.glb should ship as the Runner Fox');
  const asset = readFileSync(assetUrl);
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'glTF', 'boy.glb should be a valid GLB');

  const jsonChunkLength = asset.readUInt32LE(12);
  const json = JSON.parse(asset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
  assert.equal(json.meshes?.length, 1, 'boy.glb should contain one mesh');
  assert.equal(json.skins?.length ?? 0, foxSpec.skinCount, 'boy.glb should preserve its skin count');
  assert.deepEqual(
    json.animations?.map((animation: { name?: string }) => animation.name).sort(),
    [...foxSpec.animations].sort(),
    'boy.glb should preserve the Fox runtime animation set',
  );
  for (const animation of json.animations ?? []) {
    assert.ok(
      animation.channels.length >= foxSpec.minimumAnimationChannels,
      `Fox ${animation.name} should animate its complete rig`,
    );
  }
  assert.equal(json.materials?.length, foxSpec.materialCount, 'boy.glb should preserve its materials');
  const nodeNames = new Set((json.nodes ?? []).map((node: { name?: string }) => node.name));
  for (const nodeName of foxSpec.requiredNodes) {
    assert.equal(nodeNames.has(nodeName), true, `boy.glb should contain ${nodeName}`);
  }
}

assert.equal(existsSync(new URL('hero-basecolor.png', assetRoot)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/fox-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/running-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/sitting-idle-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/stand-up-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/left-strafe-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/right-strafe-source.fbx', import.meta.url)), true);
assert.equal(existsSync(new URL('../exports/runner-fox/fox.blend', import.meta.url)), true);
const foxRunSource = readFileSync(new URL('../exports/runner-fox/running-source.fbx', import.meta.url));
const foxSittingIdleSource = readFileSync(
  new URL('../exports/runner-fox/sitting-idle-source.fbx', import.meta.url),
);
const foxLeftStrafeSource = readFileSync(new URL('../exports/runner-fox/left-strafe-source.fbx', import.meta.url));
const foxRightStrafeSource = readFileSync(new URL('../exports/runner-fox/right-strafe-source.fbx', import.meta.url));
const foxExportReport = JSON.parse(
  readFileSync(new URL('../exports/runner-fox/export-report.json', import.meta.url), 'utf8'),
);
assert.equal(foxExportReport.runSource, 'exports/runner-fox/running-source.fbx');
assert.equal(foxExportReport.runSourceBytes, foxRunSource.byteLength);
assert.equal(foxExportReport.runSourceSha256, createHash('sha256').update(foxRunSource).digest('hex'));
assert.equal(foxExportReport.runReplacement.sourceAction, 'Armature|mixamo.com|Layer0');
assert.deepEqual(foxExportReport.runReplacement.frameRange, [1, 27]);
assert.equal(foxExportReport.runReplacement.boneCount, 33);
assert.equal(foxExportReport.runReplacement.sharedBoneCount, 33);
assert.equal(foxExportReport.runReplacement.maxBindDelta <= 0.0001, true);
assert.equal(foxExportReport.runReplacement.loopRootDelta <= 0.001, true);
assert.equal(foxExportReport.idleSource, 'exports/runner-fox/sitting-idle-source.fbx');
assert.equal(foxExportReport.idleSourceBytes, foxSittingIdleSource.byteLength);
assert.equal(
  foxExportReport.idleSourceSha256,
  createHash('sha256').update(foxSittingIdleSource).digest('hex'),
);
assert.equal(foxExportReport.idleReplacement.sourceAction, 'Armature|mixamo.com|Layer0');
assert.deepEqual(foxExportReport.idleReplacement.frameRange, [1, 309]);
assert.equal(foxExportReport.idleReplacement.boneCount, 33);
assert.equal(foxExportReport.idleReplacement.sharedBoneCount, 33);
assert.equal(foxExportReport.idleReplacement.maxBindDelta <= 0.0001, true);
assert.equal(foxExportReport.idleReplacement.loopRootDelta <= 0.001, true);
assert.equal(foxExportReport.leftStrafeSource, 'exports/runner-fox/left-strafe-source.fbx');
assert.equal(foxExportReport.leftStrafeSourceBytes, foxLeftStrafeSource.byteLength);
assert.equal(
  foxExportReport.leftStrafeSourceSha256,
  createHash('sha256').update(foxLeftStrafeSource).digest('hex'),
);
assert.equal(foxExportReport.leftStrafeReplacement.boneCount, 33);
assert.equal(foxExportReport.leftStrafeReplacement.sharedBoneCount, 33);
assert.equal(foxExportReport.leftStrafeReplacement.maxBindDelta <= 0.0001, true);
assert.equal(foxExportReport.leftStrafeReplacement.loopRootDelta <= 0.001, true);
assert.equal(foxExportReport.rightStrafeSource, 'exports/runner-fox/right-strafe-source.fbx');
assert.equal(foxExportReport.rightStrafeSourceBytes, foxRightStrafeSource.byteLength);
assert.equal(
  foxExportReport.rightStrafeSourceSha256,
  createHash('sha256').update(foxRightStrafeSource).digest('hex'),
);
assert.equal(foxExportReport.rightStrafeReplacement.boneCount, 33);
assert.equal(foxExportReport.rightStrafeReplacement.sharedBoneCount, 33);
assert.equal(foxExportReport.rightStrafeReplacement.maxBindDelta <= 0.0001, true);
assert.equal(foxExportReport.rightStrafeReplacement.loopRootDelta <= 0.001, true);
for (const sourceRequirement of [
  "const RUNNER_FOX_ASSET = '/assets/runner/heroes/boy.glb';",
  "clip.name === 'FoxIdle'",
  "clip.name === 'FoxStand'",
  "clip.name === 'FoxDeath'",
  "clip.name === 'FoxStrafeLeft'",
  "clip.name === 'FoxStrafeRight'",
  "'mixamorig:Hips'",
  "'mixamorig:LeftUpLeg'",
  'runnerMenuHeroMixer',
  'actions.standing = mixer.clipAction(template.heroClips.standing)',
  'syncRunnerFoxHero(lane)',
  'syncRunnerMenuHeroModels(lane)',
  'lane.playerHero.visible = count > 0 || run.dead',
]) {
  assert.equal(rendererSource.includes(sourceRequirement), true, `runner renderer should include ${sourceRequirement}`);
}
assert.equal(
  rendererSource.includes("clip.name === 'FoxRun'"),
  false,
  'the stationary Runner hero should not load a gameplay run clip',
);
assert.equal(
  rendererSource.includes('runnerMenuProceduralSeated = true'),
  false,
  'the authored fox sitting clip should not receive the old procedural sitting pose',
);
assert.equal(rendererSource.includes('girl-sitting.glb'), false, 'the old pink girl sitting animation should be unused');
for (const removedRequirement of [
  'girl.glb',
  'Demongirl',
  'selectedSkin',
  'selectRunnerSkin',
  'runner-menu-hero-hit',
  'runner-menu-hero-selection',
]) {
  assert.equal(rendererSource.includes(removedRequirement), false, `runner renderer should remove ${removedRequirement}`);
}
for (const hudRequirement of [
  'aria-label="Terrain du Runner"',
  '<strong>Runner</strong>',
  'data-action="startRunnerRun"',
]) {
  assert.equal(hudSource.includes(hudRequirement), true, `runner hub should include ${hudRequirement}`);
}
assert.equal(hudSource.includes('selectRunnerSkin'), false, 'Runner HUD should not expose skin selection');
assert.equal(hudSource.includes('-preview.png'), false, 'the hub should use the live 3D heroes instead of preview cards');

console.log('runnerHeroSkin ok');
