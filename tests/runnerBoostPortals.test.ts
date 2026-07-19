import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { applyAction, tickState } from '../src/game/simulation/actions.ts';
import {
  runnerAttackCount,
  runnerBaseDamage,
  runnerEffectiveUpgradeLevel,
  runnerNextBoostPortalDistance,
  runnerUpgradeMaxLevel,
  RUNNER_BOOST_PORTAL_INTERVAL,
  RUNNER_BOOST_PORTAL_LEFT_X,
  RUNNER_BOOST_UPGRADE_IDS,
  RUNNER_UPGRADE_IDS,
} from '../src/game/simulation/runnerRules.ts';
import { createInitialState, type GameState, type RunnerBoostPortalPair } from '../src/game/simulation/state.ts';

function createRunningState(): GameState {
  const state = createInitialState();
  state.books.runner.unlocked = true;
  state.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  state.selectedBook = 'runner';
  applyAction(state, { type: 'startRunnerRun' });
  state.runner.enemySpawnTimer = 100;
  state.runner.nextGateDistance = Number.POSITIVE_INFINITY;
  state.runner.nextBossDistance = Number.POSITIVE_INFINITY;
  state.runner.fireCooldown = 100;
  return state;
}

function portalPair(z: number, left = 'baseDamage', right = 'multishot'): RunnerBoostPortalPair {
  return {
    id: 900,
    z,
    leftUpgradeId: left as RunnerBoostPortalPair['leftUpgradeId'],
    rightUpgradeId: right as RunnerBoostPortalPair['rightUpgradeId'],
  };
}

assert.equal(RUNNER_BOOST_PORTAL_INTERVAL, 50);
assert.equal(runnerNextBoostPortalDistance(0), 50);
assert.equal(runnerNextBoostPortalDistance(50), 100);
assert.equal(runnerNextBoostPortalDistance(500), 550);
assert.deepEqual(RUNNER_BOOST_UPGRADE_IDS, RUNNER_UPGRADE_IDS, 'every Runner skill is eligible');

// Every offered skill records a temporary level; live combat stats update immediately.
for (const upgradeId of RUNNER_BOOST_UPGRADE_IDS) {
  const state = createRunningState();
  const run = state.runner;
  run.speed = 1;
  run.distance = 10;
  run.playerX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.playerTargetX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.boostPortals = [portalPair(10.01, upgradeId, 'baseDamage')];
  run.nextBoostPortalDistance = Number.POSITIVE_INFINITY;
  const before = {
    units: run.units,
    damage: run.damage,
    fireRate: run.fireRate,
    lateralSpeed: run.lateralSpeed,
    attackRange: run.attackRange,
    attacks: run.attacks,
    homingStrength: run.homingStrength,
    projectileSpeed: run.projectileSpeed,
  };
  state.lastTick = 500;
  tickState(state, 550);

  assert.equal(run.temporaryUpgrades[upgradeId], 1, `${upgradeId} should gain one temporary level`);
  assert.equal(
    runnerEffectiveUpgradeLevel(state.runnerMeta.upgrades, run.temporaryUpgrades, upgradeId),
    1,
  );
  switch (upgradeId) {
    case 'baseDamage': assert.ok(run.damage > before.damage); break;
    case 'startUnits': assert.equal(run.units, before.units + 1); break;
    case 'baseFireRate': assert.ok(run.fireRate > before.fireRate); break;
    case 'lateralSpeed': assert.ok(run.lateralSpeed > before.lateralSpeed); break;
    case 'attackRange': assert.ok(run.attackRange > before.attackRange); break;
    case 'multishot': assert.equal(run.attacks, before.attacks + 1); break;
    case 'homing': assert.ok(run.homingStrength > before.homingStrength); break;
    case 'projectileSpeed': assert.ok(run.projectileSpeed > before.projectileSpeed); break;
    case 'gateQuality':
    case 'coinGain':
      break;
  }
}

// The first pair enters the world at 50 m and schedules the next pair exactly 50 m later.
{
  const state = createRunningState();
  const run = state.runner;
  run.distance = 6;
  run.nextBoostPortalDistance = 50;
  state.lastTick = 1_000;
  tickState(state, 1_050);

  assert.equal(run.boostPortals.length, 1);
  assert.equal(run.boostPortals[0]?.z, 50);
  assert.notEqual(run.boostPortals[0]?.leftUpgradeId, run.boostPortals[0]?.rightUpgradeId);
  assert.equal(run.nextBoostPortalDistance, 100);
}

