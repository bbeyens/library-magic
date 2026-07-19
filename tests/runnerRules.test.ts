import assert from 'node:assert/strict';

import {
  runnerAvailableCheckpoints,
  runnerAttackCount,
  runnerBaseDamage,
  runnerBaseFireRate,
  runnerAttackRange,
  runnerBossHealth,
  runnerCoinTier,
  runnerCoinsPerKill,
  runnerEnemyHealth,
  runnerEnemySpawnInterval,
  runnerGateShotsRequired,
  runnerGateUpgradeChance,
  runnerHomingStrength,
  runnerLateralSpeed,
  runnerMultishotProjectiles,
  runnerNextBossDistance,
  runnerProjectileSpeed,
  runnerStartUnits,
  runnerUpgradeCost,
  runnerUpgradeMaxLevel,
  RUNNER_COIN_TIER_DISTANCE,
  RUNNER_DEFEAT_EFFECT_LIFETIME_MS,
  RUNNER_BASE_ATTACKS,
  RUNNER_PROJECTILE_HIT_LOOKAHEAD,
  RUNNER_ENEMY_SPEED,
  RUNNER_ENEMY_TARGETABLE_AHEAD,
  RUNNER_MAX_ACTIVE_PROJECTILES,
  RUNNER_MAX_ACTIVE_IMPACTS,
  RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS,
  RUNNER_MAX_ATTACKS,
  RUNNER_MAX_TEMPORARY_MULTISHOT,
  RUNNER_PROJECTILE_LAUNCH_OFFSET,
  RUNNER_SPAWN_AHEAD,
  RUNNER_UPGRADE_IDS,
} from '../src/game/simulation/runnerRules.ts';
import { applyAction, tickState } from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

// --- Permanent upgrades ----------------------------------------------------

const expectedRunnerStartingCosts = {
  baseDamage: 1,
  startUnits: 2,
  baseFireRate: 3,
  lateralSpeed: 2,
  attackRange: 3,
  multishot: 8,
  homing: 6,
  projectileSpeed: 3,
  gateQuality: 4,
  coinFlat: 3,
  coinGain: 3,
} as const;

for (const upgradeId of RUNNER_UPGRADE_IDS) {
  assert.ok(runnerUpgradeMaxLevel(upgradeId) > 0, `${upgradeId} should be buyable`);
  assert.equal(
    runnerUpgradeCost(upgradeId, 0),
    expectedRunnerStartingCosts[upgradeId],
    `${upgradeId} should have an affordable starting cost`,
  );
  for (let level = 1; level < runnerUpgradeMaxLevel(upgradeId); level += 1) {
    assert.ok(
      runnerUpgradeCost(upgradeId, level) > runnerUpgradeCost(upgradeId, level - 1),
      `${upgradeId} cost should increase at level ${level}`,
    );
  }
}

assert.deepEqual(
  Array.from({ length: 6 }, (_, level) => runnerUpgradeCost('baseDamage', level)),
  [1, 2, 3, 4, 6, 9],
  'damage starts at one coin, stays gentle, then accelerates',
);
assert.ok(
  Math.max(...RUNNER_UPGRADE_IDS.map((upgradeId) => runnerUpgradeCost(upgradeId, 0))) <= 8,
  'every first upgrade should be reachable in the opening runs',
);

assert.equal(runnerStartUnits(0), 3);
assert.equal(runnerStartUnits(4), 7);
assert.ok(runnerBaseDamage(2) > runnerBaseDamage(0));
assert.ok(runnerBaseFireRate(2) > runnerBaseFireRate(0));
assert.ok(runnerLateralSpeed(5) > runnerLateralSpeed(0));
assert.equal(runnerAttackRange(0), 12);
assert.equal(runnerAttackRange(1), 14, 'range level one stays at the requested 14 m');
assert.equal(runnerAttackRange(runnerUpgradeMaxLevel('attackRange')), 42);
assert.equal(RUNNER_PROJECTILE_HIT_LOOKAHEAD, 0.75);
assert.equal(runnerMultishotProjectiles(0), 0);
assert.equal(runnerMultishotProjectiles(99), RUNNER_MAX_TEMPORARY_MULTISHOT);
assert.equal(RUNNER_BASE_ATTACKS, 1, 'the base attack fires exactly one projectile');
assert.equal(runnerAttackCount(0), 1);
assert.equal(runnerAttackCount(2), 3, 'multishot is the only source of extra projectiles');
assert.equal(runnerAttackCount(99), RUNNER_MAX_ATTACKS);
assert.equal(runnerHomingStrength(0), 0);
assert.ok(runnerHomingStrength(1) > 0);
assert.ok(runnerProjectileSpeed(5) > runnerProjectileSpeed(0));
assert.equal(RUNNER_PROJECTILE_LAUNCH_OFFSET, 1.25);

