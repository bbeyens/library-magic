import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import {
  RUNNER_FIREBALL_INSTANCE_CAPACITY,
  runnerFireballInstanceCount,
} from '../src/ui/runnerThreeLane';

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const fireballAsset = new URL('../public/assets/runner/projectiles/fireball.glb', import.meta.url);
const fireballBlend = new URL('../exports/runner/projectiles/fireball.blend', import.meta.url);
const fireballProof = new URL('../exports/runner/projectiles/fireball-proof.png', import.meta.url);

assert.equal(existsSync(fireballAsset), true, 'runner fireball GLB should exist');
assert.equal(existsSync(fireballBlend), true, 'runner fireball Blender source should exist');
assert.equal(existsSync(fireballProof), true, 'runner fireball proof render should exist');
assert.ok(statSync(fireballAsset).size < 100_000, 'runner fireball GLB should stay below 100 KB');

const asset = readFileSync(fireballAsset);
const jsonChunkLength = asset.readUInt32LE(12);
const glb = JSON.parse(asset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
assert.deepEqual(
  glb.materials?.map((material: { name?: string }) => material.name).sort(),
  ['RunnerBoltCore', 'RunnerBoltGlow'],
);
const glowMaterial = glb.materials.find((material: { name?: string }) => material.name === 'RunnerBoltGlow');
assert.equal(glowMaterial.alphaMode, 'BLEND');
assert.equal(glowMaterial.doubleSided, true);

const positionAccessors = glb.meshes[0].primitives.map(
  (primitive: { attributes: { POSITION: number } }) => glb.accessors[primitive.attributes.POSITION],
);
const min = [0, 1, 2].map((axis) => Math.min(...positionAccessors.map((accessor: { min: number[] }) => accessor.min[axis])));
const max = [0, 1, 2].map((axis) => Math.max(...positionAccessors.map((accessor: { max: number[] }) => accessor.max[axis])));
const longitudinalSpan = max[1] - min[1];
const lateralSpan = Math.max(max[0] - min[0], max[2] - min[2]);
assert.equal(longitudinalSpan > lateralSpan * 3, true, 'runner bolt should read as a long streak');

for (const requirement of [
  'InstancedMesh',
  'DynamicDrawUsage',
  "const RUNNER_FIREBALL_ASSET = '/assets/runner/projectiles/fireball.glb';",
  'export const RUNNER_FIREBALL_INSTANCE_CAPACITY = RUNNER_MAX_ACTIVE_PROJECTILES;',
  'runnerFireballInstanceCount(run.bullets.length)',
  'instanceMatrix.setUsage(DynamicDrawUsage)',
  'instanceMatrix.needsUpdate = true',
  'normalizeRunnerBoltMaterial',
  "material.name === 'RunnerBoltGlow'",
  'material.blending = AdditiveBlending',
  'runnerFireballTransform.position.set(bullet.x, 0.72, bullet.z - run.distance)',
  'runnerFireballTransform.rotation.set(Math.PI / 2, 0, 0)',
  'runnerFireballTransform.scale.set(pulse, pulse * 1.45, pulse)',
]) {
  assert.equal(rendererSource.includes(requirement), true, `runner renderer should include ${requirement}`);
}

assert.equal(rendererSource.includes('bulletPool: Mesh[]'), false, 'runner should not keep one Mesh per bullet');
assert.equal(
  rendererSource.includes('new BoxGeometry(0.09, 0.09, 0.5)'),
  false,
  'runner should not render projectiles as blue boxes',
);

assert.equal(runnerFireballInstanceCount(-4), 0);
assert.equal(runnerFireballInstanceCount(1), 1);
assert.equal(runnerFireballInstanceCount(63), 63);
assert.equal(runnerFireballInstanceCount(100), RUNNER_FIREBALL_INSTANCE_CAPACITY);
assert.equal(runnerFireballInstanceCount(999), RUNNER_FIREBALL_INSTANCE_CAPACITY);

console.log('runnerFireballRenderer ok');
