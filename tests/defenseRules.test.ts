import assert from 'node:assert/strict';
import {
  defenseEnemyEdgePoint,
  defenseEnemyDistanceFromCenter,
  defenseEnemyInTowerHitbox,
  defenseEnemyInTowerRange,
  defenseEnemyPathDistanceForCenterRange,
  defenseEnemyPosition,
  nextDefenseSpeedMultiplier,
  randomDefenseTreeSpawnLane,
} from '../src/game/simulation/defenseRules.ts';
import {
  applyAction,
  defenseEnemyReward,
  defenseWaveEnemyCount,
  defenseWaveProgress,
  defenseMaxTowerHealth,
  defenseMoneyPerWave,
  defenseSkillCost,
  defenseSkillMaxLevel,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseTowerHitDamage,
  defenseTowerHitResult,
  defenseTowerRange,
  defenseTowerRangePercent,
  tickState,
  type DefenseSkillId,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

assert.deepEqual(defenseEnemyEdgePoint(0), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(90), { x: 50, y: 100 });
assert.deepEqual(defenseEnemyEdgePoint(180), { x: 0, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(270), { x: 50, y: 0 });

assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 1 }), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0.5 }), { x: 75, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0 }), { x: 50, y: 50 });
assert.equal(defenseEnemyPathDistanceForCenterRange({ lane: 0 }, 0.25), 0.25);
assert.equal(Number(defenseEnemyPathDistanceForCenterRange({ lane: 45 }, 0.25).toFixed(3)), 0.177);
assert.equal(Number(defenseEnemyDistanceFromCenter({ lane: 45, distance: defenseEnemyPathDistanceForCenterRange({ lane: 45 }, 0.25) }).toFixed(3)), 0.25);

assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.68 }, 0.68), true);
assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.69 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.68 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.48 }, 0.68), true);

assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.025 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.026 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.025 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.026 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 45, distance: 0.017 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 45, distance: 0.018 }), false);

assert.equal(nextDefenseSpeedMultiplier(1), 2);
assert.equal(nextDefenseSpeedMultiplier(2), 4);
assert.equal(nextDefenseSpeedMultiplier(4), 1);
assert.equal(nextDefenseSpeedMultiplier(99), 1);

const treeSpawnLanes = Array.from({ length: 120 }, (_, index) =>
  randomDefenseTreeSpawnLane(() => ((index * 37) % 120) / 120),
);
assert.equal(new Set(treeSpawnLanes.map((lane) => Math.round(lane))).size > 30, true);
for (const lane of treeSpawnLanes) {
  const edge = defenseEnemyEdgePoint(lane);
  const isOnMapEdge = edge.x === 0 || edge.x === 100 || edge.y === 0 || edge.y === 100;
  const isBottomDirtPathGap = edge.y === 100 && edge.x >= 40 && edge.x <= 60;
  assert.equal(isOnMapEdge, true);
  assert.equal(isBottomDirtPathGap, false);
}

const state = createInitialState();
state.books.defense.unlocked = true;
state.mana = 10000;

const defenseSkillIds: DefenseSkillId[] = [
  'damage',
  'attackSpeed',
  'range',
  'criticalChance',
  'criticalMultiplier',
  'ricochetCount',
  'ricochetChance',
  'superCriticalChance',
  'superCriticalMultiplier',
  'health',
  'healthRegen',
  'resistance',
  'moneyPerEnemy',
  'moneyPerWave',
];

for (const skillId of defenseSkillIds) {
  assert.equal(state.defenseSkills[skillId], 0);
  assert.equal(defenseSkillMaxLevel(skillId) > 0, true);
  assert.equal(defenseSkillCost(state, skillId) > 0, true);
}

applyAction(state, { type: 'buyDefenseSkill', skillId: 'damage' });
assert.equal(state.defenseSkills.damage, 0);
assert.equal(state.mana, 10000);

state.resources.sigils = 10000;

assert.equal(defenseTowerRangePercent(state), 0.3);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 552);

const noSkillBookLevelState = createInitialState();
noSkillBookLevelState.books.defense.unlocked = true;
noSkillBookLevelState.books.defense.level = 8;
noSkillBookLevelState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
noSkillBookLevelState.lastTick = 3000;
noSkillBookLevelState.defense.tower.cooldown = 0;
noSkillBookLevelState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