// Crossing one side atomically grants only that choice and removes the whole pair.
{
  const state = createRunningState();
  const run = state.runner;
  run.distance = 49.9;
  run.playerX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.playerTargetX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.boostPortals = [portalPair(50)];
  run.nextBoostPortalDistance = Number.POSITIVE_INFINITY;
  state.lastTick = 2_000;
  tickState(state, 2_050);

  assert.equal(run.temporaryUpgrades.baseDamage, 1);
  assert.equal(run.temporaryUpgrades.multishot, 0);
  assert.equal(run.boostPortals.length, 0);
  assert.equal(run.lastBoostUpgradeId, 'baseDamage');
  assert.equal(run.damage, runnerBaseDamage(1));

  tickState(state, 2_100);
  assert.equal(run.temporaryUpgrades.baseDamage, 1, 'a resolved pair cannot be collected twice');
}

// The center is a dead zone: it can never overlap both choices or grant two bonuses.
{
  const state = createRunningState();
  const run = state.runner;
  run.distance = 49.9;
  run.playerX = 0;
  run.playerTargetX = 0;
  run.boostPortals = [portalPair(50)];
  run.nextBoostPortalDistance = Number.POSITIVE_INFINITY;
  state.lastTick = 3_000;
  tickState(state, 3_050);

  assert.equal(run.boostPortals.length, 0, 'a missed pair is removed after crossing');
  assert.equal(run.temporaryUpgrades.baseDamage, 0);
  assert.equal(run.temporaryUpgrades.multishot, 0);
  assert.equal(run.lastBoostUpgradeId, null);
}

// Temporary levels stack beyond permanent max levels and still affect the live run.
{
  const state = createInitialState();
  state.books.runner.unlocked = true;
  state.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  state.selectedBook = 'runner';
  state.runnerMeta.upgrades.baseDamage = runnerUpgradeMaxLevel('baseDamage');
  state.runnerMeta.upgrades.multishot = runnerUpgradeMaxLevel('multishot');
  applyAction(state, { type: 'startRunnerRun' });
  const run = state.runner;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = Number.POSITIVE_INFINITY;
  run.nextBossDistance = Number.POSITIVE_INFINITY;
  run.nextBoostPortalDistance = Number.POSITIVE_INFINITY;
  run.fireCooldown = 100;
  run.distance = 49.9;
  run.playerX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.playerTargetX = RUNNER_BOOST_PORTAL_LEFT_X;
  run.boostPortals = [portalPair(50, 'baseDamage', 'coinGain')];
  state.lastTick = 4_000;
  tickState(state, 4_050);

  assert.equal(
    runnerEffectiveUpgradeLevel(state.runnerMeta.upgrades, run.temporaryUpgrades, 'baseDamage'),
    runnerUpgradeMaxLevel('baseDamage') + 1,
  );
  assert.equal(run.damage, runnerBaseDamage(runnerUpgradeMaxLevel('baseDamage') + 1));

  run.boostPortals = [portalPair(run.distance + 0.1, 'multishot', 'coinGain')];
  tickState(state, 4_100);
  assert.equal(run.attacks, runnerAttackCount(runnerUpgradeMaxLevel('multishot') + 1));
  assert.ok(run.attacks > runnerAttackCount(runnerUpgradeMaxLevel('multishot')));

  applyAction(state, { type: 'startRunnerRun' });
  assert.ok(RUNNER_UPGRADE_IDS.every((id) => state.runner.temporaryUpgrades[id] === 0));
  assert.equal(state.runner.lastBoostUpgradeId, null);
}

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
for (const requiredSource of [
  'boostPortals: Group;',
  'syncRunnerBoostPortals(lane, state)',
  'RUNNER_BOOST_PORTAL_LABELS',
  'dataset.runnerBoostPortalCount',
  'dataset.runnerBoostPortalLeft',
  'dataset.runnerBoostPortalRight',
]) {
  assert.equal(rendererSource.includes(requiredSource), true, `Runner portal renderer should include ${requiredSource}`);
}

console.log('runnerBoostPortals ok');
