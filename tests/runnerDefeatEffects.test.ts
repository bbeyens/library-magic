import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY,
  RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT,
  RUNNER_DEATH_SMOKE_FILL_DARK,
  RUNNER_DEATH_SMOKE_FILL_LIGHT,
  RUNNER_DEATH_SMOKE_OUTLINE_COLOR,
  RUNNER_COIN_GOLD_COLOR,
  runnerCoinPopupBaseY,
  runnerDeathSmokeStackHeight,
  runnerDeathSmokeInstanceCount,
} from '../src/ui/runnerThreeLane';
import { RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS } from '../src/game/simulation/runnerRules';

const assetUrl = new URL('../public/assets/runner/effects/coin.glb', import.meta.url);
const sourceUrl = new URL('../exports/runner/coin-popup/coin-source.fbx', import.meta.url);
const manifestUrl = new URL('../exports/runner/coin-popup/source-manifest.json', import.meta.url);
const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');

assert.equal(existsSync(assetUrl), true, 'the converted Runner coin GLB should exist');
assert.equal(readFileSync(assetUrl).subarray(0, 4).toString('utf8'), 'glTF', 'the coin asset should be a binary glTF');
assert.equal(existsSync(sourceUrl), true, 'the immutable source coin FBX should be preserved');
assert.equal(existsSync(manifestUrl), true, 'the coin source manifest should be preserved');

for (const requirement of [
  "const RUNNER_COIN_ASSET = '/assets/runner/effects/coin.glb'",
  'runnerCoinInstances: InstancedMesh[];',
  'runnerCoinLabels: Sprite[];',
  'runnerDeathSmoke: InstancedMesh;',
  'runnerDeathSmokeOutline: InstancedMesh;',
  'new SphereGeometry',
  'side: BackSide',
  'syncRunnerDefeatEffects(lane, state)',
  'dataset.runnerDefeatEffectCount',
  'dataset.runnerDeathSmokeInstanceCount',
  "dataset.runnerDeathSmokeStyle = 'cartoon-grey'",
  'dataset.runnerCoinPopupCount',
  "entry.color.set(RUNNER_COIN_GOLD_COLOR)",
  'runnerCoinPopupBaseY(effect.scale)',
]) {
  assert.equal(rendererSource.includes(requirement), true, `Runner defeat renderer should include ${requirement}`);
}

assert.equal(RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT, 7);
assert.equal(RUNNER_DEATH_SMOKE_FILL_DARK, '#9aa0a6');
assert.equal(RUNNER_DEATH_SMOKE_FILL_LIGHT, '#d6d9dd');
assert.equal(RUNNER_DEATH_SMOKE_OUTLINE_COLOR, '#555b62');
assert.equal(runnerDeathSmokeStackHeight(0), 0);
assert.equal(runnerDeathSmokeStackHeight(3), 0.39);
assert.equal(runnerDeathSmokeStackHeight(6), 0.78);
assert.equal(RUNNER_COIN_GOLD_COLOR, '#ffd21f');
assert.equal(runnerCoinPopupBaseY(1), 1.4, 'a normal coin popup starts above the monster head');
assert.equal(runnerCoinPopupBaseY(2), 2.45, 'scaled monsters keep the popup above their head');
assert.equal(
  RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY,
  RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS * RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT,
);
assert.equal(runnerDeathSmokeInstanceCount(-1), 0);
assert.equal(runnerDeathSmokeInstanceCount(1), RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT);
assert.equal(
  runnerDeathSmokeInstanceCount(RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS + 100),
  RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY,
);

console.log('runnerDefeatEffects ok');