// --- Distance progression, bosses and checkpoints -------------------------

assert.equal(runnerEnemyHealth(0), 5);
assert.equal(runnerEnemyHealth(25), 6);
assert.equal(runnerEnemyHealth(50), 7);
assert.equal(runnerEnemyHealth(75), 8);
assert.equal(runnerEnemyHealth(99), 10);
assert.equal(runnerEnemyHealth(100), 10);
assert.equal(runnerEnemyHealth(150), 14);
assert.equal(runnerEnemyHealth(200), 20);
assert.equal(runnerEnemyHealth(250), 28);
assert.equal(runnerEnemyHealth(300), 40);
assert.ok(runnerBossHealth(100) > runnerEnemyHealth(100), 'a boss is tougher than its distance tier');
assert.equal(runnerNextBossDistance(0), 100);
assert.equal(runnerNextBossDistance(99), 100);
assert.equal(runnerNextBossDistance(100), 200, 'a checkpoint on a boss mark resumes after it');
assert.equal(runnerNextBossDistance(500), 600);
assert.deepEqual(runnerAvailableCheckpoints(499), [0]);
assert.deepEqual(runnerAvailableCheckpoints(500), [0, 500]);
assert.deepEqual(runnerAvailableCheckpoints(1_250), [0, 500, 1_000]);

// gateQuality is the "+1 sometimes rolls +2" upgrade, and must stay a gamble.
assert.equal(runnerGateUpgradeChance(0), 0);
assert.equal(runnerGateUpgradeChance(runnerUpgradeMaxLevel('gateQuality')), 0.6);
assert.ok(
  runnerGateUpgradeChance(runnerUpgradeMaxLevel('gateQuality') + 1) > 0.6,
  'temporary portal levels can improve gate quality beyond the permanent cap',
);
assert.ok(runnerGateUpgradeChance(99) <= 0.95);

// --- Gates cost more and more shots ---------------------------------------

assert.ok(runnerGateShotsRequired(1) > runnerGateShotsRequired(0));
assert.ok(runnerGateShotsRequired(8) > runnerGateShotsRequired(4));

// --- Coins scale by distance tier -----------------------------------------

assert.equal(runnerCoinTier(0), 0);
assert.equal(runnerCoinTier(RUNNER_COIN_TIER_DISTANCE), 1);
assert.ok(
  runnerCoinsPerKill(RUNNER_COIN_TIER_DISTANCE * 6, 0) > runnerCoinsPerKill(0, 0),
  'killing further down the lane should pay more',
);
assert.ok(runnerCoinsPerKill(0, 5) > runnerCoinsPerKill(0, 0), 'coinGain should pay more');
assert.ok(runnerCoinsPerKill(0, 0, 5) > runnerCoinsPerKill(0, 0, 0), 'coinFlat should pay more');

// --- Enemies get harder ----------------------------------------------------

assert.ok(runnerEnemyHealth(600) > runnerEnemyHealth(0));
assert.equal(runnerEnemySpawnInterval(0), 1.46, 'opening enemies should have room between them');
assert.equal(runnerEnemySpawnInterval(700), 0.69, 'spawn pressure should rise gradually with distance');
assert.equal(runnerEnemySpawnInterval(1_400), 0.34, 'late enemies keep a readable minimum spacing');
assert.ok(runnerEnemySpawnInterval(900) < runnerEnemySpawnInterval(0));
assert.equal(RUNNER_ENEMY_SPEED, 1.6, 'enemies should use the slower 1.6 approach speed');

// --- Run lifecycle ---------------------------------------------------------

const state = createInitialState();
state.books.runner.unlocked = true;
state.openBookPanels = [{ bookId: 'runner', slot: 0 }];
state.selectedBook = 'runner';

// A run only advances once started.
assert.equal(state.runner.running, false);
applyAction(state, { type: 'startRunnerRun' });
assert.equal(state.runner.running, true);
assert.equal(state.runner.dead, false);
assert.equal(state.runner.units, runnerStartUnits(0));

