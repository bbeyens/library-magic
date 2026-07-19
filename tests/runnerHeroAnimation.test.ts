import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  RUNNER_INJURED_ANIMATION_MS,
  RUNNER_JUMP_ANIMATION_MS,
  runnerGroundCorrectionY,
  runnerInPlaceRootTrackValues,
  runnerFoxGameplayAnimationState,
  runnerFoxLateralDirection,
  runnerPointerTargetX,
  runnerGameplayAnimationState,
} from '../src/ui/runnerHeroAnimation';
import { createInitialRunnerUpgrades, createRunnerRunState } from '../src/game/simulation/state';

const assetRoot = new URL('../public/assets/runner/heroes/', import.meta.url);
const intakeRoot = new URL('../exports/runner-mixamo/shared/animations/', import.meta.url);

const animations = [
  { file: 'sit-to-stand.glb', source: 'sit-to-stand-source.fbx', clip: 'RunnerSitToStand' },
  { file: 'stand-to-sit.glb', source: 'stand-to-sit-source.fbx', clip: 'RunnerStandToSit' },
  { file: 'injured-run.glb', source: 'injured-run-source.fbx', clip: 'RunnerInjuredRun' },
  { file: 'standard-run.glb', source: 'standard-run-source.fbx', clip: 'RunnerStandardRun' },
  { file: 'fall-flat.glb', source: 'fall-flat-source.fbx', clip: 'RunnerFallFlat' },
] as const;

for (const animation of animations) {
  assert.equal(existsSync(new URL(animation.source, intakeRoot)), true, `${animation.source} should preserve the source FBX`);
  const assetUrl = new URL(animation.file, assetRoot);
  assert.equal(existsSync(assetUrl), true, `${animation.file} should ship with the Runner`);
  const asset = readFileSync(assetUrl);
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'glTF', `${animation.file} should be a valid GLB`);

  const jsonChunkLength = asset.readUInt32LE(12);
  const json = JSON.parse(asset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
  assert.equal(json.meshes?.length ?? 0, 0, `${animation.file} should not duplicate hero geometry`);
  assert.equal(json.skins?.length ?? 0, 0, `${animation.file} should be animation-only`);
  assert.equal(json.animations?.length, 1, `${animation.file} should contain one clip`);
  assert.equal(json.animations[0]?.name, animation.clip, `${animation.file} should preserve its runtime clip name`);
  assert.ok(json.animations[0]?.channels.length >= 120, `${animation.file} should animate the complete rig`);
}

assert.equal(RUNNER_INJURED_ANIMATION_MS, 1_400);
const run = createRunnerRunState(createInitialRunnerUpgrades());
run.running = true;
assert.equal(runnerGameplayAnimationState(run, 10_000), 'standardRun');

run.lastDamageAt = 10_000;
assert.equal(runnerGameplayAnimationState(run, 10_000 + RUNNER_INJURED_ANIMATION_MS - 1), 'injuredRun');
assert.equal(runnerGameplayAnimationState(run, 10_000 + RUNNER_INJURED_ANIMATION_MS), 'standardRun');

run.dead = true;
assert.equal(runnerGameplayAnimationState(run, 10_001), 'fallFlat', 'death overrides the injured state');

run.dead = false;
run.lastDamageAt = null;
assert.equal(runnerFoxLateralDirection(0, 0.2), 'left', 'world +X moves toward screen-left');
assert.equal(runnerFoxLateralDirection(0, -0.2), 'right', 'world -X moves toward screen-right');
assert.equal(runnerFoxLateralDirection(0.2, 0.2), 'idle');
assert.equal(runnerPointerTargetX(0, 0, 100, 2.4), 2.4, 'screen-left maps to positive world X');
assert.equal(runnerPointerTargetX(50, 0, 100, 2.4), 0);
assert.equal(runnerPointerTargetX(100, 0, 100, 2.4), -2.4, 'screen-right maps to negative world X');
assert.deepEqual(
  Array.from(runnerInPlaceRootTrackValues(
    new Float32Array([10, 20, 30, 12, 24, 36]),
    [1, 2, 3],
  )),
  [1, 2, 3, 1, 6, 3],
  'root normalization pins horizontal motion while preserving vertical animation',
);
assert.equal(runnerFoxGameplayAnimationState(run, 10_000, 'left'), 'strafeLeft');
assert.equal(runnerFoxGameplayAnimationState(run, 10_000, 'right'), 'strafeRight');
// Standing idle now plays the shooting animation, phase-locked to the fire cadence.
assert.equal(runnerFoxGameplayAnimationState(run, 10_000, 'idle'), 'shooting');
// Grabbing a bonus triggers a one-shot joyful jump that overrides strafe/shooting for its window.
run.lastBoostAt = 10_000;
assert.equal(runnerFoxGameplayAnimationState(run, 10_100, 'idle'), 'jump');
assert.equal(runnerFoxGameplayAnimationState(run, 10_100, 'left'), 'jump', 'jump overrides strafing');
assert.equal(
  runnerFoxGameplayAnimationState(run, 10_000 + RUNNER_JUMP_ANIMATION_MS + 1, 'idle'),
  'shooting',
  'jump ends after its window',
);
run.lastBoostAt = null;
run.lastDamageAt = 10_000;
assert.equal(
  runnerFoxGameplayAnimationState(run, 10_100, 'left'),
  'injuredRun',
  'damage animation should override strafing',
);

assert.equal(runnerGroundCorrectionY(0.086, 0, 1), -0.086);
assert.ok(Math.abs(runnerGroundCorrectionY(0.086, 0, 1.12) + 0.07678571428571428) < 1e-9);
assert.equal(runnerGroundCorrectionY(0, 0, 1.12), 0);
run.dead = true;
assert.equal(
  runnerFoxGameplayAnimationState(run, 10_100, 'right'),
  'fallFlat',
  'death animation should override strafing',
);

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
for (const requirement of [
  "clip.name === 'FoxIdle'",
  "clip.name === 'FoxStand'",
  "clip.name === 'FoxDeath'",
  'LoopOnce',
  'clampWhenFinished = true',
  "clip.name === 'FoxStrafeLeft'",
  "clip.name === 'FoxStrafeRight'",
  'runnerHeroLateralDirection',
  'runnerFoxLateralDirection(run.playerX, run.playerTargetX)',
  'runnerHeroAnimationStartedAt',
  'latestRunnerPointerTargetX',
  'runnerInPlaceHeroClips',
  'transition.onComplete(pointerTargetX ?? undefined)',
]) {
  assert.equal(rendererSource.includes(requirement), true, `Runner renderer should include ${requirement}`);
}
for (const removedRequirement of [
  'Demongirl',
  'selectedSkin',
  'runnerMenuSelectionTransition',
  'runnerHeroHairDirection',
  'runnerHeroLastX',
]) {
  assert.equal(rendererSource.includes(removedRequirement), false, `Runner renderer should remove ${removedRequirement}`);
}

console.log('runnerHeroAnimation ok');
