import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  RUNNER_MAX_MULTISHOT_ORBS,
  runnerMultishotOrbFormation,
  runnerMultishotOrbReflow,
} from '../src/ui/runnerMultishotOrbs';

assert.equal(RUNNER_MAX_MULTISHOT_ORBS, 20);

for (let level = 0; level <= RUNNER_MAX_MULTISHOT_ORBS; level += 1) {
  const formation = runnerMultishotOrbFormation(level);
  assert.equal(formation.length, level, `multishot ${level} should show ${level} orbs`);
  if (formation.length > 1) {
    assert.equal(
      Math.abs(formation.reduce((sum, orb) => sum + orb.x, 0)) < 1e-9,
      true,
      `multishot ${level} should stay horizontally centered`,
    );
    assert.equal(
      Math.abs(formation.reduce((sum, orb) => sum + orb.z, 0)) < 1e-9,
      true,
      `multishot ${level} should stay depth-centered`,
    );
  }
  assert.equal(formation.every((orb) => orb.y >= 0.55), true, 'orbs should never sit below the Fox');
}

const fiveOrbFormation = runnerMultishotOrbFormation(5);
assert.equal(fiveOrbFormation.some((orb) => orb.x < -0.2), true, 'five orbs should occupy the left side');
assert.equal(fiveOrbFormation.some((orb) => orb.x > 0.2), true, 'five orbs should occupy the right side');
assert.equal(fiveOrbFormation.some((orb) => orb.z < -0.2), true, 'five orbs should sit in front of the Fox');
assert.equal(fiveOrbFormation.some((orb) => orb.z > 0.2), true, 'five orbs should sit behind the Fox');
assert.ok(
  Math.max(...fiveOrbFormation.map((orb) => orb.y)) - Math.min(...fiveOrbFormation.map((orb) => orb.y)) > 0.5,
  'five orbs should use visibly different heights',
);

const twentyOrbFormation = runnerMultishotOrbFormation(20);
let minimumOrbDistance = Infinity;
for (let first = 0; first < twentyOrbFormation.length; first += 1) {
  for (let second = first + 1; second < twentyOrbFormation.length; second += 1) {
    const a = twentyOrbFormation[first]!;
    const b = twentyOrbFormation[second]!;
    minimumOrbDistance = Math.min(minimumOrbDistance, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
  }
}
assert.ok(minimumOrbDistance > 0.28, 'twenty orbs should retain readable spacing');

const fourOrbs = runnerMultishotOrbFormation(4);
const sixOrbs = runnerMultishotOrbFormation(6);
const halfwayAdded = runnerMultishotOrbReflow(fourOrbs, sixOrbs, 0.5);
assert.equal(halfwayAdded.length, 6, 'adding orbs expands the live formation immediately');
assert.notDeepEqual(halfwayAdded, sixOrbs, 'adding orbs should not teleport directly to the target');
assert.deepEqual(runnerMultishotOrbReflow(halfwayAdded, sixOrbs, 1), sixOrbs, 'reflow reaches its target');
const halfwayRemoved = runnerMultishotOrbReflow(sixOrbs, fourOrbs, 0.5);
assert.equal(halfwayRemoved.length, 4, 'removing orbs contracts the live formation automatically');
assert.notDeepEqual(halfwayRemoved, fourOrbs, 'remaining orbs should glide into their new positions');

assert.equal(runnerMultishotOrbFormation(99).length, RUNNER_MAX_MULTISHOT_ORBS);
assert.equal(runnerMultishotOrbFormation(-4).length, 0);

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
for (const requirement of [
  'AdditiveBlending',
  'ConeGeometry',
  'SphereGeometry',
  'TorusGeometry',
  'runnerMultishotOrbFormation',
  'runnerMultishotOrbReflow',
  'Math.max(0, state.runner.attacks - RUNNER_BASE_ATTACKS)',
  'runnerOrbPreview',
  'runnerMultishotOrbCore',
  'runnerMultishotOrbGlow',
  'runnerMultishotOrbHalo',
  'runnerMultishotOrbWisp',
  'dataset.runnerMultishotOrbCount',
  "dataset.runnerMultishotOrbLayout = 'dynamic-orbit'",
  "dataset.runnerMultishotOrbDrawCalls = formation.length > 0 ? '4' : '0'",
]) {
  assert.equal(rendererSource.includes(requirement), true, `runner orbs should include ${requirement}`);
}

console.log('runnerMultishotOrbs ok');