// Advancing the sim moves the squad down the lane.
let now = 0;
state.lastTick = now;
for (let step = 0; step < 30; step += 1) {
  now += 16;
  tickState(state, now);
}
assert.ok(state.runner.distance > 0, 'the squad should travel forward');

{
  const positioned = createInitialState();
  positioned.books.runner.unlocked = true;
  positioned.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  positioned.selectedBook = 'runner';
  applyAction(positioned, { type: 'startRunnerRun', playerX: 1.75 });
  assert.equal(positioned.runner.playerX, 1.75, 'the launch starts directly under the remembered cursor');
  assert.equal(positioned.runner.playerTargetX, 1.75, 'the launch has no lateral catch-up movement');
}

// The squad only ever moves sideways, and stays inside the lane.
applyAction(state, { type: 'moveRunnerPlayer', x: 99 });
assert.equal(state.runner.playerTargetX, 2.4, 'the cursor position is clamped to the road');
const xBeforeSteering = state.runner.playerX;
now += 16;
tickState(state, now);
assert.ok(state.runner.playerX > xBeforeSteering, 'the squad moves toward the cursor target');
assert.ok(state.runner.playerX < state.runner.playerTargetX, 'lateral movement is speed-limited');

// Contact damage is the enemy's remaining health. Hurting it before impact directly reduces
// the number of units lost; the legacy editor contactDamage value no longer overrides this.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 10;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.enemies = [
    {
      id: 998,
      x: run.playerX,
      z: run.distance + 0.01,
      health: 4,
      maxHealth: 9,
      contactDamage: 1,
    },
  ];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.units, 6, 'an enemy with 4 remaining health removes exactly 4 units');
  assert.equal(run.lastDamageAt, 50, 'enemy contact records the exact gameplay hit time');
  assert.equal(run.dead, false, 'the run continues while units remain');
  assert.equal(run.enemies.length, 0, 'the enemy is consumed by the contact');
}

// Normal enemies can be dodged laterally. Passing the Fox is not a kill and grants no coins.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 10;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.coinsEarned = 3;
  run.kills = 2;
  run.enemies = [{
    id: 997,
    x: run.playerX + 2,
    z: run.distance + 0.01,
    health: 4,
    maxHealth: 4,
    modelId: 'skeleton-warrior',
    coinReward: 50,
  }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.units, 10, 'a normal enemy outside the Fox hitbox deals no contact damage');
  assert.equal(run.enemies.length, 0, 'a dodged enemy leaves the active lane');
  assert.equal(run.kills, 2, 'dodging an enemy does not count as a kill');
  assert.equal(run.coinsEarned, 3, 'dodging an enemy grants no coins');
  assert.equal(run.lastDamageAt, null, 'dodging an enemy does not trigger damage feedback');
  assert.equal(run.defeatEffects.length, 0, 'dodging an enemy creates no reward or smoke effect');
}

// A projectile kill records one stable, positioned reward event for both coin and smoke feedback.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.enemies = [{
    id: 994,
    x: 0.8,
    z: run.distance + 4,
    health: 3,
    maxHealth: 3,
    coinReward: 7,
    scale: 1.4,
    speedMultiplier: 0,
  }];
  run.bullets = [{
    id: 993,
    x: 0.8,
    z: run.distance + 3,
    maxZ: run.distance + 8,
    damage: 3,
  }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies.length, 0, 'the projectile kill removes the enemy');
  assert.equal(run.defeatEffects.length, 1, 'one kill creates one stable defeat effect');
  assert.deepEqual(run.defeatEffects[0], {
    id: 994,
    x: 0.8,
    z: 4,
    amount: 7,
    scale: 1.4,
    createdAt: 50,
  });
  tickState(s, 50 + RUNNER_DEFEAT_EFFECT_LIFETIME_MS + 1);
  assert.equal(run.defeatEffects.length, 0, 'expired defeat effects are removed from simulation state');
}

assert.ok(RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS > 0, 'defeat effects need a positive bounded capacity');

