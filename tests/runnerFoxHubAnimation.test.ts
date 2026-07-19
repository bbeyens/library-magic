import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const boyAsset = readFileSync(new URL('../public/assets/runner/heroes/boy.glb', import.meta.url));
const jsonChunkLength = boyAsset.readUInt32LE(12);
const boyGlb = JSON.parse(boyAsset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
assert.deepEqual(
  boyGlb.animations?.map((animation: { name?: string }) => animation.name).sort(),
  ['FoxDeath', 'FoxIdle', 'FoxRun', 'FoxSitToStand', 'FoxStand', 'FoxStrafeLeft', 'FoxStrafeRight'],
);
assert.equal(boyGlb.meshes?.length, 1);
assert.equal(boyGlb.skins?.length, 1);
assert.equal(boyGlb.materials?.length, 3);

const sittingSource = readFileSync(new URL('../exports/runner-fox/sitting-idle-source.fbx', import.meta.url));
const exportReport = JSON.parse(
  readFileSync(new URL('../exports/runner-fox/export-report.json', import.meta.url), 'utf8'),
);
assert.equal(exportReport.idleSource, 'exports/runner-fox/sitting-idle-source.fbx');
assert.equal(exportReport.idleSourceBytes, sittingSource.byteLength);
assert.equal(
  exportReport.idleSourceSha256,
  createHash('sha256').update(sittingSource).digest('hex'),
);
assert.deepEqual(exportReport.idleReplacement.frameRange, [1, 309]);
assert.equal(exportReport.idleReplacement.boneCount, 33);
assert.equal(exportReport.idleReplacement.sharedBoneCount, 33);
assert.equal(exportReport.idleReplacement.maxBindDelta <= 0.0001, true);
assert.equal(exportReport.idleReplacement.loopRootDelta <= 0.001, true);
assert.equal(exportReport.idleReplacement.runtimeChannelCount, 102);

const standUpSource = readFileSync(new URL('../exports/runner-fox/stand-up-source.fbx', import.meta.url));
assert.equal(exportReport.standUpSource, 'exports/runner-fox/stand-up-source.fbx');
assert.equal(exportReport.standUpSourceBytes, standUpSource.byteLength);
assert.equal(
  exportReport.standUpSourceSha256,
  createHash('sha256').update(standUpSource).digest('hex'),
);
assert.deepEqual(exportReport.standUpReplacement.frameRange, [1, 74]);
assert.equal(exportReport.standUpReplacement.boneCount, 33);
assert.equal(exportReport.standUpReplacement.sharedBoneCount, 33);
assert.equal(exportReport.standUpReplacement.maxBindDelta <= 0.0001, true);
assert.equal(exportReport.standUpReplacement.rootDelta > 0.1, true);
assert.equal(exportReport.standUpReplacement.runtimeChannelCount, 102);
assert.equal(exportReport.standUpReplacement.runtimeDurationSeconds > 2.4, true);
assert.equal(exportReport.standUpReplacement.runtimeDurationSeconds < 2.5, true);

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
for (const requirement of [
  "clip.name === 'FoxStand'",
  "clip.name === 'FoxSitToStand'",
  'sitToStand: standUp?.clone()',
  'actions.standing = mixer.clipAction(template.heroClips.standing)',
  "const transitionAction = animation === 'sitToStand' ? actions?.sitToStand : undefined;",
  'runnerMenuStandDurationMs(lane)',
  'const standingWeight = 1 - sittingWeight;',
  'hero.userData.runnerMenuProceduralSeated = false;',
  'groundRunnerFoxModel(model)',
]) {
  assert.equal(rendererSource.includes(requirement), true, `runner fox hub should include ${requirement}`);
}

console.log('runnerFoxHubAnimation ok');