assert.equal(defenseTowerDamage(noSkillBookLevelState), 1);
assert.equal(defenseTowerAttackInterval(noSkillBookLevelState), 0.78);

tickState(noSkillBookLevelState, 3016);

assert.equal(noSkillBookLevelState.defense.shotPulse, 1);
assert.equal(noSkillBookLevelState.defense.shots.length, 1);
assert.equal(noSkillBookLevelState.defense.damagePopups[0]?.amount, 1);
assert.equal(noSkillBookLevelState.defense.enemies[0]?.health, 1);
assert.equal(noSkillBookLevelState.defense.enemies[0]?.state, 'walking');

const pausedDefenseState = createInitialState();
pausedDefenseState.books.defense.unlocked = true;
pausedDefenseState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
pausedDefenseState.selectedBook = 'defense';
pausedDefenseState.lastTick = 3500;
pausedDefenseState.defense.tower.cooldown = 0;
pausedDefenseState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

applyAction(pausedDefenseState, { type: 'toggleDefensePause' });
tickState(pausedDefenseState, 3600);

assert.equal(pausedDefenseState.defense.paused, true);
assert.equal(pausedDefenseState.defense.running, false);
assert.equal(pausedDefenseState.defense.shotPulse, 0);
assert.equal(pausedDefenseState.defense.enemies[0]?.distance, 0.4);
assert.equal(pausedDefenseState.defense.enemies[0]?.health, 2);

applyAction(pausedDefenseState, { type: 'toggleDefensePause' });
tickState(pausedDefenseState, 3616);

assert.equal(pausedDefenseState.defense.paused, false);
assert.equal(pausedDefenseState.defense.shotPulse, 1);
assert.equal(pausedDefenseState.defense.enemies[0]?.health, 1);

const hitStopState = createInitialState();
hitStopState.books.defense.unlocked = true;
hitStopState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
hitStopState.lastTick = 5000;
hitStopState.defense.tower.cooldown = 0;
hitStopState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

tickState(hitStopState, 5016);

assert.equal(hitStopState.defense.enemies[0]?.health, 1);
assert.equal(hitStopState.defense.enemies[0]?.distance, 0.4);

tickState(hitStopState, 5082);
assert.equal(hitStopState.defense.enemies[0]?.distance, 0.4);

tickState(hitStopState, 5098);
assert.equal((hitStopState.defense.enemies[0]?.distance ?? 0) < 0.4, true);

const waveProgressState = createInitialState();
waveProgressState.books.defense.unlocked = true;
waveProgressState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
waveProgressState.lastTick = 4000;
waveProgressState.defense.spawnedThisWave = 3;

assert.equal(defenseWaveProgress(waveProgressState), 0);

waveProgressState.defense.tower.cooldown = 0;
waveProgressState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];

tickState(waveProgressState, 4016);

assert.equal(waveProgressState.defense.enemies[0]?.state, 'dying');
assert.equal(waveProgressState.defense.killsThisWave, 1);
assert.equal(waveProgressState.defense.moneyPopups.length, 1);
assert.equal(waveProgressState.defense.moneyPopups[0]?.amount, defenseEnemyReward(waveProgressState));
assert.equal(defenseWaveProgress(waveProgressState), 1 / defenseWaveEnemyCount(waveProgressState));

const clusteredRewardState = createInitialState();
clusteredRewardState.books.defense.unlocked = true;
clusteredRewardState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
clusteredRewardState.lastTick = 6000;
clusteredRewardState.defense.tower.cooldown = 999;
clusteredRewardState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 1, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
clusteredRewardState.defense.queuedShots = [
  { enemyId: 1, damageScale: 1 },
  { enemyId: 2, damageScale: 1 },
];

tickState(clusteredRewardState, 6016);
tickState(clusteredRewardState, 6096);

assert.equal(clusteredRewardState.defense.killsThisWave, 2);
assert.equal(clusteredRewardState.defense.moneyPopups.length, 1);
assert.equal(clusteredRewardState.defense.moneyPopups[0]?.amount, defenseEnemyReward(clusteredRewardState) * 2);

const retargetQueuedShotState = createInitialState();
retargetQueuedShotState.books.defense.unlocked = true;
retargetQueuedShotState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
retargetQueuedShotState.lastTick = 7000;
retargetQueuedShotState.defense.tower.cooldown = 999;
retargetQueuedShotState.defense.spawnedThisWave = defenseWaveEnemyCount(retargetQueuedShotState);
retargetQueuedShotState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 2, distance: 0.42, health: 3, maxHealth: 3, state: 'walking', deathTimer: 0 },
];
retargetQueuedShotState.defense.queuedShots = [
  { enemyId: 1, damageScale: 1 },
  { enemyId: 1, damageScale: 1 },
];