// Mini-bosses and bosses block the whole lane: lateral separation can never avoid contact.
for (const mandatoryEnemy of [
  { flags: { isMiniBoss: true }, label: 'mini-boss' },
  { flags: { isBoss: true }, label: 'boss' },
] as const) {
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 10;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.enemies = [{
    id: mandatoryEnemy.label === 'boss' ? 996 : 995,
    x: run.playerX + 2,
    z: run.distance + 0.01,
    health: 4,
    maxHealth: 9,
    ...mandatoryEnemy.flags,
  }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.units, 6, `${mandatoryEnemy.label} contact cannot be dodged laterally`);
  assert.equal(run.lastDamageAt, 50, `${mandatoryEnemy.label} contact keeps damage feedback`);
  assert.equal(run.enemies.length, 0, `${mandatoryEnemy.label} is consumed by contact`);
}

// Death banks the run's coins into the shop wallet.
state.runner.coinsEarned = 42;
state.runner.units = 1;
state.runner.enemies = [
  { id: 999, x: state.runner.playerX, z: state.runner.distance + 0.01, health: 5, maxHealth: 5 },
];
now += 200;
tickState(state, now);
assert.equal(state.runner.dead, true, 'losing the last unit ends the run');
assert.equal(state.runner.running, false);
assert.equal(state.runnerMeta.coins, 42, 'coins are banked on death');

// The shop spends Runner coins, never mana, while the run is stopped.
const damageCost = runnerUpgradeCost('baseDamage', 0);
state.runnerMeta.coins = damageCost;
const manaBefore = state.mana;
applyAction(state, { type: 'buyRunnerUpgrade', upgradeId: 'baseDamage' });
assert.equal(state.runnerMeta.upgrades.baseDamage, 1);
assert.equal(state.runnerMeta.coins, 0);
assert.equal(state.mana, manaBefore, 'runner upgrades must not touch the global economy');

// Relaunching rebuilds the run from the upgrades, keeping the wallet.
state.runnerMeta.coins = 7;
applyAction(state, { type: 'startRunnerRun' });
assert.equal(state.runner.dead, false);
assert.equal(state.runner.distance, 0);
assert.equal(state.runner.damage, runnerBaseDamage(1), 'the new run uses the bought damage');
assert.equal(state.runnerMeta.coins, 7, 'the wallet survives a relaunch');

// Checkpoint selection is limited by the record and seeds all distance cursors on relaunch.
state.runnerMeta.bestDistance = 1_250;
state.runner.running = false;
state.runner.dead = true;
applyAction(state, { type: 'selectRunnerCheckpoint', distance: 1_000 });
assert.equal(state.runnerMeta.selectedCheckpoint, 1_000);
applyAction(state, { type: 'selectRunnerCheckpoint', distance: 1_500 });
assert.equal(state.runnerMeta.selectedCheckpoint, 1_000, 'a locked checkpoint cannot be selected');
applyAction(state, { type: 'startRunnerRun' });
assert.equal(state.runner.distance, 1_000);
assert.equal(state.runner.nextBossDistance, 1_100);
assert.equal(state.runner.nextGateDistance, 1_030);

// Boss spawning is deterministic and advances its cursor so a marker is never duplicated.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.distance = 60;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  s.lastTick = 0;
  tickState(s, 50);
  const boss = run.enemies.find((enemy) => enemy.isBoss);
  assert.ok(boss, 'the 100 m boss spawns as its marker enters the lane');
  assert.equal(boss.z, 100);
  assert.equal(boss.maxHealth, runnerBossHealth(100));
  assert.equal(run.nextBossDistance, 200);
  const bossId = boss.id;
  s.lastTick = 50;
  tickState(s, 100);
  assert.equal(run.enemies.filter((enemy) => enemy.isBoss && enemy.id === bossId).length, 1);
}

// --- Swept bullet collision (no tunneling) ---------------------------------
// A fast bullet steps more than a body's depth per tick. It must still hit an enemy it
// leaps over, instead of skipping it and being absorbed farther up the lane.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 10;
  run.damage = 5;
  run.fireCooldown = 100; // no fresh volley this tick
  run.enemySpawnTimer = 100; // no fresh enemy
  run.nextGateDistance = 1e9; // no gate
  const enemyZ = run.distance + 6;
  run.enemies = [{ id: 1, x: run.playerX, z: enemyZ, health: 3, maxHealth: 3 }];
  // One tick moves the bullet ~1.7 (> the 0.55 hit radius): the OLD point test skipped it.
  run.bullets = [{ id: 2, x: run.playerX, z: enemyZ - 1, maxZ: enemyZ + 10, damage: 5 }];
  s.lastTick = 0;
  tickState(s, 50); // dt = 0.05
  const survivor = s.runner.enemies.find((e) => e.id === 1);
  assert.ok(!survivor || survivor.health < 3, 'a bullet must hit an enemy it steps past');
  assert.ok(
    !s.runner.bullets.some((b) => b.id === 2),
    'the bullet is consumed by the enemy it crosses, not carried farther up the lane',
  );
}

