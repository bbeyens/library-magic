import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  RUNNER_IMPACT_INSTANCE_CAPACITY,
  RUNNER_IMPACT_PARTICLES_PER_HIT,
  runnerImpactInstanceCount,
} from '../src/ui/runnerThreeLane';
import { RUNNER_MAX_ACTIVE_IMPACTS } from '../src/game/simulation/runnerRules';

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const manifestUrl = new URL('../exports/runner/fire-impact/source-manifest.json', import.meta.url);

assert.equal(existsSync(manifestUrl), true, 'the Unity fire package manifest should be preserved');
assert.equal(
  existsSync(new URL('../exports/runner/fire-impact/low-poly-fire-particles.unitypackage', import.meta.url)),
  true,
  'the immutable Unity source package should be preserved',
);
assert.equal(
  existsSync(new URL('../exports/runner/fire-impact/yellow-fire-preview.jpg', import.meta.url)),
  true,
  'the selected Yellow-FireWood preview should be preserved',
);

const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));
assert.equal(manifest.selectedPrefab, 'Assets/Low Poly Fire Particles/Prefabs/Yellow-FireWood.prefab');
assert.equal(manifest.particleMesh, 'Unity built-in low-poly mesh 10202');
assert.equal(manifest.startLifetimeSeconds, 3);
assert.equal(manifest.startSpeed, 0.12);
assert.equal(manifest.startSize, 0.3);
assert.deepEqual(manifest.gradient.slice(0, 3), ['#ffffff', '#ffef38', '#ffcd00']);

for (const requirement of [
  'runnerImpactParticles: InstancedMesh;',
  'new BoxGeometry(0.16, 0.16, 0.16)',
  'instanceMatrix.setUsage(DynamicDrawUsage)',
  'syncRunnerImpactParticles(lane, state)',
  'runnerImpactParticles.instanceColor.needsUpdate = true',
  'dataset.runnerImpactInstanceCount',
]) {
  assert.equal(rendererSource.includes(requirement), true, `Runner impact renderer should include ${requirement}`);
}

assert.equal(RUNNER_IMPACT_PARTICLES_PER_HIT, 9);
assert.equal(
  RUNNER_IMPACT_INSTANCE_CAPACITY,
  RUNNER_MAX_ACTIVE_IMPACTS * RUNNER_IMPACT_PARTICLES_PER_HIT,
);
assert.equal(runnerImpactInstanceCount(-1), 0);
assert.equal(runnerImpactInstanceCount(1), RUNNER_IMPACT_PARTICLES_PER_HIT);
assert.equal(
  runnerImpactInstanceCount(RUNNER_MAX_ACTIVE_IMPACTS + 100),
  RUNNER_IMPACT_INSTANCE_CAPACITY,
);

console.log('runnerImpactParticles ok');