tickState(retargetQueuedShotState, 7016);
tickState(retargetQueuedShotState, 7096);

assert.equal(retargetQueuedShotState.defense.enemies[0]?.id, 1);
assert.equal(retargetQueuedShotState.defense.enemies[0]?.state, 'dying');
assert.equal(retargetQueuedShotState.defense.enemies[1]?.id, 2);
assert.equal(retargetQueuedShotState.defense.enemies[1]?.health, 2);
assert.equal(retargetQueuedShotState.defense.shots.length, 2);
assert.equal(retargetQueuedShotState.defense.queuedShots.length, 0);

const stopQueuedShotState = createInitialState();
stopQueuedShotState.books.defense.unlocked = true;
stopQueuedShotState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
stopQueuedShotState.lastTick = 7200;
stopQueuedShotState.defense.tower.cooldown = 999;
stopQueuedShotState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 0, maxHealth: 1, state: 'dying', deathTimer: 0.5 },
];
stopQueuedShotState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(stopQueuedShotState, 7216);

assert.equal(stopQueuedShotState.defense.shots.length, 0);
assert.equal(stopQueuedShotState.defense.damagePopups.length, 0);
assert.equal(stopQueuedShotState.defense.queuedShots.length, 0);

const sigilsBeforeDefenseSkillBuy = state.resources.sigils;
const damageSkillCost = defenseSkillCost(state, 'damage');
applyAction(state, { type: 'buyDefenseSkill', skillId: 'damage' });
assert.equal(state.defenseSkills.damage, 1);
assert.equal(state.resources.sigils, sigilsBeforeDefenseSkillBuy - damageSkillCost);
assert.equal(state.mana, 10000);

applyAction(state, { type: 'buyDefenseSkill', skillId: 'attackSpeed' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'range' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'health' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'moneyPerEnemy' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'moneyPerWave' });

assert.equal(state.defenseSkills.damage, 1);
assert.equal(state.mana, 10000);
assert.equal(defenseTowerDamage(state), 2);
assert.equal(defenseTowerAttackInterval(state) < 0.78, true);
state.defenseSkills.attackSpeed = defenseSkillMaxLevel('attackSpeed');
assert.equal(defenseTowerAttackInterval(state), 0.25);
state.defenseSkills.attackSpeed = 1;
assert.equal(defenseTowerRangePercent(state) > 0.3, true);
assert.equal(defenseTowerRange(state) > 0.552, true);
state.defenseSkills.range = defenseSkillMaxLevel('range');
assert.equal(defenseTowerRangePercent(state), 0.8);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 872);
assert.equal(defenseMaxTowerHealth(state), 12);
assert.equal(defenseEnemyReward(state), 2);
assert.equal(defenseMoneyPerWave(state), 3);

const debugTowerHealthState = createInitialState();
debugTowerHealthState.books.defense.unlocked = true;
debugTowerHealthState.defenseSkills.health = 2;
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 14);
applyAction(debugTowerHealthState, { type: 'setDefenseDebugTowerHealth', enabled: true });
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 10000);
assert.equal(debugTowerHealthState.defense.towerHealth, 10000);
applyAction(debugTowerHealthState, { type: 'setDefenseDebugTowerHealth', enabled: false });
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 14);
assert.equal(debugTowerHealthState.defense.towerHealth, 14);

state.defenseSkills.criticalChance = 10;
state.defenseSkills.criticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.1), 5);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.1), { amount: 5, kind: 'critical' });

state.defenseSkills.superCriticalChance = 5;
state.defenseSkills.superCriticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.01), 8);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.01), { amount: 8, kind: 'superCritical' });

const cooldownState = createInitialState();
cooldownState.books.defense.unlocked = true;
cooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
cooldownState.lastTick = 1000;
cooldownState.defense.tower.cooldown = 0;
cooldownState.defense.shotPulse = 3;
cooldownState.defense.shots = [{ id: 3, lane: 0, distance: 0.4, timer: 0.08, duration: 0.08 }];
cooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(cooldownState, 1016);

assert.equal(cooldownState.defense.shotPulse, 4);
assert.equal(cooldownState.defense.shots.length, 2);
assert.equal(cooldownState.defense.enemies[0]?.health, 9);