// The nearest thing in a bullet's path is resolved first (no absorbing into a far target).
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.damage = 4;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  const near = { id: 1, x: run.playerX, z: run.distance + 4, health: 9, maxHealth: 9 };
  const far = { id: 2, x: run.playerX, z: run.distance + 12, health: 9, maxHealth: 9 };
  const nearHitZ = near.z;
  run.enemies = [far, near]; // deliberately array-ordered far-first
  run.bullets = [{ id: 3, x: run.playerX, z: run.distance + 3, maxZ: run.distance + 20, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(near.health, 5, 'the nearer enemy takes the hit');
  assert.equal(far.health, 9, 'the farther enemy is untouched');
  assert.equal(run.impacts.length, 1, 'an enemy hit creates one impact event');
  assert.equal(run.impacts[0]?.x, run.playerX, 'the impact keeps the projectile x coordinate');
  assert.equal(run.impacts[0]?.z, nearHitZ, 'the impact is anchored to the crossed enemy depth');
  assert.equal(run.impacts[0]?.createdAt, 50, 'the impact records the simulation hit time');
}

// A closed gate is a visible barrier and must still absorb a projectile. Once activated,
// the same gate becomes transparent to shots.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  const gateZ = run.distance + 6;
  run.gates = [
    {
      id: 40,
      x: 0,
      z: gateZ,
      kind: 'damage',
      value: 1,
      shotsRequired: 2,
      shotsRemaining: 2,
      activated: false,
    },
  ];
  run.bullets = [{ id: 41, x: 0, z: gateZ - 1, maxZ: gateZ + 3, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.gates[0]?.shotsRemaining, 1, 'a closed visible gate absorbs one shot');
  assert.ok(!run.bullets.some((bullet) => bullet.id === 41), 'the closed gate consumes the projectile');

  run.gates[0]!.activated = true;
  run.bullets = [{ id: 42, x: 0, z: gateZ - 1, maxZ: gateZ + 3, damage: 4 }];
  s.lastTick = 50;
  tickState(s, 100);
  assert.ok(run.bullets.some((bullet) => bullet.id === 42), 'an activated gate lets the projectile pass');
}

// Enemies are created in the hidden spawn margin beyond the readable playfield. A projectile
// may travel slightly beyond the screen for feedback, but it must not disappear against a
// monster that has not entered the visible combat area yet.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.enemies = [
    {
      id: 4,
      x: 0,
      z: run.distance + RUNNER_SPAWN_AHEAD,
      health: 9,
      maxHealth: 9,
      modelId: 'beholder',
      speedMultiplier: 0,
    },
  ];
  run.bullets = [
    {
      id: 5,
      x: 0,
      z: run.distance + RUNNER_SPAWN_AHEAD - 1,
      maxZ: run.distance + RUNNER_SPAWN_AHEAD + 3,
      damage: 4,
    },
  ];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 9, 'an offscreen spawn must not absorb the projectile');
  assert.ok(run.bullets.some((bullet) => bullet.id === 5), 'the projectile continues beyond the screen');
}

// The hidden spawn margin is also excluded from homing. Otherwise the projectile visibly
// bends toward a monster the player cannot read yet, making the intended target look blocked.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  s.runnerMeta.upgrades.homing = 10;
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.enemies = [
    {
      id: 6,
      x: 2,
      z: run.distance + RUNNER_SPAWN_AHEAD,
      health: 9,
      maxHealth: 9,
      modelId: 'beholder',
      speedMultiplier: 0,
    },
  ];
  run.bullets = [
    {
      id: 7,
      x: 0,
      z: run.distance + RUNNER_SPAWN_AHEAD - 2,
      maxZ: run.distance + RUNNER_SPAWN_AHEAD + 3,
      damage: 4,
    },
  ];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.bullets[0]?.x, 0, 'homing ignores an enemy that is still outside combat view');
}

