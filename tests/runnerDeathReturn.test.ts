import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { applyAction, tickState } from '../src/game/simulation/actions';
import {
  RUNNER_DEATH_ANIMATION_MS,
  RUNNER_DEATH_FADE_MS,
  RUNNER_MENU_FADE_IN_MS,
  runnerDeathTransitionPhase,
} from '../src/game/simulation/runnerDeathTransition';
import { createInitialState } from '../src/game/simulation/state';

const state = createInitialState();
state.books.runner.unlocked = true;
state.openBookPanels = [{ bookId: 'runner', slot: 0 }];
state.selectedBook = 'runner';
state.lastTick = 0;
applyAction(state, { type: 'startRunnerRun' });

state.runner.units = 1;
state.runner.fireCooldown = 100;
state.runner.enemySpawnTimer = 100;
state.runner.nextGateDistance = 1e9;
state.runner.enemies = [
  {
    id: 9001,
    x: state.runner.playerX,
    z: state.runner.distance + 0.01,
    health: 2,
    maxHealth: 2,
  },
];

tickState(state, 100);
assert.equal(state.runner.dead, true, 'contact with the last unit starts the death sequence');
assert.equal(state.runner.deathAt, 100);
assert.equal(runnerDeathTransitionPhase(state.runner, 100), 'falling');

tickState(state, 100 + RUNNER_DEATH_ANIMATION_MS - 1);
assert.equal(state.runner.dead, true, 'the run stays dead through the complete Fall Flat clip');
assert.equal(runnerDeathTransitionPhase(state.runner, state.lastTick), 'falling');

tickState(state, 100 + RUNNER_DEATH_ANIMATION_MS);
assert.equal(state.runner.dead, true, 'the fade starts without revealing the character menu');
assert.equal(runnerDeathTransitionPhase(state.runner, state.lastTick), 'fading-out');

tickState(state, 100 + RUNNER_DEATH_ANIMATION_MS + RUNNER_DEATH_FADE_MS - 1);
assert.equal(state.runner.dead, true, 'the gameplay view remains mounted until the fade is opaque');

const menuReturnAt = 100 + RUNNER_DEATH_ANIMATION_MS + RUNNER_DEATH_FADE_MS;
tickState(state, menuReturnAt);
assert.equal(state.runner.dead, false, 'the run resets only after the death fade finishes');
assert.equal(state.runner.running, false, 'the returned Runner is at the home menu');
assert.equal(state.runner.menuReturnAt, menuReturnAt, 'the menu records its fade-in start');
assert.equal(runnerDeathTransitionPhase(state.runner, state.lastTick), 'fading-in');

tickState(state, menuReturnAt + RUNNER_MENU_FADE_IN_MS);
assert.equal(state.runner.menuReturnAt, null, 'the menu fade marker clears after the camp is visible');
assert.equal(runnerDeathTransitionPhase(state.runner, state.lastTick), 'none');

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

assert.equal(
  hudSource.includes("const overlay = run.running || run.dead ? '' : runnerHub(state);"),
  true,
  'the Runner home menu must stay hidden throughout the death sequence',
);
for (const requirement of [
  "'is-runner-death-fading'",
  "'is-runner-menu-fading-in'",
  'handledRunnerMenuReturnAt = state.runner.menuReturnAt;',
  'state.runner.running || state.runner.dead',
]) {
  assert.equal(rendererSource.includes(requirement), true, `runner renderer should include ${requirement}`);
}
for (const requirement of [
  '.runner-lane-frame.is-runner-death-fading::after',
  '.runner-lane-frame.is-runner-menu-fading-in::after',
  '@keyframes runner-death-fade-out',
  '@keyframes runner-menu-fade-in',
]) {
  assert.equal(styleSource.includes(requirement), true, `runner fade CSS should include ${requirement}`);
}

console.log('runnerDeathReturn ok');