const speedCooldownState = createInitialState();
speedCooldownState.books.defense.unlocked = true;
speedCooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
speedCooldownState.lastTick = 1000;
speedCooldownState.defense.speedMultiplier = 4;
speedCooldownState.defense.tower.cooldown = 0;
speedCooldownState.defense.shotPulse = 7;
speedCooldownState.defense.shots = [{ id: 7, lane: 0, distance: 0.4, timer: 0.08, duration: 0.08 }];
speedCooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(speedCooldownState, 1050);

assert.equal(speedCooldownState.defense.shotPulse, 8);
assert.equal(speedCooldownState.defense.enemies[0]?.health, 9);
assert.equal(speedCooldownState.defense.shots.map((shot) => shot.id).join(','), '7,8');

const collisionPriorityState = createInitialState();
collisionPriorityState.books.defense.unlocked = true;
collisionPriorityState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
collisionPriorityState.lastTick = 1000;
collisionPriorityState.defense.speedMultiplier = 4;
collisionPriorityState.defense.tower.cooldown = 0;
collisionPriorityState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.27, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];

tickState(collisionPriorityState, 1100);

assert.equal(collisionPriorityState.defense.shotPulse, 1);
assert.equal(collisionPriorityState.defense.shots[0]?.id, 1);
assert.equal(collisionPriorityState.defense.enemies[0]?.id, 1);
assert.equal(collisionPriorityState.defense.enemies[0]?.state, 'dying');

const simultaneousTowerAttackState = createInitialState();
simultaneousTowerAttackState.books.defense.unlocked = true;
simultaneousTowerAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
simultaneousTowerAttackState.lastTick = 1000;
simultaneousTowerAttackState.defense.tower.cooldown = 99;
simultaneousTowerAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(simultaneousTowerAttackState);
simultaneousTowerAttackState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, kind: 'slime', lane: 90, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(simultaneousTowerAttackState, 1016);

assert.equal(simultaneousTowerAttackState.defense.enemies.length, 2);
assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 2);
assert.equal(simultaneousTowerAttackState.defense.enemies[0]?.state, 'attacking');
assert.equal(simultaneousTowerAttackState.defense.enemies[1]?.state, 'attacking');

tickState(simultaneousTowerAttackState, 2016);

assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 2);

tickState(simultaneousTowerAttackState, 3016);

assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 4);
assert.equal(simultaneousTowerAttackState.defense.enemies.length, 2);

const skeletonMageState = createInitialState();
skeletonMageState.books.defense.unlocked = true;
skeletonMageState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
skeletonMageState.lastTick = 3000;
skeletonMageState.defense.tower.cooldown = 99;
skeletonMageState.defense.enemies = [
  {
    id: 1,
    kind: 'skeletonMage',
    lane: 0,
    distance: 0.255,
    health: 2,
    maxHealth: 2,
    state: 'walking',
    deathTimer: 0,
    attackCooldown: 0,
  },
];

tickState(skeletonMageState, 3100);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.25);
assert.equal(skeletonMageState.defense.enemies[0]?.state, 'attacking');
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 0);

tickState(skeletonMageState, 3600);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.25);
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 1);
assert.equal(skeletonMageState.defense.towerHealth, defenseMaxTowerHealth(skeletonMageState));

tickState(skeletonMageState, 4200);
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 0);
assert.equal(skeletonMageState.defense.towerHealth, defenseMaxTowerHealth(skeletonMageState) - 1);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.25);

const diagonalSkeletonMageState = createInitialState();
diagonalSkeletonMageState.books.defense.unlocked = true;
diagonalSkeletonMageState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
diagonalSkeletonMageState.lastTick = 3000;
diagonalSkeletonMageState.defense.tower.cooldown = 99;
diagonalSkeletonMageState.defense.enemies = [
  {
    id: 1,
    kind: 'skeletonMage',
    lane: 45,
    distance: 0.181,
    health: 2,
    maxHealth: 2,
    state: 'walking',
    deathTimer: 0,
    attackCooldown: 0,
  },
];
tickState(diagonalSkeletonMageState, 3100);
assert.equal(Number(diagonalSkeletonMageState.defense.enemies[0]?.distance.toFixed(3)), 0.177);
assert.equal(Number(defenseEnemyDistanceFromCenter(diagonalSkeletonMageState.defense.enemies[0]!).toFixed(3)), 0.25);
assert.equal(diagonalSkeletonMageState.defense.enemies[0]?.state, 'attacking');