// Once the same enemy has moved out of the spawn margin it becomes a normal visible target.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  const enemyZ = run.distance + RUNNER_ENEMY_TARGETABLE_AHEAD;
  run.enemies = [
    {
      id: 8,
      x: 0,
      z: enemyZ,
      health: 9,
      maxHealth: 9,
      modelId: 'beholder',
      speedMultiplier: 0,
    },
  ];
  run.bullets = [{ id: 9, x: 0, z: enemyZ - 1, maxZ: enemyZ + 3, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 5, 'an enemy inside combat view remains hittable');
  assert.ok(!run.bullets.some((bullet) => bullet.id === 9), 'the visible target consumes the hit');
}

// Impact events are a short bounded visual ledger. Sustained multishot must never grow it.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 100;
  run.speed = 0;
  run.projectileSpeed = 100;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  for (let index = 0; index < RUNNER_MAX_ACTIVE_IMPACTS + 8; index += 1) {
    const z = run.distance + 3;
    run.enemies = [{ id: 1_000 + index, x: 0, z, health: 99, maxHealth: 99 }];
    run.bullets = [{ id: 2_000 + index, x: 0, z: z - 1, maxZ: z + 1, damage: 1 }];
    s.lastTick = index * 10;
    tickState(s, index * 10 + 10);
  }
  assert.equal(run.impacts.length, RUNNER_MAX_ACTIVE_IMPACTS, 'impact history stays at its fixed cap');
}

// Editor scaling must also scale the collision body. Otherwise a small visible monster
// keeps a full-size invisible box around it and absorbs shots that clearly pass beside it.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  const enemyZ = run.distance + 6;
  run.enemies = [
    {
      id: 10,
      x: 0,
      z: enemyZ,
      health: 9,
      maxHealth: 9,
      scale: 0.25,
      speedMultiplier: 0,
      editorPlaced: true,
    },
  ];
  run.bullets = [{ id: 11, x: 0.4, z: enemyZ - 1, maxZ: enemyZ + 10, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 9, 'a shot outside the scaled model must not hit it');
  assert.ok(run.bullets.some((bullet) => bullet.id === 11), 'the shot continues past empty space');
}

// The same rule expands a large monster's body, so shots crossing its visible model count.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  const enemyZ = run.distance + 6;
  run.enemies = [
    {
      id: 12,
      x: 0,
      z: enemyZ,
      health: 9,
      maxHealth: 9,
      scale: 3,
      speedMultiplier: 0,
      editorPlaced: true,
    },
  ];
  run.bullets = [{ id: 13, x: 1.1, z: enemyZ - 1, maxZ: enemyZ + 10, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 5, 'a shot crossing a large scaled model must hit it');
  assert.ok(!run.bullets.some((bullet) => bullet.id === 13), 'the large monster consumes the hit');
}

// Imported monster silhouettes do not share one width. The cactus is visibly wider
// than the old generic radius, so a shot crossing its outer body must still hit.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  const enemyZ = run.distance + 6;
  run.enemies = [
    {
      id: 14,
      x: 0,
      z: enemyZ,
      health: 9,
      maxHealth: 9,
      modelId: 'cactus',
      speedMultiplier: 0,
    },
  ];
  run.bullets = [{ id: 15, x: 0.65, z: enemyZ - 1, maxZ: enemyZ + 10, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 5, 'a shot crossing the visible cactus must hit');
  assert.ok(!run.bullets.some((bullet) => bullet.id === 15), 'the cactus consumes the visible hit');
}

// Conversely, the chest is narrower than the generic radius. A shot outside its visible
// silhouette must not disappear into an invisible collision block.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  const enemyZ = run.distance + 6;
  run.enemies = [
    {
      id: 17,
      x: 0,
      z: enemyZ,
      health: 9,
      maxHealth: 9,
      modelId: 'chest-monster',
      speedMultiplier: 0,
    },
  ];
  run.bullets = [{ id: 18, x: 0.52, z: enemyZ - 1, maxZ: enemyZ + 10, damage: 4 }];
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(run.enemies[0]?.health, 9, 'a shot outside the visible chest must not hit');
  assert.ok(run.bullets.some((bullet) => bullet.id === 18), 'the shot continues past empty space');
}

// --- Advanced movement and projectile statistics -------------------------

{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 0;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  s.lastTick = 0;
  tickState(s, 50);
  assert.equal(
    run.bullets[0]?.z,
    run.distance + RUNNER_PROJECTILE_LAUNCH_OFFSET + run.projectileSpeed * 0.05,
    'a new projectile starts ahead of the Fox and then advances for the tick',
  );
}
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  s.runnerMeta.upgrades.lateralSpeed = 4;
  s.runnerMeta.upgrades.attackRange = 4;
  s.runnerMeta.upgrades.multishot = 2;
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  assert.equal(run.lateralSpeed, runnerLateralSpeed(4), 'a new run uses the lateral-speed upgrade');
  assert.equal(run.attackRange, runnerAttackRange(4), 'a new run uses the attack-range upgrade');
  assert.equal(run.attacks, 3, 'attack count is one base projectile plus multishot');
  run.units = 10;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.fireCooldown = 0;
  s.lastTick = 1_000;
  tickState(s, 1_016);
  assert.equal(run.bullets.length, 3, 'two multishot levels add two bullets to the single base shot');
  assert.ok(
    run.bullets.every((bullet) => bullet.damage === run.damage),
    'lives must not multiply projectile damage',
  );
  assert.ok(
    run.bullets.every(
      (bullet) => Math.abs(
        bullet.maxZ - run.distance - RUNNER_PROJECTILE_LAUNCH_OFFSET - run.attackRange,
      ) < 1e-9,
    ),
    'shots snapshot their max range',
  );
}

{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  s.runnerMeta.upgrades.multishot = 99;
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.units = 40;
  run.fireCooldown = 0;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.bullets = Array.from({ length: RUNNER_MAX_ACTIVE_PROJECTILES - 1 }, (_, index) => ({
    id: 100 + index,
    x: 0,
    z: run.distance,
    maxZ: run.distance + 100,
    damage: 1,
  }));
  s.lastTick = 1_000;
  tickState(s, 1_016);
  assert.equal(
    run.bullets.length,
    RUNNER_MAX_ACTIVE_PROJECTILES,
    'the simulation must never exceed its active-projectile budget',
  );
}

{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  s.runnerMeta.upgrades.homing = 1;
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.enemies = [{ id: 20, x: 2, z: 10, health: 50, maxHealth: 50 }];
  run.bullets = [{ id: 21, x: -2, z: 0, maxZ: 20, damage: 1 }];
  s.lastTick = 1_000;
  tickState(s, 1_050);
  assert.ok(run.bullets[0]!.x > -2, 'homing steers a shot toward the nearest enemy');
}

// The rendered projectile still stops at maxZ, but its narrow forward feel margin may
// connect with a visible enemy whose model appears touched because of camera perspective.
{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.speed = 0;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.nextBossDistance = 1e9;
  run.enemies = [{
    id: 24,
    x: 0,
    z: 10.75,
    health: 1,
    maxHealth: 1,
    modelId: 'cactus',
    speedMultiplier: 0,
  }];
  run.bullets = [{ id: 25, x: 0, z: 9.9, maxZ: 10, damage: 1 }];
  s.lastTick = 1_000;
  tickState(s, 1_050);
  assert.equal(run.enemies.length, 0, 'the small forward hit margin fixes the perceived edge miss');
  assert.equal(run.bullets.length, 0, 'the projectile remains consumed at its visible max range');
}

{
  const s = createInitialState();
  s.books.runner.unlocked = true;
  s.openBookPanels = [{ bookId: 'runner', slot: 0 }];
  s.selectedBook = 'runner';
  s.runnerMeta.upgrades.projectileSpeed = 3;
  applyAction(s, { type: 'startRunnerRun' });
  const run = s.runner;
  run.fireCooldown = 100;
  run.enemySpawnTimer = 100;
  run.nextGateDistance = 1e9;
  run.bullets = [{ id: 30, x: 0, z: 0, maxZ: 100, damage: 1 }];
  s.lastTick = 1_000;
  tickState(s, 1_050);
  assert.equal(run.bullets[0]!.z, runnerProjectileSpeed(3) * 0.05);

  run.bullets = [{ id: 31, x: 0, z: 9.9, maxZ: 10, damage: 1 }];
  s.lastTick = 1_050;
  tickState(s, 1_100);
  assert.equal(run.bullets.length, 0, 'a shot disappears once it reaches its attack range');
}

console.log('runnerRules ok');