const batSpawnState = createInitialState();
batSpawnState.books.defense.unlocked = true;
batSpawnState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
batSpawnState.lastTick = 7000;
batSpawnState.defense.wave = 2;
batSpawnState.defense.spawnedThisWave = 3;
batSpawnState.defense.spawnTimer = 99;
batSpawnState.defense.tower.cooldown = 99;

tickState(batSpawnState, 7016);

assert.equal(batSpawnState.defense.enemies[0]?.kind, 'bat');
assert.equal(batSpawnState.defense.enemies[0]?.maxHealth, 1);
assert.equal((batSpawnState.defense.enemies[0]?.distance ?? 1) < 1, true);

const batAttackState = createInitialState();
batAttackState.books.defense.unlocked = true;
batAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
batAttackState.lastTick = 8000;
batAttackState.defense.tower.cooldown = 99;
batAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(batAttackState);
batAttackState.defense.enemies = [
  {
    id: 1,
    kind: 'bat',
    lane: 0,
    distance: 0.055,
    health: 1,
    maxHealth: 1,
    state: 'walking',
    deathTimer: 0,
  },
];

tickState(batAttackState, 8200);
assert.equal(batAttackState.defense.enemies[0]?.state, 'attacking');
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);

tickState(batAttackState, 8600);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);
assert.equal(batAttackState.defense.enemies.length, 1);

tickState(batAttackState, 10200);
assert.equal(batAttackState.defense.enemies.length, 1);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);

tickState(batAttackState, 10800);
assert.equal(batAttackState.defense.enemies.length, 1);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 2);

const ricochetState = createInitialState();
ricochetState.books.defense.unlocked = true;
ricochetState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
ricochetState.lastTick = 2000;
ricochetState.defense.tower.cooldown = 0;
ricochetState.defenseSkills.ricochetCount = 2;
ricochetState.defenseSkills.ricochetChance = defenseSkillMaxLevel('ricochetChance');
ricochetState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.38, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 12, distance: 0.42, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 3, lane: 348, distance: 0.44, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

const originalRandom = Math.random;
Math.random = () => 0;
try {
  tickState(ricochetState, 2016);
  assert.equal(ricochetState.defense.shotPulse, 1);
  assert.equal(ricochetState.defense.shots.length, 1);
  assert.equal(ricochetState.defense.damagePopups.length, 1);
  assert.equal(ricochetState.defense.enemies[0]?.health, 4);
  assert.equal(ricochetState.defense.enemies[1]?.health, 5);
  assert.equal(ricochetState.defense.enemies[2]?.health, 5);

  tickState(ricochetState, 2216);
  assert.equal(ricochetState.defense.shotPulse, 2);
  assert.equal(ricochetState.defense.shots.length, 2);
  assert.equal(ricochetState.defense.damagePopups.length, 2);
  assert.equal(ricochetState.defense.enemies[1]?.health, 4);

  tickState(ricochetState, 2416);
  assert.equal(ricochetState.defense.shotPulse, 3);
  assert.equal(ricochetState.defense.shots.map((shot) => shot.id).join(','), '2,3');
  assert.equal(ricochetState.defense.damagePopups.length, 3);
  assert.equal(ricochetState.defense.enemies[2]?.health, 4);
} finally {
  Math.random = originalRandom;
}

const ricochetIgnoresDeadState = createInitialState();
ricochetIgnoresDeadState.books.defense.unlocked = true;
ricochetIgnoresDeadState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
ricochetIgnoresDeadState.lastTick = 3000;
ricochetIgnoresDeadState.defense.tower.cooldown = 0;
ricochetIgnoresDeadState.defenseSkills.ricochetCount = 2;
ricochetIgnoresDeadState.defenseSkills.ricochetChance = defenseSkillMaxLevel('ricochetChance');
ricochetIgnoresDeadState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.38, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 3, distance: 0.39, health: 0, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 3, lane: 6, distance: 0.4, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

Math.random = () => 0;
try {
  tickState(ricochetIgnoresDeadState, 3016);
  assert.deepEqual(
    ricochetIgnoresDeadState.defense.queuedShots.map((shot) => shot.enemyId),
    [3],
  );
} finally {
  Math.random = originalRandom;
}

console.log('defenseRules ok');
